import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login(){

 const [username,setUsername] = useState("")
 const [password,setPassword] = useState("")
 const [message,setMessage] = useState("")
 const [isSignup,setIsSignup] = useState(false)

 const navigate = useNavigate()

 const loginUser = async ()=>{

  try{

   const res = await axios.post(
    "http://127.0.0.1:8000/login",
    {
     username:username,
     password:password
    }
   )

   localStorage.setItem("user_id",res.data.user_id)

   navigate("/journals")

  }

  catch{
   setMessage("Login failed")
  }

 }

 const signupUser = async ()=>{

  try{

   await axios.post(
    "http://127.0.0.1:8000/signup",
    {
     username:username,
     password:password
    }
   )

   setMessage("Account created! Please login.")
   setIsSignup(false)

  }

  catch{
   setMessage("Signup failed")
  }

 }

 return(

 <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB]">

  <div className="bg-white p-10 rounded-xl shadow-lg w-96">

   <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">

    {isSignup ? "Create Account" : "Welcome Back"}

   </h2>

   <input
    className="w-full border p-3 rounded-lg mb-4"
    placeholder="Username"
    onChange={(e)=>setUsername(e.target.value)}
   />

   <input
    className="w-full border p-3 rounded-lg mb-4"
    type="password"
    placeholder="Password"
    onChange={(e)=>setPassword(e.target.value)}
   />

   {isSignup ? (

    <button
     onClick={signupUser}
     className="w-full bg-[#A5B4FC] text-white p-3 rounded-lg hover:bg-[#8B9CF6]"
    >
     Sign Up
    </button>

   ) : (

    <button
     onClick={loginUser}
     className="w-full bg-[#A5B4FC] text-white p-3 rounded-lg hover:bg-[#8B9CF6]"
    >
     Login
    </button>

   )}

   <p className="text-center text-sm mt-4 text-gray-500">
    {message}
   </p>

   <p
    className="text-center text-sm mt-4 cursor-pointer text-purple-500"
    onClick={()=>setIsSignup(!isSignup)}
   >

    {isSignup ? "Already have an account?" : "Create account"}

   </p>

  </div>

 </div>

 )

}

export default Login