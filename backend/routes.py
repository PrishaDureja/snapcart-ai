from fastapi import APIRouter, UploadFile, File
import shutil
import os

from backend.ocr import extract_text
from ml.features import extract_features
from backend.model import predict_fraud

router = APIRouter()

UPLOAD_FOLDER = "data/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # OCR STEP
    text_list = extract_text(file_path)

    # FEATURE EXTRACTION
    features = extract_features(text_list)

    # ML FRAUD PREDICTION
    fraud_probability, fraud_label = predict_fraud(features)

    return {
    "ocr_text": text_list,
    "features": features,
    "fraud_probability": fraud_probability,
    "fraud_label": fraud_label
}