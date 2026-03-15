import joblib
import numpy as np

# Load trained ML model
model = joblib.load("models/product_model.pkl")


def predict_fraud(features):

    X = np.array([[
        features["price"],
        features["mrp"],
        features["discount_percent"],
        features["rating"],
        features["review_count"]
    ]])

    # Get probability for fraud class (class 1)
    prob = model.predict_proba(X)[0][1]

    # Assign human-readable label
    if prob > 0.7:
        label = "HIGH_RISK"
    elif prob > 0.4:
        label = "MEDIUM_RISK"
    else:
        label = "LOW_RISK"

    return float(prob), label