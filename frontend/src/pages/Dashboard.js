import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Doughnut, Radar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [suggestion, setSuggestion] = useState(null);
  const [data, setData] = useState({});
  const [insights, setInsights] = useState([]);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    axios
      .get(`http://127.0.0.1:8000/dashboard/${user_id}`)
      .then((res) => {
        setData(res.data);
        generateInsights(res.data);
      });

    axios
      .get(`http://127.0.0.1:8000/suggestions/${user_id}`)
      .then((res) => {
        setSuggestion(res.data);
      });
  }, []);

  const heatmapData = data.timeline?.map((item) => ({
    date: item.date,
    count:
      item.emotion === "happy" ? 3 :
      item.emotion === "neutral" ? 2 :
      item.emotion === "sad" ? 1 :
      item.emotion === "anxious" ? 0 : 1,
  }));

  const generateInsights = (dashboardData) => {
    const distribution = dashboardData.emotion_distribution || {};
    const total = dashboardData.total_entries || 0;

    const sad = distribution.sad || 0;
    const anxious = distribution.anxious || 0;
    const happy = distribution.happy || 0;
    const angry = distribution.angry || 0;

    const newInsights = [];

    if (total < 3) {
      newInsights.push("Try journaling regularly to understand your emotional patterns better.");
    }

    if (total > 0 && (sad + anxious) / total > 0.5) {
      newInsights.push("Your recent entries show a higher level of sadness or anxiety.");
    }

    if (happy > sad) {
      newInsights.push("Positive emotions appear frequently in your journals.");
    }

    if (angry > 2) {
      newInsights.push("Several entries indicate frustration or anger.");
    }

    if (newInsights.length === 0) {
      newInsights.push("Your emotional pattern appears balanced.");
    }

    setInsights(newInsights);
  };

  const sendMessage = async () => {
    const user_id = localStorage.getItem("user_id");

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        message: message,
      }),
    });

    const data = await res.json();
    setReply(data.reply);
    setMessage(""); // clear input
  };

  const distribution = data.emotion_distribution || {};
  const timeline = data.timeline || [];

  const pieData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: [
          "#A5B4FC",
          "#C4B5FD",
          "#93C5FD",
          "#F9A8D4",
          "#FDBA74",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: [
          "#A5B4FC",
          "#C4B5FD",
          "#93C5FD",
          "#F9A8D4",
        ],
      },
    ],
  };

  const barData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        label: "Emotion Frequency",
        data: Object.values(distribution),
        backgroundColor: "#8B9CF6",
      },
    ],
  };

  const radarData = {
    labels: Object.keys(distribution),
    datasets: [
      {
        label: "Emotion Profile",
        data: Object.values(distribution),
        backgroundColor: "rgba(139, 156, 246, 0.3)",
        borderColor: "#8B9CF6",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-8 text-gray-700">
        Mental Health Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold text-[#8B9CF6]">
            {data.total_entries || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Depression Risk</p>
          <p className="text-2xl font-bold text-[#8B9CF6]">
            {data.depression_risk || "Unknown"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">Tracked Emotions</p>
          <p className="text-2xl font-bold text-[#8B9CF6]">
            {Object.keys(distribution).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        {/* Pie chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="mb-4 font-semibold text-gray-600">Emotion Distribution</h3>
          <Pie data={pieData} />
        </div>

        {/* Radar chart (replaces Line) */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="mb-4 font-semibold text-gray-600">Emotion Profile</h3>
          <Radar
            data={radarData}
            options={{
              responsive: true,
              scales: {
                r: {
                  beginAtZero: true,
                  suggestedMax: Math.max(...Object.values(distribution)) + 1,
                },
              },
            }}
          />
        </div>

        {/* Bar chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="mb-4 font-semibold text-gray-600">Weekly Emotion Trend</h3>
          <Bar data={barData} />
        </div>

        {/* Doughnut chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="mb-4 font-semibold text-gray-600">Emotion Breakdown</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {suggestion && (
        <div className="bg-white p-6 rounded-xl shadow border mt-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Personalized Suggestions
          </h3>

          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {suggestion.suggestion_type === "music" && "🎵"}
              {suggestion.suggestion_type === "breathing" && "🧘"}
              {suggestion.suggestion_type === "study_plan" && "📚"}
              {suggestion.suggestion_type === "affirmation" && "💬"}
              {suggestion.suggestion_type === "routine" && "⏰"}
            </div>

            <div>
              <p className="text-lg font-medium text-gray-800">
                {suggestion.message}
              </p>
              <p className="text-sm text-gray-500">
                Based on your recent emotional patterns
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 💬 FLOATING CHAT ICON */}
      <button
        onClick={() => setOpenChat(!openChat)}
        className="fixed bottom-6 right-6 bg-[#8B9CF6] text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* 💬 CHAT POPUP */}
      {openChat && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-xl p-4 border">
          <h3 className="font-semibold mb-2">AI Assistant</h3>

          <div className="h-40 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
            {reply && <p><strong>AI:</strong> {reply}</p>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type..."
              className="flex-1 border p-2 rounded text-sm"
            />

            <button
              onClick={sendMessage}
              className="bg-[#8B9CF6] text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;