from pydantic import BaseModel, Field
from typing import List


class PredictionInput(BaseModel):
    features: List[float] = Field(
        ...,
        min_length=30,
        max_length=30,
        description="Enter exactly 30 breast cancer features"
    )


class PredictionResponse(BaseModel):
    prediction: int
    result: str
    confidence: float