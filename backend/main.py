import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
from huggingface_hub import InferenceClient
from openai import OpenAI  # Added for unified HF model routing
from dotenv import load_dotenv
from typing import List, Dict
import json
import re
import difflib
import google.generativeai as genai
import base64
import uuid
from detector import detect_hidden_ingredients




# 1.5 Helper functions for string similarity validation (prevents false positive vector matches)
def clean_chemical_name(name: str) -> str:
    name = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    return ' '.join(name.split()).lower()

def calculate_match_score_raw(scanned_clean: str, matched_clean: str) -> float:
    # 1. Direct substring check (ignoring spaces)
    scanned_nospace = scanned_clean.replace(" ", "")
    matched_nospace = matched_clean.replace(" ", "")
    if matched_nospace and matched_nospace in scanned_nospace:
        return 0.98
        
    s_words = scanned_clean.split()
    m_words = matched_clean.split()
    
    if not s_words or not m_words:
        return 0.0
        
    STOP_WORDS = {"and", "of", "in", "for", "with", "to", "or", "a", "an", "the"}
    
    word_scores = []
    for w_m in m_words:
        best_word_score = 0.0
        for w_s in s_words:
            if w_m == w_s:
                best_word_score = 1.0
                break
            
            # Check for substring (min length 3 to allow "soy" in "soya")
            is_sub = (w_s in w_m and len(w_s) >= 3) or (w_m in w_s and len(w_m) >= 3)
            ratio = difflib.SequenceMatcher(None, w_m, w_s).ratio()
            
            if is_sub:
                word_score = max(ratio, 0.85)
            else:
                # If length is 3 or less and not a substring, require exact match (prevents SLS false matching SLES or random OCR noise)
                if len(w_m) <= 3:
                    word_score = 0.0
                else:
                    word_score = ratio
                
            if word_score > best_word_score:
                best_word_score = word_score
                
        # If a non-stop-word key term is completely missing (score < 0.72), fail the match
        if w_m not in STOP_WORDS and best_word_score < 0.72:
            return 0.0
            
        word_scores.append(best_word_score)
        
    avg_word_score = sum(word_scores) / len(word_scores)

    return avg_word_score



def calculate_match_score(scanned: str, matched: str) -> float:
    scanned_clean = clean_chemical_name(scanned)
    
    # A. Check direct matches against contents inside parentheses first
    max_score = 0.0
    parenthesis_contents = re.findall(r'\((.*?)\)', matched)
    for content in parenthesis_contents:
        content_clean = clean_chemical_name(content)
        if content_clean:
            score = calculate_match_score_raw(scanned_clean, content_clean)
            if score > max_score:
                max_score = score
                
    # B. Also check the base name without parentheses
    matched_no_parens = re.sub(r'\(.*?\)', '', matched)
    matched_clean = clean_chemical_name(matched_no_parens)
    score = calculate_match_score_raw(scanned_clean, matched_clean)
    if score > max_score:
        max_score = score
        
    return max_score

def verify_match_similarity(scanned: str, matched: str) -> bool:
    # We require a robust similarity score to pass validation
    return calculate_match_score(scanned, matched) >= 0.82


# Load dataset once into memory for local fallback searches
local_dataset = []
try:
    with open("ingredients_dataset.json", "r", encoding="utf-8") as f:
        local_dataset = json.load(f)
except Exception as e:
    print(f"Error loading ingredients_dataset.json for local search: {e}")

def find_local_fuzzy_match(scanned_name: str):
    best_match = None
    best_score = 0.0
    
    for item in local_dataset:
        matched_name = item["name"]
        score = calculate_match_score(scanned_name, matched_name)
        if score > best_score:
            best_score = score
            best_match = item
            
    if best_score >= 0.82:  # Robust fuzzy threshold matching the vector similarity check
        return best_match, best_score
    return None, 0


# 1. Boot up secrets and core engines
load_dotenv()

if os.getenv("GEMINI_API_KEY"):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="LabelSpy AI Backend Engine")



# Configure CORS so your React frontend can talk to this server securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local frontend connection requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to our live services
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("labelspy-index")

# Keeps vector embeddings stable
hf_client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HF_TOKEN"),
)

# Added: Custom OpenAI client pointing exactly to the Hugging Face Serverless Router
hf_router_client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN"),
)

# 2. Define what a user request data packet looks like
class IngredientRequest(BaseModel):
    text: str

class VisionRequest(BaseModel):
    image_data: str


# 3. Base Health-Check Route
@app.get("/")
def home():
    return {"status": "online", "message": "LabelSpy AI Engine is listening..."}




# 3.5 Return entire database for frontend Knowledge Base
@app.get("/ingredients")
def get_all_ingredients():
    try:
        with open("ingredients_dataset.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not load database")

# 3.6 Query live Pinecone database statistics
@app.get("/database-stats")
def get_database_stats():
    try:
        stats = index.describe_index_stats()
        total_vectors = stats.get("total_vector_count", 0)
        return {"total_vectors": total_vectors}
    except Exception as e:
        # Fallback to 0 if Pinecone fails or index is not initialized yet
        return {"total_vectors": 0, "error": str(e)}

# 3.7 AI Vision Extraction Route
@app.post("/extract-vision")
def extract_vision(request: VisionRequest):
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise HTTPException(status_code=500, detail="Gemini API Key is not configured in .env")

        # Split base64 image data string into header and data parts
        header, b64data = request.image_data.split(",", 1)
        mime_type = header.split(":")[1].split(";")[0]

        model = genai.GenerativeModel("gemini-3.1-flash-lite")
        response = model.generate_content([
            """You are a master forensic label reader. Extract the exact ingredient list from this product label image.
RULES:
1. Return ONLY a single comma-separated string. No markdown, no intro text, no bullet points.
2. Remove all percentages (e.g., '10%'), marketing fluff ('100% Natural', 'No Added Sugar'), and trailing punctuation.
3. If the label is not in English, silently translate the ingredients to their standard English chemical or common names.
4. IMPORTANT: Keep E-numbers, INS codes, and sub-ingredients grouped WITH their parent ingredient. Do NOT separate them into new items. Example: 'Raising Agents [503 (ii), 500]', 'Emulsifier (472e)' -> 'Raising Agents 503 500', 'Emulsifier 472e'.
5. Ignore nutritional tables, distributor addresses, and allergy warnings (e.g. 'Contains milk').""",
            {
                "mime_type": mime_type,
                "data": base64.b64decode(b64data)
            }
        ])
        
        extracted_text = response.text.strip()
        return {"extracted_text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def smart_split_ingredients(text: str) -> List[str]:
    result = []
    current = []
    depth = 0
    for char in text:
        if char in '([{':
            depth += 1
        elif char in ')]}':
            depth -= 1
        
        if char == ',' and depth <= 0:
            result.append(''.join(current).strip())
            current = []
        else:
            current.append(char)
            
    if current:
        result.append(''.join(current).strip())
    return result

def auto_research_and_save_ingredient(ingredient_name: str) -> dict:
    try:
        model = genai.GenerativeModel("gemini-3.1-flash-lite")
        prompt = f"""You are a chemical safety expert. A user scanned an ingredient label and found the following unlisted ingredient: '{ingredient_name}'. 
Analyze this ingredient and return a strict JSON object with EXACTLY the following keys:
{{
  "name": "Standardized/Corrected name of the ingredient",
  "type": "toxic", "moderate", or "safe",
  "category": "e.g., Food - Preservative, Cosmetic - Emollient",
  "profile": "A brief 1-2 sentence description of its purpose and any health/safety impacts."
}}
Ensure the output is ONLY valid JSON, without any markdown formatting."""

        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()
        
        parsed_data = json.loads(raw_text)
        
        # 1. Update the local JSON file to get the next ID
        script_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_path = os.path.join(script_dir, "ingredients_dataset.json")
        
        dataset = []
        if os.path.exists(dataset_path):
            with open(dataset_path, "r", encoding="utf-8") as file:
                dataset = json.load(file)
                
        # Generate sequential ID like chem_301
        next_id_num = len(dataset) + 1
        new_id = f"chem_{next_id_num:03d}"
        
        # Reconstruct the dictionary to enforce strict key order (id first)
        data = {
            "id": new_id,
            "name": parsed_data.get("name", ingredient_name),
            "type": parsed_data.get("type", "safe"),
            "category": parsed_data.get("category", "Unknown"),
            "profile": parsed_data.get("profile", "No description available.")
        }
        
        dataset.append(data)
        with open(dataset_path, "w", encoding="utf-8") as file:
            json.dump(dataset, file, indent=4)
                
        # 2. Update Pinecone
        combined_text = f"Ingredient Name: {data['name']}. Description: {data['profile']}"
        raw_embedding = hf_client.feature_extraction(
            text=combined_text,
            model="sentence-transformers/all-MiniLM-L6-v2"
        )
        vector_embedding = [float(x) for x in raw_embedding]
        
        index.upsert(
            vectors=[
                {
                    "id": data["id"],
                    "values": vector_embedding,
                    "metadata": {
                        "name": data["name"],
                        "type": data["type"],
                        "category": data["category"],
                        "profile": data["profile"]
                    }
                }
            ]
        )
        
        return data
    except Exception as e:
        print(f"Auto-research failed for {ingredient_name}: {e}")
        return None

# 4. The Upgraded 3-Tag Master Query Route
@app.post("/analyze")
def analyze_ingredients(request: IngredientRequest):
    try:
        # Step A: Split raw text by commas, respecting brackets
        raw_list = smart_split_ingredients(request.text)
        
        # Step B: Trim spaces and remove duplicate entries
        seen = set()
        cleaned_ingredients = []
        for item in raw_list:
            stripped = item.strip()
            if stripped and stripped.lower() not in seen:
                seen.add(stripped.lower())
                cleaned_ingredients.append(stripped)

        # Initialize our clean structural sorting arrays
        flagged_hazards = []
        moderate_additives = []
        verified_safe_items = []
        unlisted_ingredients = []

        # Step C: Loop through the unique ingredients list
        for ingredient in cleaned_ingredients:
            # Wrap the ingredient inside our structured context anchor string
            boosted_search_text = f"Ingredient Name: {ingredient}."

            raw_embedding = hf_client.feature_extraction(
                text=boosted_search_text,
                model="sentence-transformers/all-MiniLM-L6-v2"
            )
            vector_embedding = [float(x) for x in raw_embedding]

            query_response = index.query(
                vector=vector_embedding,
                top_k=5,
                include_metadata=True
            )

            matches = query_response.get("matches", [])
            
            matched_successfully = False
            valid_candidates = []
            
            for match in matches:
                score = match.get("score", 0)

                # Check if it crosses our confidence threshold
                if score >= 0.60:
                    metadata = match["metadata"]
                    matched_name = metadata.get("name", "")
                    
                    # Prevent false positive vector matches by verifying character/word similarity
                    if verify_match_similarity(ingredient, matched_name):
                        match_score = calculate_match_score(ingredient, matched_name)
                        valid_candidates.append((match_score, match))
            
            if valid_candidates:
                # Sort candidates by similarity score descending
                valid_candidates.sort(key=lambda x: x[0], reverse=True)
                best_score, best_match = valid_candidates[0]
                
                metadata = best_match["metadata"]
                matched_name = metadata.get("name", "")
                db_type = metadata.get("type", "").lower()
                
                payload = {
                    "ingredient": ingredient,
                    "matched_as": matched_name,
                    "category": metadata.get("category"),
                    "profile": metadata.get("profile"),
                    "match_confidence": f"{round(best_score * 100, 2)}%"
                }

                # Route the data to its respective bucket based on the dataset tag
                if db_type == "toxic":
                    flagged_hazards.append(payload)
                elif db_type == "moderate":
                    moderate_additives.append(payload)
                elif db_type == "safe":
                    verified_safe_items.append(payload)
                
                matched_successfully = True


            # Local Fallback Search (executed if Pinecone failed to find a valid match due to severe typos)
            if not matched_successfully:
                local_match, match_ratio = find_local_fuzzy_match(ingredient)
                if local_match:
                    db_type = local_match.get("type", "").lower()
                    
                    payload = {
                        "ingredient": ingredient,
                        "matched_as": local_match.get("name"),
                        "category": local_match.get("category"),
                        "profile": local_match.get("profile"),
                        "match_confidence": f"Fuzzy Match ({round(match_ratio * 100, 1)}%)"
                    }

                    # Route the data to its respective bucket
                    if db_type == "toxic":
                        flagged_hazards.append(payload)
                    elif db_type == "moderate":
                        moderate_additives.append(payload)
                    elif db_type == "safe":
                        verified_safe_items.append(payload)
                    
                    matched_successfully = True

            if not matched_successfully:
                # Auto-research unknown ingredients dynamically
                new_data = auto_research_and_save_ingredient(ingredient)
                if new_data:
                    db_type = new_data.get("type", "").lower()
                    
                    payload = {
                        "ingredient": ingredient,
                        "matched_as": new_data.get("name"),
                        "category": new_data.get("category"),
                        "profile": new_data.get("profile"),
                        "match_confidence": "Auto-Researched (AI)"
                    }

                    if db_type == "toxic":
                        flagged_hazards.append(payload)
                    elif db_type == "moderate":
                        moderate_additives.append(payload)
                    elif db_type == "safe":
                        verified_safe_items.append(payload)
                    else:
                        unlisted_ingredients.append(ingredient)
                else:
                    # If AI research fails or errors out, fallback to unlisted
                    unlisted_ingredients.append(ingredient)

        # Run the hidden ingredient and adulteration detection engine
        alerts = detect_hidden_ingredients(request.text, cleaned_ingredients)

        # Return the structural breakdown payload back to React
        return {
            "scanned_count": len(cleaned_ingredients),
            "dangerous_count": len(flagged_hazards),
            "moderate_count": len(moderate_additives),
            "safe_count": len(verified_safe_items),
            "unlisted_count": len(unlisted_ingredients),
            
            "flagged_hazards": flagged_hazards,
            "moderate_hazards": moderate_additives,
            "safe_items": verified_safe_items,
            "not_found_items": unlisted_ingredients,
            "alerts": alerts
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. Define the Chat Request structure
class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []  # To keep track of conversation history
    scanned_ingredients: List[str] = [] # Fallback
    analysis_results: Dict = None        # Rich structured scan results

# 6. Add the /chat route
@app.post("/chat")
async def chat_assistant(payload: ChatRequest):
    # Build detailed context from structured scan results
    hazard_list = []
    moderate_list = []
    safe_list = []
    unlisted_list = []
    
    if payload.analysis_results:
        res = payload.analysis_results
        hazard_list = [
            f"{h.get('ingredient')} ({h.get('category')})"
            for h in res.get("flagged_hazards", [])
        ]
        moderate_list = [
            f"{h.get('ingredient')} ({h.get('category')})"
            for h in res.get("moderate_hazards", [])
        ]
        safe_list = [s.get("ingredient") for s in res.get("safe_items", [])]
        unlisted_list = res.get("not_found_items", [])
    elif payload.scanned_ingredients:
        # Fallback if only scanned_ingredients list is provided
        safe_list = payload.scanned_ingredients
        
    context_str = ""
    if hazard_list:
        context_str += f"- High Risk / Hazards detected: {', '.join(hazard_list)}\n"
    if moderate_list:
        context_str += f"- Moderate Risk items detected: {', '.join(moderate_list)}\n"
    if safe_list:
        context_str += f"- Safe/Beneficial elements detected: {', '.join(safe_list)}\n"
    if unlisted_list:
        context_str += f"- Untracked / Unlisted items: {', '.join(unlisted_list)}\n"
        
    if not context_str:
        context_str = "No product label or ingredients have been scanned yet."
        
    system_prompt = (
        f"You are LabelSpy AI, a forensic food and cosmetic ingredient safety expert advisor.\n\n"
        f"The user has scanned a product label with the following database matching results:\n"
        f"{context_str}\n"
        f"ROLE RULES & SAFETY POLICY (MUST ADHERE TO STRICTLY):\n"
        f"1. ONLY answer questions about ingredient safety, chemical warnings, health impacts, product grades, and clean alternatives.\n"
        f"2. CRITICAL: You are absolutely FORBIDDEN from writing, generating, explaining, or outputting any source code, HTML tags, CSS, JavaScript, programming syntax, or code blocks (including formatting using ```). If the user asks you to write code, HTML, CSS, or scripts, you MUST refuse firmly and politely, stating that you are a chemical safety assistant and cannot generate code or programming scripts.\n"
        f"3. Keep responses highly educational, helpful, scientific, and concise (strictly under 3 sentences)."
    )
    
    # Restructure the message log using the correct OpenAI SDK format
    messages = [{"role": "system", "content": system_prompt}]
    for interaction in payload.history:
        messages.append({"role": interaction["role"], "content": interaction["content"]})
    messages.append({"role": "user", "content": payload.message})

    try:
        # Call completion matching the exact model and verified hot provider from Hugging Face
        response = hf_router_client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct:together",
            messages=messages,
            max_tokens=250,
            temperature=0.6
        )
        reply = response.choices[0].message.content.strip()
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Error communicating with AI brain: {str(e)}"}

# Trigger database reload hook v2
