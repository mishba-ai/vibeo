import App from "@/App.tsx";
import Chatwindow from "@/components/chat/Chatwindow";
import EmptyChatState from "@/components/chat/EmptyChatState";
import Layout from "@/pages/ Layout";
import Feed from "@/pages/Feed"
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";
import Notification from "@/pages/Notification";
import { PostDetail } from "@/pages/PostDetail";
import Settings from "@/pages/Settings";
import Timeline from "@/pages/Timeline";
import type { Post } from "@/types";

const routes = [
  {
    path: "/",
    element: <App />
  },
  { path: "*", element: <NotFound /> },
  {
    element: <Layout />,
    children: [
      {
        path: "/feed",
        element: <Feed />
      },
      {
        path: '/users/:username',
        element: <Timeline />
      },
      {
        path: "chat",
        element: <Messages />,
        children:[
          {
          index:true,
          element:<EmptyChatState/>
          },
          {
            path:":conversationId",
            element:<Chatwindow/>
          }
        ]

      },
      {
        path: "notifications",
        element: <Notification />
      }
      , {
        path: "settings",
        element: <Settings />
      },
      {
        path:'/:username/:postId',
        element:<PostDetail/>
      },
      
    ]
  }
];

export default routes;