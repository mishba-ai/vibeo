import App from "@/App.tsx";
import Layout from "@/pages/ Layout";
import Feed from "@/pages/Feed"
import NotFound from "@/pages/NotFound";
import Timeline from "@/pages/Timeline";


const routes = [
  {
    path: "/",
    element: <App />
  },
  { path: "*", element: <NotFound /> },
  {
    element: <Layout />,
    children :[
      {
      path: "/feed",
      element: <Feed />
    },
    {
      path:'/users/:username',
      element:<Timeline/>
    }
  
  ]
  }
];

export default routes;