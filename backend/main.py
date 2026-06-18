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

# 1.5 Helper functions for string similarity validation (prevents false positive vector matches)
def clean_chemical_name(name: str) -> str:
    name = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    return ' '.join(name.split()).lower()

def verify_match_similarity_raw(scanned_clean: str, matched_clean: str) -> bool:
    # 1. Direct substring check (if the matched clean name is entirely contained in the scanned name)
    if matched_clean in scanned_clean:
        return True
        
    # 2. Split into words
    s_words = scanned_clean.split()
    m_words = matched_clean.split()
    
    if not s_words or not m_words:
        return False
        
    # 3. Word-level subset check: how many words of the matched name are found in the scanned name?
    matches = 0
    for w_m in m_words:
        word_found = False
        for w_s in s_words:
            # Check for exact word or very close typo match (e.g., "cabbonate" vs "carbonate")
            if w_m == w_s or difflib.SequenceMatcher(None, w_m, w_s).ratio() >= 0.70:
                word_found = True
                break
        if word_found:
            matches += 1
            
    word_ratio = matches / len(m_words)
    
    # If all (or at least 85% of) the matched words are present in the scanned text, accept it.
    if word_ratio >= 0.85:
        return True
        
    # 4. Fallback: Check overall sequence similarity ratio (must be very high if word-subset is not satisfied)
    ratio = difflib.SequenceMatcher(None, scanned_clean, matched_clean).ratio()
    return ratio >= 0.85

def verify_match_similarity(scanned: str, matched: str) -> bool:
    scanned_clean = clean_chemical_name(scanned)
    
    # A. Check direct matches against contents inside parentheses first
    parenthesis_contents = re.findall(r'\((.*?)\)', matched)
    for content in parenthesis_contents:
        content_clean = clean_chemical_name(content)
        if content_clean and verify_match_similarity_raw(scanned_clean, content_clean):
            return True
            
    # B. Also check the base name without parentheses
    matched_no_parens = re.sub(r'\(.*?\)', '', matched)
    matched_clean = clean_chemical_name(matched_no_parens)
    return verify_match_similarity_raw(scanned_clean, matched_clean)

# Load dataset once into memory for local fallback searches
local_dataset = []
try:
    with open("ingredients_dataset.json", "r", encoding="utf-8") as f:
        local_dataset = json.load(f)
except Exception as e:
    print(f"Error loading ingredients_dataset.json for local search: {e}")

def find_local_fuzzy_match(scanned_name: str):
    scanned_clean = clean_chemical_name(scanned_name)
    best_match = None
    best_ratio = 0
    
    for item in local_dataset:
        matched_name = item["name"]
        matched_clean = clean_chemical_name(matched_name)
        
        # Calculate character similarity
        ratio = difflib.SequenceMatcher(None, scanned_clean, matched_clean).ratio()
        
        # Check if matched clean is a substring of scanned clean
        if matched_clean in scanned_clean:
            ratio = max(ratio, 0.95)
            
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = item
            
    if best_ratio >= 0.70:  # Standard fuzzy threshold
        return best_match, best_ratio
    return None, 0

# 1. Boot up secrets and core engines
load_dotenv()

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

# 4. The Upgraded 3-Tag Master Query Route
@app.post("/analyze")
def analyze_ingredients(request: IngredientRequest):
    try:
        # Step A: Split raw text by commas
        raw_list = request.text.split(",")
        
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
                top_k=3,
                include_metadata=True
            )

            matches = query_response.get("matches", [])
            
            matched_successfully = False
            for match in matches:
                score = match.get("score", 0)

                # Check if it crosses our confidence threshold
                if score >= 0.60:
                    metadata = match["metadata"]
                    matched_name = metadata.get("name", "")
                    
                    # Prevent false positive vector matches by verifying character/word similarity
                    if verify_match_similarity(ingredient, matched_name):
                        db_type = metadata.get("type", "").lower()
                        
                        payload = {
                            "ingredient": ingredient,
                            "matched_as": matched_name,
                            "category": metadata.get("category"),
                            "profile": metadata.get("profile"),
                            "match_confidence": f"{round(score * 100, 2)}%"
                        }

                        # Route the data to its respective bucket based on the dataset tag
                        if db_type == "toxic":
                            flagged_hazards.append(payload)
                        elif db_type == "moderate":
                            moderate_additives.append(payload)
                        elif db_type == "safe":
                            verified_safe_items.append(payload)
                        
                        matched_successfully = True
                        break

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
                # If no matches passed the similarity guard and local fuzzy search failed, it is unlisted
                unlisted_ingredients.append(ingredient)

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
            "not_found_items": unlisted_ingredients
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