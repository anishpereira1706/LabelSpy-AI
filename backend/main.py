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
                top_k=1,
                include_metadata=True
            )

            matches = query_response.get("matches", [])
            
            if matches:
                top_match = matches[0]
                score = top_match.get("score", 0)

                # If it crosses our 60% confidence threshold, read its specific type tag
                if score >= 0.60:
                    metadata = top_match["metadata"]
                    db_type = metadata.get("type", "").lower()
                    
                    payload = {
                        "ingredient": ingredient,
                        "matched_as": metadata.get("name"),
                        "category": metadata.get("category"),
                        "profile": metadata.get("profile"),
                        "match_confidence": f"{round(score * 100, 2)}%"
                    }

                    # Route the data to its respective bucket based on the dataset tag
                    if db_type == "toxic":
                        flagged_hazards.append(payload)
                        continue
                    elif db_type == "moderate":
                        moderate_additives.append(payload)
                        continue
                    elif db_type == "safe":
                        verified_safe_items.append(payload)
                        continue

            # If its score drops below 60%, it's not in our dataset repository at all
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
    scanned_ingredients: List[str] = [] # To pass context of what they scanned

# 6. Add the /chat route
@app.post("/chat")
async def chat_assistant(payload: ChatRequest):
    # Construct a robust system prompt with context
    ingredients_context = ", ".join(payload.scanned_ingredients) if payload.scanned_ingredients else "None scanned yet"
    
    system_prompt = (
        f"You are LabelSpy AI, a forensic food and cosmetic ingredient safety expert. "
        f"The user has just scanned a product containing these ingredients: [{ingredients_context}]. "
        f"Answer their questions accurately, scientifically, and concisely based on ingredient safety. "
        f"Be helpful but objective. Keep responses concise and strictly under 3 sentences."
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