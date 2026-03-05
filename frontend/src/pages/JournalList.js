import Layout from "../components/Layout"
import { useEffect,useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function JournalList(){

 const [journals,setJournals] = useState([])

 const navigate = useNavigate()

 useEffect(()=>{

  const user_id = localStorage.getItem("user_id")

  axios.get(`http://127.0.0.1:8000/journals/${user_id}`)
  .then(res=>setJournals(res.data))

 },[])

 return(

 <Layout>

  <h2 className="text-3xl font-bold mb-6 text-gray-700">
   Your Journals
  </h2>

  <div className="grid gap-5">

   {journals.map(j=>(

    <div
     key={j.id}
     className="bg-white p-6 rounded-xl shadow border
                hover:shadow-lg transition"
    >

     <p className="text-lg mb-2">
      {j.entry}
     </p>

     <div className="flex justify-between">

      <span className="px-3 py-1 text-sm
                       bg-purple-100
                       text-purple-600
                       rounded-full">

       {j.emotion}

      </span>

      <span className="text-gray-400 text-sm">
       {j.date}
      </span>

     </div>

    </div>

   ))}

  </div>

  <button
   onClick={()=>navigate("/new")}
   className="fixed bottom-8 right-8
              bg-[#A5B4FC] text-white
              w-14 h-14 rounded-full
              text-3xl shadow-lg
              hover:bg-[#8B9CF6]"
  >
   +
  </button>

 </Layout>

 )

}

export default JournalList