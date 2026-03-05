import { useState } from "react";
import axios from "axios";

function Journal(){
 const [text,setText] = useState("")
 const [emotion,setEmotion] = useState("")
 
 const submitJournal = async () => {

  const user_id = localStorage.getItem("user_id")

  const response = await axios.post(
    "http://127.0.0.1:8000/journal",
    {
      user_id: user_id,
      text: text
    }
  )

  setEmotion(response.data.emotion)

}

 return(

  <div>

   <h1>Daily Journal</h1>

   <textarea
     rows="6"
     cols="60"
     placeholder="Write about your day..."
     onChange={(e)=>setText(e.target.value)}
   />

   <br/>

   <button onClick={submitJournal}>
     Analyze Emotion
   </button>

   <h3>Detected Emotion: {emotion}</h3>

  </div>

 )

}

export default Journal