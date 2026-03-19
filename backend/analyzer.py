def analyze_deal(features, fraud_prob):

    price = features["price"]
    mrp = features["mrp"]
    discount = features["discount_percent"]
    rating = features["rating"]
    reviews = features["review_count"]

    # -------------------------------
    # TRUST SCORE
    # -------------------------------
    trust_score = round((1 - fraud_prob) * 100)

    # -------------------------------
    # RISK SIGNALS
    # -------------------------------
    signals = []

    # High discount
    if discount and discount > 70:
        signals.append("Unusually high discount")

    # Low reviews
    if reviews and reviews < 50:
        signals.append("Very low number of reviews")

    # Low rating
    if rating and rating < 3:
        signals.append("Low product rating")

    # Price inconsistency
    if price and mrp and price > mrp:
        signals.append("Price higher than MRP (suspicious)")

    # If no issues
    if not signals:
        signals.append("No major risk signals detected")

    # -------------------------------
    # VERDICT
    # -------------------------------
    if trust_score >= 80:
        verdict = "SAFE_DEAL"
    elif trust_score >= 50:
        verdict = "MODERATE_RISK"
    else:
        verdict = "SUSPICIOUS_DEAL"

    return {
        "trust_score": trust_score,
        "risk_signals": signals,
        "verdict": verdict
    }