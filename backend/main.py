import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

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

hf_client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HF_TOKEN"),
)

# 2. Define what a user request data packet looks like
class IngredientRequest(BaseModel):
    text: str

# 3. Base Health-Check Route
@app.get("/")
def home():
    return {"status": "online", "message": "LabelSpy AI Engine is listening..."}

# 4. The Upgraded 3-Tag Master Query Route
@app.post("/analyze")
def analyze_ingredients(request: IngredientRequest):
    try:
        # Step A: Split raw text by commas
        raw_list = request.text.split(",")
        
        # Step B: Trim spaces and remove duplicate entries (e.g., "Mercury" and "mercury" become 1 task)
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

            # If it score drops below 60%, it's not in our dataset repository at all
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