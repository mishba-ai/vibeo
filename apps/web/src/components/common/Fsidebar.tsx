import { Home, Inbox, Settings, BellDotIcon } from "lucide-react"
import image1 from '../../assets/image1.png'
import { useLocation } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="w-84 ">
      <SidebarProvider className="w-full">
        <Sidebar className="bg-white border-transparent">
          <SidebarContent className="bg-white">
            {/* User Profile Section */}
            {user ? (
              <div className="mt-8 flex flex-col items-center">
                <div className="flex">
                  <img src={image1} alt="" className="w-24 h-24 rounded-full border" />
                  <img
                    src={user.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"}
                    alt={user.username || "User Avatar"}
                    className="w-24 h-24 rounded-full -ml-2 z-10 border-black"
                  />
                </div>
                <h1 className="mt-2 font-semibold">{user.username}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            ) : (
              /* Loading State for User Profile */
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex flex-col">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mt-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <SidebarGroup>
              <SidebarGroupContent className={user ? "mt-8" : ""}>
                <SidebarMenu className={`flex flex-col ${user ? "items-center" : "items-center"}`}>
                  {items.map((item) => (
                    <SidebarMenuItem 
                      key={item.title} 
                      className={`${user ? "w-56" : "flex flex-col mt-4 px-"} relative`}
                    >
                      <SidebarMenuButton 
                        asChild 
                        className={`${
                          currentPath === item.url 
                            ? `font-semibold bg-black text-white h-12 ${user ? "rounded-2xl" : ""} hover:bg-black hover:text-white` 
                            : `font-semibold ${user ? "bg-white text-black rounded-2xl" : ""} h-12 hover:bg-black hover:text-white`
                        } transition-colors duration-200 peer`}
                      >
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      
                      {item.badge && (
                        <SidebarMenuBadge 
                          className={`${
                            currentPath === item.url 
                              ? `font-semibold text-black bg-white rounded-full ${user ? "mt-2 mr-2" : ""}` 
                              : `font-semibold bg-black text-white rounded-full ${user ? "mt-2 mr-2" : ""} peer-hover:bg-white peer-hover:text-black `
                          } transition-colors duration-200`}
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
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