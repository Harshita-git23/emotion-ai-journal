import { Link, useLocation } from "react-router-dom"

function Sidebar(){

 const location = useLocation()

 const menuItems = [
  { name: "Journals", path: "/journals", icon: "📔" },
  { name: "New Entry", path: "/new", icon: "✍️" },
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Personalized Suggestions", path: "/suggestions", icon: "🧠" }
 ]

 return(

  <div className="w-64 min-h-screen bg-gradient-to-b
                  from-[#C4B5FD] to-[#A5B4FC]
                  text-white p-6 flex flex-col">

   <h1 className="text-2xl font-bold mb-10">
     MindJournal
   </h1>

   <nav className="flex flex-col gap-3 text-lg">

     {menuItems.map((item, index) => {

       const isActive = location.pathname === item.path

       return (
         <Link
           key={index}
           to={item.path}
           className={`flex items-center gap-3 p-3 rounded-lg transition
           ${isActive ? "bg-white/30 font-semibold" : "hover:bg-white/20"}`}
         >
           <span className="text-xl">{item.icon}</span>
           {item.name}
         </Link>
       )
     })}

   </nav>

  </div>

 )

}

export default Sidebar