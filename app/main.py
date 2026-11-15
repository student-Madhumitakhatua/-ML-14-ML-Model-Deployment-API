from fastapi import FastAPI, HTTPException
from pathlib import Path
import numpy as np
import joblib

from app.schemas import PredictionInput, PredictionResponse

# 1. Create FastAPI App
app = FastAPI(
    title="Breast Cancer Prediction API",
    description="ML Model Deployment using FastAPI",
    version="1.0.0"
)

# 2. Load Trained Model Once
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "breast_cancer_model.pkl"

model = joblib.load(MODEL_PATH)

# 3. Home Endpoint
@app.get("/")
def home():
    return {
        "message": "Breast Cancer Prediction API is Running!",
        "docs": "/docs",
        "health": "/health"
    }

# 4. Health Check Endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

# 5. Prediction Endpoint
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):
    try:
        features = np.array(data.features).reshape(1, -1)

        prediction = int(model.predict(features)[0])

        probabilities = model.predict_proba(features)[0]
        confidence = float(probabilities[prediction])

        result = "Malignant" if prediction == 0 else "Benign"

        return {
            "prediction": prediction,
            "result": result,
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Prediction failed: {str(e)}"
        )