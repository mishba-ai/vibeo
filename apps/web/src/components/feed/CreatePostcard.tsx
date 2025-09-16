import React, { useRef, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
export default function CreatePostcard() {
  const [messages, setMessages] = useState([])
  const { user, loading } = useAuth()
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  const API_BASE_URL = process.env.EXPRESS_API_BASE_URL
  return (
    <div className='w-full h-auto border-black rounded-2xl bg-violet-100 p-6'>
      <div className='flex w-full h-auto bg-gray-50 rounded-3xl gap-x-2 '>
        {user ? (
          <img
            src={`${API_BASE_URL}/auth/avatar/${user.id}`}
            className='rounded-full w-12 h-12 border-black border '
            alt={`${user.username}'s avatar`}
          />
        ) : (
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMUJ_MS_0dtu_FTJs4X5V6VS6KqmARf8cfg&s" className='rounded-full w-12 h-12 border-black border' alt="" />
        )}
        <textarea className='w-full overflow-auto  rounded-3xl px-3 focus:outline- text-left ' placeholder='share something' />
      </div>
    </div>
  )
}
