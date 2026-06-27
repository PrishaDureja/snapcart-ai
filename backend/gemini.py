import base64
import json
import re
import google.generativeai as genai
from backend.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """You are SnapCart AI, an expert shopping analyst. 
A user has uploaded a screenshot of a product listing from an e-commerce website (Amazon, Flipkart, Meesho, Myntra, etc.).

Analyze the screenshot carefully and return a JSON response with EXACTLY this structure:

{
  "deal_score": <integer 0-100, where 100 = perfect deal, 0 = complete scam>,
  "verdict": <"BUY" | "SKIP" | "CAUTION">,
  "verdict_detail": <one punchy sentence explaining the verdict, max 12 words>,
  "risk_signals": [<list of red flags you spotted, max 4 items, each max 6 words>],
  "green_signals": [<list of positive signals, max 4 items, each max 6 words>],
  "ai_brief": <2-3 sentence human-readable analysis explaining your reasoning. Be conversational and specific about what you saw in the image.>,
  "recommendation": <"BUY" | "SKIP" | "CAUTION">
}

SCORING GUIDE:
- 80-100: Genuine deal, trusted seller, healthy reviews, fair price
- 60-79: Decent deal with minor concerns
- 40-59: Risky — some red flags present
- 20-39: High risk — multiple suspicious signals
- 0-19: Almost certainly a scam or fake listing

WHAT TO LOOK FOR:
- Price vs MRP: Is the discount realistic? >80% off is suspicious
- Review count: <50 reviews on a "bestseller" is a red flag
- Review rating: Suspiciously perfect 5.0 with few reviews = fake
- Seller info: New seller, no seller name = risky
- Product images: Stock photos only = suspicious
- Price: Does the price seem too good to be true for this category?
- Platform: Note which platform and if the listing follows normal patterns

If you cannot clearly see product details, still provide a best-effort analysis based on what IS visible.
Always respond with ONLY valid JSON. No markdown, no explanation outside the JSON."""


def analyze_product_image(image_bytes: bytes, mime_type: str = "image/png") -> dict:
    """
    Send a product screenshot to Gemini Vision and get structured deal analysis.
    Returns a dict with deal_score, verdict, risk_signals, green_signals, ai_brief.
    """
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",    # Latest Gemini — better vision + reasoning
        generation_config={
            "temperature": 0.3,          # Lower = more consistent analysis
            "response_mime_type": "application/json",
        }
    )

    image_part = {
        "mime_type": mime_type,
        "data": base64.b64encode(image_bytes).decode("utf-8")
    }

    response = model.generate_content([SYSTEM_PROMPT, image_part])

    raw = response.text.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    result = json.loads(raw)

    # Validate & set safe defaults
    result.setdefault("deal_score", 50)
    result.setdefault("verdict", "CAUTION")
    result.setdefault("verdict_detail", "Analysis complete. Review signals carefully.")
    result.setdefault("risk_signals", [])
    result.setdefault("green_signals", [])
    result.setdefault("ai_brief", "Analysis complete.")
    result.setdefault("recommendation", result.get("verdict", "CAUTION"))

    # Clamp score
    result["deal_score"] = max(0, min(100, int(result["deal_score"])))

    return result
