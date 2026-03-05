import { useNavigate } from "react-router-dom"
import mindImage from "../assets/mind.png"
function Landing(){

 const navigate = useNavigate()

 return(

  <div className="min-h-screen bg-[#F6F7FB]">

   {/* Navbar */}

   <div className="flex justify-between items-center px-10 py-6">

    <h1 className="text-2xl font-bold text-[#8B9CF6]">
     MindJournal
    </h1>

    <button
     onClick={()=>navigate("/login")}
     className="bg-[#A5B4FC] text-white px-6 py-2 rounded-lg hover:bg-[#8B9CF6]"
    >
     Login
    </button>

   </div>


   {/* Hero Section */}

   <div className="flex items-center justify-between px-20 py-20">

    <div className="max-w-xl">

     <h1 className="text-5xl font-bold text-gray-700 mb-6">

      Track Your Emotions  
      <span className="text-[#8B9CF6]"> with AI</span>

     </h1>

     <p className="text-gray-500 mb-8">

      Write daily journals, understand your emotional patterns,
      and gain insights into your mental well-being.

     </p>

     <button
      onClick={()=>navigate("/login")}
      className="bg-[#A5B4FC] text-white px-8 py-4 rounded-xl text-lg hover:bg-[#8B9CF6]"
     >
      Start Journaling
     </button>

    </div>

    {/* Illustration */}

    <img
     src={mindImage}
     className="h-[600px] w-auto"
     alt="mental health"
    />

   </div>

  </div>

 )

}

export default Landing