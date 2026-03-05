
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import conn, cursor
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from datetime import datetime

class JournalEntry(BaseModel):
    user_id: int
    text: str


@app.post("/journal")
def add_journal(entry: JournalEntry):

    text = entry.text
    user_id = entry.user_id

    vec = vectorizer.transform([text])
    emotion = model.predict(vec)[0]

    date = datetime.now().strftime("%Y-%m-%d")

    cursor.execute(
        "INSERT INTO journals (user_id, entry, emotion, date) VALUES (?, ?, ?, ?)",
        (user_id, text, emotion, date)
    )

    conn.commit()

    return {"emotion": emotion}
    
import pickle


model = pickle.load(open("emotion_model.pkl","rb"))
vectorizer = pickle.load(open("vectorizer.pkl","rb"))

@app.get("/")
def home():
    return {"message": "Emotion AI API running"}

@app.get("/dashboard/{user_id}")
def get_dashboard(user_id: int):

    cursor.execute(
        "SELECT emotion, date FROM journals WHERE user_id=?",
        (user_id,)
    )

    rows = cursor.fetchall()

    emotions = [r[0] for r in rows]
    dates = [r[1] for r in rows]

    distribution = {}
    for e in emotions:
        distribution[e] = distribution.get(e, 0) + 1

    timeline = []

    for r in rows:
        timeline.append({
            "emotion": r[0],
            "date": r[1]
        })

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
def get_journals(user_id:int):

    cursor.execute(
        "SELECT id, entry, emotion, date FROM journals WHERE user_id=? ORDER BY date DESC",
        (user_id,)
    )

    rows = cursor.fetchall()

    journals = []

    for r in rows:
        journals.append({
            "id":r[0],
            "entry":r[1],
            "emotion":r[2],
            "date":r[3]
        })

    return journals

@app.post("/login")
def login(data: dict):

    username = data["username"]
    password = data["password"]

    cursor.execute(
        "SELECT id FROM users WHERE username=? AND password=?",
        (username,password)
    )

    user = cursor.fetchone()

    if user:
        return {"user_id": user[0]}

    return {"error": "Invalid credentials"}

@app.post("/signup")
def signup(data: dict):

    username = data["username"]
    password = data["password"]

    cursor.execute(
        "INSERT INTO users (username,password) VALUES (?,?)",
        (username,password)
    )

    conn.commit()

    return {"message":"User created"}

@app.post("/predict")
def predict(data: dict):

    text = data["text"]

    vec = vectorizer.transform([text])

    emotion = model.predict(vec)[0]

    return {"emotion": emotion}