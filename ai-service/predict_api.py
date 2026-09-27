from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

model = joblib.load('demand_model.pkl')
encoder = joblib.load('encoder.pkl')

class PredictionRequest(BaseModel):
    day_of_week: str
    is_weekend: int
    weather: str
    item: str

@app.post("/predict")
def predict_demand(request: PredictionRequest):
    input_df = pd.DataFrame([{
        'day_of_week': request.day_of_week,
        'weather': request.weather,
        'item': request.item
    }])

    encoded = encoder.transform(input_df[['day_of_week', 'weather', 'item']])
    encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out())

    X = pd.concat([
        pd.DataFrame([{'is_weekend': request.is_weekend}]),
        encoded_df
    ], axis=1)

    prediction = model.predict(X)[0]

    return {
        "item": request.item,
        "predicted_quantity": round(float(prediction), 1)
    }

@app.get("/")
def root():
    return {"message": "Demand forecasting API is running"}
from chatbot import get_response

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    return get_response(request.message)
from textblob import TextBlob

class SentimentRequest(BaseModel):
    text: str

@app.post("/sentiment")
def analyze_sentiment(request: SentimentRequest):
    blob = TextBlob(request.text)
    polarity = blob.sentiment.polarity  # -1 to 1

    if polarity > 0.1:
        label = "positive"
    elif polarity < -0.1:
        label = "negative"
    else:
        label = "neutral"

    return {
        "sentiment": label,
        "score": round(polarity, 3)
    }