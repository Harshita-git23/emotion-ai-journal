# Emotion-Aware AI Journal

An AI-powered journaling web application that analyzes the emotional tone of journal entries using Natural Language Processing (NLP) and visualizes emotional trends through an interactive dashboard.

The platform allows users to write journal entries, automatically detects emotions from the text, and provides visual insights through charts to help track emotional patterns over time.

---

## Features

- Write and store daily journal entries
- AI-based emotion detection from text
- NLP emotion classification
- Interactive dashboard with charts
- Emotion distribution visualization
- Emotion trend tracking
- Backend API for emotion analysis
- Persistent data storage

---

## Tech Stack

### Frontend
- React.js
- Chart.js
- Axios
- CSS

### Backend
- FastAPI
- Python
- Uvicorn

### Machine Learning
- NLP Emotion Classification Model
- Scikit-learn / Transformers

### Database
- SQLite

---

## Project Architecture

```
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
NLP Emotion Model
  ↓
Database (Firebase)
  ↓
Dashboard Visualization
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/emotion-ai-journal.git
cd emotion-ai-journal
```

Replace `YOUR_USERNAME` with your GitHub username.

---

### Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

---

### Create Virtual Environment

#### Mac / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

### Install Backend Dependencies

All backend dependencies are listed in `requirements.txt`.

```bash
pip install -r requirements.txt
```

---

### Run Backend Server

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

Open a new terminal and navigate to the frontend folder.

```bash
cd frontend
```

Install frontend dependencies.

```bash
npm install
```

Run the frontend application.

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## Project Structure

```
emotion-ai-journal
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│   ├── routes
│   └── model
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── package.json
│
├── demo
│   ├── dashboard.png
│   ├── journal-entry.png
│   └── emotion-analysis.png
│
└── README.md
```

---

## How It Works

1. User writes a journal entry.
2. The journal text is sent to the backend API.
3. The NLP model analyzes the text.
4. The system predicts the emotional tone.
5. The emotion result is stored in the database.
6. Dashboard charts visualize emotional insights.

---

## Dashboard Analytics

The dashboard provides:

- Emotion distribution
- Emotion trends over time
- Entry history analysis
- Emotional pattern visualization

---

## Demo

Add screenshots inside a `demo` folder.

Example structure:

```
demo/
dashboard.png
emotion-analysis.png
journal-entry.png
```

Display screenshots in README:

```
![Dashboard](demo/dashboard.png)
```

---

## Future Improvements

- Advanced deep learning emotion detection models
- Personalized mental health insights
- AI chatbot for emotional support
- Mobile application support
- Multi-language emotion detection

---


## Author

Harshita Saxena
