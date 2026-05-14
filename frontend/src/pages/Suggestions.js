import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const moodLabelMap = {
  sad: "Melancholy 🌧️",
  anxious: "Anxious 🌪️",
  happy: "Radiant ☀️",
  neutral: "Balanced 🌤️",
};

const moodColorMap = {
  sad: "#93C5FD",
  anxious: "#FCA5A5",
  happy: "#FDE68A",
  neutral: "#86EFAC",
};

export default function Suggestions() {
  const [score, setScore] = useState(50);
  const [emotion, setEmotion] = useState("neutral");
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("User not logged in");
      }

      const [scoreRes, suggestionRes] = await Promise.all([
        fetch(`${API_BASE}/score/${user_id}`),
        fetch(`${API_BASE}/suggestions/${user_id}`),
      ]);

      if (!scoreRes.ok) throw new Error("Score API failed");
      if (!suggestionRes.ok) throw new Error("Suggestions API failed");

      const scoreData = await scoreRes.json();
      const suggestionData = await suggestionRes.json();

      setScore(scoreData?.score ?? 50);
      setEmotion(suggestionData?.emotion ?? "neutral");
      setSuggestions(
        Array.isArray(suggestionData?.suggestions)
          ? suggestionData.suggestions
          : []
      );

    } catch (err) {
      console.error("Suggestions Error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moodLabel = moodLabelMap[emotion] || "Balanced 🌤️";
  const moodColor = moodColorMap[emotion] || "#86EFAC";

  return (
    <div className="flex min-h-screen bg-[#f8f8fc]">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-700">
          Suggestions
        </h2>

        {loading && (
          <p className="text-gray-500">Analyzing your journals...</p>
        )}

        {!loading && error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <div className="max-w-3xl space-y-6">

            {/* 🔹 Mood Score */}
            <div className="bg-white p-6 rounded-xl shadow border">
              <p className="text-gray-500">Mood Score</p>
              <p className="text-2xl font-bold text-[#8B9CF6]">
                {score}/100
              </p>
              <p className="text-gray-600 mt-1">{moodLabel}</p>
            </div>

            {/* 🔹 Emotion */}
            <div className="bg-white p-6 rounded-xl shadow border">
              <p className="text-lg font-medium text-gray-800">
                Current emotion:{" "}
                <span style={{ color: moodColor }}>{emotion}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Based on recent journal entries
              </p>
            </div>

            {/* 🔹 Suggestions */}
            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                What you can do right now
              </h3>

              {suggestions.length > 0 ? (
                <ul className="space-y-3 text-gray-600">
                  {suggestions.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span style={{ color: moodColor }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No suggestions available.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}