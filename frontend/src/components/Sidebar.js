import { Link } from "react-router-dom"

function Sidebar(){

 return(

  <div className="w-64 min-h-screen bg-gradient-to-b
                  from-[#C4B5FD] to-[#A5B4FC]
                  text-white p-6 flex flex-col">

   <h1 className="text-2xl font-bold mb-10">
     MindJournal
   </h1>

   <nav className="flex flex-col gap-4 text-lg">

     <Link
      to="/journals"
      className="hover:bg-white/20 p-3 rounded-lg transition"
     >
      Journals
     </Link>

     <Link
      to="/new"
      className="hover:bg-white/20 p-3 rounded-lg transition"
     >
      New Entry
     </Link>

     <Link
      to="/dashboard"
      className="hover:bg-white/20 p-3 rounded-lg transition"
     >
      Dashboard
     </Link>

   </nav>

  </div>

 )

}

export default Sidebar