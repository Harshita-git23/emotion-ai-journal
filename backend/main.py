from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import conn
from datetime import datetime
import pickle
from pydantic import BaseModel
from datetime import datetime
import os
from collections import Counter
import random
import requests

def call_llm(prompt):
    url = "http://localhost:11434/api/generate"

    data = {
        "model": "phi3",   
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(url, json=data)
        res = response.json()

        return res.get("response", "No response from model.")

    except requests.exceptions.RequestException as e:
        return f"Request failed: {str(e)}"
    except Exception as e:
        print("Ollama Error:", e)
        return "AI service unavailable."

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

emotion_model = pickle.load(open("emotion_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
suggestion_model = pickle.load(open("suggestion_model.pkl", "rb"))


emotion_model2 = pickle.load(open("emotion_model_2.pkl", "rb"))
emotion_vectorizer = pickle.load(open("emotion_vectorizer.pkl", "rb"))
emotion_mlb = pickle.load(open("emotion_mlb.pkl", "rb"))

class JournalEntry(BaseModel):
    user_id: int
    text: str


@app.get("/")
def home():
    return {"message": "Emotion AI API running"}


@app.post("/journal")
def add_journal(entry: JournalEntry):

    text = entry.text
    user_id = entry.user_id

    vec = vectorizer.transform([text])
    emotion = emotion_model.predict(vec)[0]

    date = datetime.now().strftime("%Y-%m-%d")

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO journals (user_id, entry, emotion, date) VALUES (?, ?, ?, ?)",
        (user_id, text, emotion, date)
    )
    conn.commit()

    return {"emotion": emotion}


@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: int):

    cur = conn.cursor()
    cur.execute(
        "SELECT emotion, date FROM journals WHERE user_id=?",
        (user_id,)
    )

    rows = cur.fetchall()

    emotions = [(r[0] or "") for r in rows]

    distribution = {}
    for e in emotions:
        distribution[e] = distribution.get(e, 0) + 1

    timeline = [{"emotion": r[0], "date": r[1]} for r in rows]

    negative = emotions.count("sad") + emotions.count("anxious")
    total = len(emotions)

    if total == 0:
        risk = "No data"
    else:
        ratio = negative / total
        if ratio > 0.6:
            risk = "High"
        elif ratio > 0.3:
            risk = "Moderate"
        else:
            risk = "Low"

    return {
        "emotion_distribution": distribution,
        "timeline": timeline,
        "total_entries": total,
        "depression_risk": risk
    }

@app.get("/journals/{user_id}")
def get_journals(user_id: int):

    cur = conn.cursor()
    cur.execute(
        "SELECT id, entry, emotion, date FROM journals WHERE user_id=? ORDER BY date DESC",
        (user_id,)
    )

    rows = cur.fetchall()

    journals = []
    for r in rows:
        journals.append({
            "id": r[0],
            "entry": r[1],
            "emotion": r[2],
            "date": r[3]
        })

    return journals


@app.post("/login")
def login(data: dict):

    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cur.fetchone()

    if user:
        return {"user_id": user[0]}

    return {"error": "Invalid credentials"}


@app.post("/signup")
def signup(data: dict):

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username,password) VALUES (?,?)",
        (data["username"], data["password"])
    )

    conn.commit()

    return {"message": "User created"}


@app.post("/predict")
def predict(data: dict):

    text = data["text"]

    vec = vectorizer.transform([text])
    emotion = emotion_model.predict(vec)[0]

    return {"emotion": emotion}


def extract_features(user_id):

    cur = conn.cursor()
    cur.execute(
        "SELECT emotion, entry, date FROM journals WHERE user_id=?",
        (user_id,)
    )

    rows = cur.fetchall()

    emotions = [(r[0] or "") for r in rows]
    texts = [(r[1] or "").lower() for r in rows]

    sad = emotions.count("sad")
    anxious = emotions.count("anxious")
    happy = emotions.count("happy")

    night = sum(
    1 for r in rows 
    if r[2] and len(r[2].split("-")) == 3 and int(r[2].split("-")[2]) % 2 == 0
) if rows else 0
    exam = sum(1 for t in texts if "exam" in t)

    total = len(rows)

    return [sad, anxious, happy, night, exam, total]


from fastapi import APIRouter
from collections import Counter
from datetime import datetime
import random

router = APIRouter()

EMOTION_MAP = {
    "sadness": "sad",
    "grief": "sad",
    "remorse": "sad",
    "disappointment": "sad",

    "fear": "anxious",
    "nervousness": "anxious",
    "anger": "anxious",

    "joy": "happy",
    "love": "happy",
    "gratitude": "happy",
    "excitement": "happy",
    "optimism": "happy",

    "neutral": "neutral"
}

SUGGESTIONS = {
    "sad": [
        "Write down 3 things you're grateful for",
        "Go for a short walk outside",
        "Talk to someone you trust",
        "Listen to calming music",
        "Journal your thoughts"
    ],
    "anxious": [
        "Try 4-7-8 breathing exercise",
        "Break tasks into smaller steps",
        "Ground yourself (5-4-3-2-1 method)",
        "Take a 10-minute break",
        "Do light stretching"
    ],
    "happy": [
        "Capture this moment in your journal",
        "Share your happiness",
        "Work on something creative",
        "Celebrate small wins",
        "Keep the momentum going"
    ],
    "neutral": [
        "Plan your day",
        "Try something new",
        "Reflect on your goals",
        "Stay hydrated",
        "Do something productive"
    ]
}

SCORE_MAP = {
    "sad": 25,
    "anxious": 35,
    "neutral": 50,
    "happy": 85
}

VALID_EMOTIONS = {"sad", "anxious", "happy", "neutral"}

def normalize_emotion(raw_emotion: str) -> str:
    if not raw_emotion:
        return "neutral"

    raw_emotion = raw_emotion.strip().lower()

    if raw_emotion in VALID_EMOTIONS:
        return raw_emotion

    return EMOTION_MAP.get(raw_emotion, "neutral")


def get_user_emotions(user_id: int, limit: int = 7):
    cur = conn.cursor()

    cur.execute(
        f"SELECT emotion FROM journals WHERE user_id=? ORDER BY date DESC LIMIT {limit}",
        (user_id,)
    )

    rows = [r[0] for r in cur.fetchall() if r[0]]

    normalized = [normalize_emotion(e) for e in rows]

    # 🔍 debug (keep for now)
    print("RAW:", rows)
    print("NORMALIZED:", normalized)

    return normalized


def get_dominant_emotion(emotions):
    if not emotions:
        return "neutral"
    return Counter(emotions).most_common(1)[0][0]

def get_mood(score):
    if score >= 75:
        return "happy"
    elif score >= 60:
        return "neutral"
    elif score >= 40:
        return "anxious"
    else:
        return "sad"
    
def calculate_score(emotions):
    score = 0

    for e in emotions:
        if e == "happy":
            score += 2
        elif e == "neutral":
            score += 0
        elif e == "anxious":
            score -= 2
        elif e == "sad":
            score -= 3

    score = 50 + (score * 10)

    return max(0, min(100, score))

@app.get("/suggestions/{user_id}")
def get_suggestions(user_id: int):

    emotions = get_user_emotions(user_id, limit=5)
    emotion = get_dominant_emotion(emotions)

    suggestions = SUGGESTIONS.get(emotion, SUGGESTIONS["neutral"])

    return {
        "emotion": emotion,
        "suggestions": random.sample(suggestions, min(3, len(suggestions)))
    }


@app.get("/score/{user_id}")
def get_score(user_id: int):

    emotions = get_user_emotions(user_id, limit=7)

    print("EMOTIONS:", emotions)

    if not emotions:
        return {"score": 50}

    values = [SCORE_MAP.get(e, 50) for e in emotions]

    score = calculate_score(emotions)

    print("FINAL SCORE:", score)

    return {
        "score": score,
        "mood": get_mood(score)
    }

def predict_emotions(text, threshold=0.3):
    
    vec = emotion_vectorizer.transform([text])
    probs = emotion_model2.predict_proba(vec)[0]
    
    results = {
        emotion_mlb.classes_[i]: float(probs[i])
        for i in range(len(probs))
    }
    
    # filter only relevant emotions
    active = {k: v for k, v in results.items() if v >= threshold}
    
    return active, results

user_history = {}
def format_emotions(emotions):
    return emotions

def chatbot_reply(message, user_id):

    if user_id not in user_history:
        user_history[user_id] = []

    user_history[user_id].append(message)

    # keep last 5 messages
    history = user_history[user_id][-5:]
    history_text = "\n".join(history)

    emotions, _ = predict_emotions(message)
    formatted = format_emotions(emotions)

    prompt = f"""
    Conversation history:
    {history_text}

    Current message: "{message}"
    Detected emotions: {formatted}

    Respond naturally and empathetically.
    """

    return call_llm(prompt)

class ChatRequest(BaseModel):
    user_id: str
    message: str


@app.post("/chat")
def chat(data: ChatRequest):

    user_id = data.user_id
    message = data.message

    reply = chatbot_reply(message, user_id)

    return {
        "reply": reply
    }