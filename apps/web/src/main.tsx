import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter ,RouterProvider} from "react-router";
import routes from '@/routes/routes.tsx'
import "@repo/ui/globals.css"
import './globals.css'

const router = createBrowserRouter(routes)
const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
