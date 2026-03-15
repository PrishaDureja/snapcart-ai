import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load dataset
data = pd.read_csv("data/dataset.csv")

# Features from OCR pipeline
X = data[[
    "price",
    "mrp",
    "discount_percent",
    "rating",
    "review_count"
]]

# Target column
y = data["fraud"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate model
preds = model.predict(X_test)

print("\nModel Evaluation:\n")
print(classification_report(y_test, preds))

# Save trained model
joblib.dump(model, "models/product_model.pkl")

print("\nModel saved to models/product_model.pkl")