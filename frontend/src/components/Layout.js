import Sidebar from "./Sidebar"

function Layout({ children }) {

 return(

  <div className="flex bg-[#F6F7FB] min-h-screen">

    <Sidebar/>

    <div className="flex-1 p-10">
      {children}
    </div>

  </div>

 )

}

export default Layout