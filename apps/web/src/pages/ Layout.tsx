import { Outlet, useLocation } from "react-router"
import { Fsidebar, Contentsidebar } from "@/components/feed/index"

export default function Layout() {
  const location = useLocation()
  // Pages that should show the content sidebar
  const showContentSidebar = ['/feed', '/notifications', '/users/'].some(path =>
    location.pathname.startsWith(path)
  )

  return (
    <div>
      <div className="flex w-full space-x-  justify-between">
        <div className="">
          <Fsidebar />
        </div>
        <div className={`flex w-full  ${showContentSidebar ? 'justify-around' : 'gap-x-10'} px-2`}>
          <div className={showContentSidebar ? "w-[60%] max-w-[70%]" : "w-full max-w- m-0"}>
            <Outlet />
          </div>
          {showContentSidebar && (
            <div className="w-[30%]">
              <Contentsidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
