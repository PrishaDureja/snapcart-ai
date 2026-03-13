from fastapi import APIRouter, UploadFile, File
import shutil
import os

from backend.ocr import extract_text
from ml.features import extract_features

router = APIRouter()


UPLOAD_FOLDER = "data/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # OCR STEP
    text_list = extract_text(file_path)

    # FEATURE EXTRACTION
    features = extract_features(text_list)

    return {
        "ocr_text": text_list,
        "features": features
    }