import React,{useRef,useEffect,useState} from 'react'

export default function CreatePostcard() {
 const [messages,setMessages] =  useState([])

  return (
    <div className='w-full h-auto border-black rounded-2xl bg-violet-100 p-6'>
       <div className='flex w-full h-auto bg-gray-50 rounded-3xl gap-x-2 '>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMUJ_MS_0dtu_FTJs4X5V6VS6KqmARf8cfg&s" className='rounded-full w-12 h-12 border-black border' alt="" />
        <textarea className='w-full overflow-auto  rounded-3xl px-3 focus:outline- text-left ' placeholder='share something'/>
       </div>
    </div>
  )
}
