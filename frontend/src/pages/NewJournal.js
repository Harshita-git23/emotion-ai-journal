import Layout from "../components/Layout"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function NewJournal(){

 const [text,setText] = useState("")

 const navigate = useNavigate()

 const submit = async ()=>{

  const user_id = parseInt(localStorage.getItem("user_id"))

  await axios.post(
   "http://127.0.0.1:8000/journal",
   {
    user_id:user_id,
    text:text
   }
  )

  navigate("/journals")

 }

 return(

 <Layout>

  <h2 className="text-3xl font-bold mb-6 text-gray-700">
   New Journal Entry
  </h2>

  <textarea
   className="w-full h-48 border rounded-xl p-4
              focus:ring-2 focus:ring-[#A5B4FC]"
   placeholder="How are you feeling today?"
   onChange={(e)=>setText(e.target.value)}
  />

  <button
   onClick={submit}
   className="mt-6 bg-[#A5B4FC] text-white
              px-8 py-3 rounded-lg
              hover:bg-[#8B9CF6]"
  >
   Save Entry
  </button>

 </Layout>

 )

}

export default NewJournal