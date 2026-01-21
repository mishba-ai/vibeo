import Chatpreview from '@/components/chat/Chatpreview'
import Chatwindow from '@/components/chat/Chatwindow'
import React from 'react'
import { Outlet } from 'react-router'

export default function Messages() {
  return (
    <div className='bg-white w-full h-full flex gap-x-2'>
      <div className='h-screen border border-gray-100 '/>
      <Chatpreview />
      <Outlet/>
    </div>
  )
}
