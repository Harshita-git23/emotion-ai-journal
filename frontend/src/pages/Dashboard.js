import Layout from "../components/Layout"
import { useEffect, useState } from "react"
import axios from "axios"
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2"

import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 ArcElement,
 Tooltip,
 Legend
} from "chart.js"

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 ArcElement,
 Tooltip,
 Legend
)

function Dashboard(){

 const [data,setData] = useState({})
 const [insights,setInsights] = useState([])

 useEffect(()=>{

  const user_id = localStorage.getItem("user_id")

  axios
   .get(`http://127.0.0.1:8000/dashboard/${user_id}`)
   .then(res=>{

     setData(res.data)

     generateInsights(res.data)

   })

 },[])

 const generateInsights = (dashboardData) => {

  const distribution = dashboardData.emotion_distribution || {}

  const total = dashboardData.total_entries || 0

  const sad = distribution.sad || 0
  const anxious = distribution.anxious || 0
  const happy = distribution.happy || 0
  const angry = distribution.angry || 0

  const newInsights = []

  if(total < 3){
   newInsights.push("Try journaling regularly to understand your emotional patterns better.")
  }

  if((sad + anxious) / total > 0.5){
   newInsights.push("Your recent entries show a higher level of sadness or anxiety.")
  }

  if(happy > sad){
   newInsights.push("Positive emotions appear frequently in your journals.")
  }

  if(angry > 2){
   newInsights.push("Several entries indicate frustration or anger.")
  }

  if(newInsights.length === 0){
   newInsights.push("Your emotional pattern appears balanced.")
  }

  setInsights(newInsights)

 }

 const distribution = data.emotion_distribution || {}
 const timeline = data.timeline || []

 const pieData = {
  labels: Object.keys(distribution),
  datasets:[
   {
    data:Object.values(distribution),
    backgroundColor:[
     "#A5B4FC",
     "#C4B5FD",
     "#93C5FD",
     "#F9A8D4",
     "#FDBA74"
    ]
   }
  ]
 }

 const doughnutData = {
  labels:Object.keys(distribution),
  datasets:[
   {
    data:Object.values(distribution),
    backgroundColor:[
     "#A5B4FC",
     "#C4B5FD",
     "#93C5FD",
     "#F9A8D4"
    ]
   }
  ]
 }

 const barData = {
  labels:Object.keys(distribution),
  datasets:[
   {
    label:"Emotion Frequency",
    data:Object.values(distribution),
    backgroundColor:"#8B9CF6"
   }
  ]
 }

 const lineData = {
  labels:timeline.map(t=>t.date),
  datasets:[
   {
    label:"Mood Timeline",
    data:timeline.map((_,i)=>i+1),
    borderColor:"#8B9CF6",
    backgroundColor:"rgba(139,156,246,0.2)",
    tension:0.4,
    fill:true
   }
  ]
 }

 return(

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

    <div className="bg-white p-6 rounded-xl shadow border">

     <h3 className="mb-4 font-semibold text-gray-600">
      Emotion Distribution
     </h3>

     <Pie data={pieData}/>

    </div>

    <div className="bg-white p-6 rounded-xl shadow border">

     <h3 className="mb-4 font-semibold text-gray-600">
      Mood Timeline
     </h3>

     <Line data={lineData}/>

    </div>

    <div className="bg-white p-6 rounded-xl shadow border">

     <h3 className="mb-4 font-semibold text-gray-600">
      Weekly Emotion Trend
     </h3>

     <Bar data={barData}/>

    </div>

    <div className="bg-white p-6 rounded-xl shadow border">

     <h3 className="mb-4 font-semibold text-gray-600">
      Emotion Breakdown
     </h3>

     <Doughnut data={doughnutData}/>

    </div>

   </div>

   {/* AI Insights */}

   <div className="bg-white p-6 rounded-xl shadow border mt-10">

    <h3 className="text-xl font-semibold mb-4 text-gray-700">
     AI Insights
    </h3>

    <ul className="list-disc pl-6 text-gray-600 space-y-2">

     {insights.map((insight,index)=>(
      <li key={index}>{insight}</li>
     ))}

    </ul>

   </div>

  </Layout>

 )

}

export default Dashboard