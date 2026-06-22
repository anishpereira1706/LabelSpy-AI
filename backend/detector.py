import os
import re
import json
from typing import List, Dict
import google.generativeai as genai

def detect_hidden_ingredients(raw_text: str, scanned_items: List[str]) -> List[Dict]:
    """
    Calls Gemini API to dynamically scan the ingredients list for complex hidden substances,
    unusual chemical sugar synonyms, or specific food category adulterations (like olive oil, saffron, honey).
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return []

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-3.1-flash-lite")
        
        prompt = f"""You are a food safety, chemical analysis, and product authenticity expert.
Analyze this product label text and list of scanned ingredients:
Raw Label Text: "{raw_text}"
Ingredients List: {scanned_items}

Identify:
1. Hidden sugars, hidden MSG (glutamates), or hidden trans fats under complex, technical, or proprietary names.
2. Potential product adulteration/fraud (e.g. if the product is 'Extra Virgin Olive Oil' but lists 'Sunflower Oil' or 'Soybean Oil', or if it is 'Honey' but lists 'Rice Syrup' or 'Corn Syrup').

STRICT RAG RULES & EXCLUSIONS (MANDATORY):
- Under NO circumstances flag natural whole spices, spice powders, herbs, fruits, vegetables, natural juices, or natural juice concentrates (e.g., Amchur powder, Lal mirch powder, pepper, lemon juice, lemon juice concentrate, garlic, onion, tomato, mango, salt) as "hidden_sugar", "hidden_msg", or "hidden_trans_fat". These are standard culinary ingredients, not hidden chemical additives or flavor-enhancing extracts.
- Only flag ultra-processed, refined food chemicals, industrial extracts, or technical processing agents (e.g., Yeast Extract, Hydrolyzed Vegetable Protein, Autolyzed Yeast, Maltodextrin, Dextrose, High Fructose Corn Syrup, Hydrogenated Oils, Vanaspati) that are used as hidden enhancers or cheap fillers.

Format each warning alert as a JSON object with:
- "type": "adulteration", "hidden_sugar", "hidden_msg", or "hidden_trans_fat"
- "title": A short warning title. CRITICAL: Do NOT use the word 'Hidden' in your titles (e.g., use 'Sugar Alias', 'Glutamate Enhancers', 'Trans Fat Source' instead of 'Hidden Sweetener', 'Hidden MSG', 'Hidden Trans Fat').
- "ingredient": The specific ingredient(s) responsible
- "message": A 1-2 sentence description explaining the issue and why it represents food fraud or a hidden substance
- "severity": "high" (for adulteration/food fraud) or "medium" (for hidden aliases)

Return only a clean JSON list containing these objects (e.g. [{{...}}, {{...}}]). 
If no alerts or hidden ingredients are detected, return an empty list: [].
Do NOT include markdown formatting or backticks. Just return raw JSON."""

        response = model.generate_content(prompt)
        raw_output = response.text.strip()
        
        # Clean markdown wrappers if returned
        if raw_output.startswith("```json"):
            raw_output = raw_output[7:]
        if raw_output.endswith("```"):
            raw_output = raw_output[:-3]
        raw_output = raw_output.strip()
        
        parsed_alerts = json.loads(raw_output)
        if isinstance(parsed_alerts, list):
            final_alerts = []
            for alert in parsed_alerts:
                t = alert.get("title", "")
                t_clean = re.sub(r'\bhidden\b\s*', '', t, flags=re.I).strip()
                # Capitalize first letter cleanly
                if t_clean:
                    alert["title"] = t_clean[0].upper() + t_clean[1:]
                else:
                    alert["title"] = "Warning"
                final_alerts.append(alert)
            return final_alerts
    except Exception as e:
        print(f"AI Hidden Ingredient Detection failed: {e}")
    
    return []
