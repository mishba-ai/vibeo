import { Home, Inbox, Settings, BellDotIcon } from "lucide-react"
import image1 from '../../assets/image1.png'
import { useLocation } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarProvider,
} from "@repo/ui/components/ui/sidebar"
import { useAuth } from '@/hooks/useAuth'

const items = [
  {
    title: "Feed",
    url: "/feed",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Inbox,
    badge: 12
  },
  {
    title: "Notification",
    url: "/notification",
    icon: BellDotIcon,
    badge: 23
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export default function Fsidebar() {
  // Move hooks inside the component function
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname
  console.log(currentPath)

  if (!user) {
    return (
      <div className="w-84 bg-blue-300">
        <SidebarProvider className="w-full bg-white">
          <Sidebar className="bg-white">
            <SidebarContent className="bg-white">
              {/* User Avatar Loading State */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex flex-col">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1" />
                  </div>
                </div>
              </div>

              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title} className="flex flex-col mt-4 px-">
                        <SidebarMenuButton asChild className={`${currentPath === item.url ? "font-semibold bg-black text-white h-12" : "font-semibold h-12"}`}>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {item.badge && <SidebarMenuBadge className={`${currentPath === item.url ? "font-semibold  text-white " : "text-black"}`}>{item.badge}</SidebarMenuBadge>}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
    )
  }

  return (
    <div className="flex">
      <SidebarProvider className="">

        <Sidebar className="border-0 ">
          <SidebarContent className="bg-white border-none ring-none ">
            <div className="mt-8 flex flex-col items-center ">
              <div className="flex ">
                <img src={image1} alt="" className="w-24 h-24 rounded-full border" />
                <img
                  src={user.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"}
                  alt={user.username || "User Avatar"}
                  className="w-24 h-24 rounded-full -ml-2 z-10  border-black"
                />
              </div>
              <h1>{user.username}</h1>
              <p>{user.email}</p>
            </div>
            <SidebarGroup>
              <SidebarGroupContent className="mt-8">
                <SidebarMenu className="bg-red-20 flex flex-col items-center">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="w-56">
                      <SidebarMenuButton asChild className={`${currentPath === item.url ? "font-semibold bg-black text-white h-12 gap-y-2  rounded-2xl text-center" : "font-semibold bg-white text-black h-12 rounded-2xl text-center"}`}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge className={`${currentPath === item.url ? "font-semibold  text- mt-2 mr-2 bg-white rounded-full" : " mt-2 mr-2 font-semibold bg-black rounded-full text-white"}`}>{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}