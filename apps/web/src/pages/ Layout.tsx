import { Outlet } from "react-router"
import { Fheaders, Fsidebar, Contentsidebar } from "@/components/feed/index"

export default function Layout() {
  return (
    <div>
      <div className="flex w-full space-x-  justify-between">
        <div className="max-w-">
          <Fsidebar />
        </div>
        <div className="flex w-full justify-around px-2 py- bg-blue- ">
          <div className="w-[60%] max-w-[70%] bg-red-  ">
            <Fheaders />
            <Outlet />
            {/*  */}
          </div>
          <div className="w-[30%] py-0 bg-amber00 ">
            <Contentsidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
