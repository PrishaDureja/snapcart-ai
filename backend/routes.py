from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.gemini import analyze_product_image

router = APIRouter()


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Accept a product screenshot, send it to Gemini Vision,
    and return a structured deal analysis.
    """
    # Validate file type
    allowed_types = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}
    mime_type = file.content_type or "image/png"

    if mime_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {mime_type}. Please upload PNG, JPG, or WEBP."
        )

    # Read image bytes (no disk write needed — Gemini takes raw bytes)
    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(image_bytes) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    # Analyze with Gemini Vision
    result = analyze_product_image(image_bytes, mime_type)

    return result