import { BrowserRouter,Routes,Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import JournalList from "./pages/JournalList"
import NewJournal from "./pages/NewJournal"
import Dashboard from "./pages/Dashboard"
import Suggestions from "./pages/Suggestions"
function App(){

 return(

  <BrowserRouter>
   
   <Routes>

    <Route path="/" element={<Landing/>} />

    <Route path="/login" element={<Login/>} />

    <Route path="/journals" element={<JournalList/>} />

    <Route path="/new" element={<NewJournal/>} />

    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/suggestions" element={<Suggestions/>} />

   </Routes>

  </BrowserRouter>

 )

}

export default App