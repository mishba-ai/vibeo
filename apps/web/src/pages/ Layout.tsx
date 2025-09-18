import { Outlet } from "react-router"
import {Spaces,Fheaders,Fsidebar,Contentsidebar,Timeline} from "@/components/feed/index"

export default function  Layout() {
  return (
    <div> 
     <div className="flex w-full space-x-4">
                     <div className="max-w-">
                         <Fsidebar />
                     </div>
                     <div className="flex w-full justify-between px-2 pt-4">
                     <div className="w-[60%] max-w-[70%] bg-red-">
                         <Fheaders />
                        Outlet
                         {/*  */}
                     </div>
                     <div className="w-[30%] bg-amber-">
                         <Contentsidebar />
                     </div></div>
                 </div>
    </div>
  )
}
