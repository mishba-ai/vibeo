import App from "@/App.tsx";
import Feed from "@/pages/Feed"
const routes = [
  {
    path: "/",
    element: <App />
  },
  {
    path:"/feed",
    element:<Feed/>
  }
];

export default routes;