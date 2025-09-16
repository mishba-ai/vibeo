import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from '@/routes/routes.tsx'
import "@repo/ui/globals.css"
import './globals.css'
import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter(routes)
const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  </React.StrictMode>
)
