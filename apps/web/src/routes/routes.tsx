import App from "@/App.tsx";
import Layout from "@/pages/ Layout";
import Feed from "@/pages/Feed"

const routes = [
  {
    path: "/",
    element: <App />
  },
  {
    path:"/feed",
    element:<Layout/>
  }
];

export default routes;