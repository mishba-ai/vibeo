import React from 'react'
import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
export default function Posts() {
    return (
        <div className='bg-blue-200 w-full h-auto p-4 rounded-2xl'>
            {/* posts header */}
            <div className='flex justify-between'>
                <div className='flex space-x-2 text-center'>
                    <img src="https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg" className='w-12 h-12 rounded-full' alt="" />
                    <div className=''>
                        <h1>George stanley</h1>
                        {/* timestamp */}
                        <p>4 min ago</p>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    {/* type posts */}
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia eos voluptate molestias est vero ipsam nihil quam quibusdam, ipsum quas expedita nisi eius, ipsa dolor eum, velit sint! Facere, nulla!
                </div>
            </div>
            {/* posts footer */}
            <div className='w-full mt-4 p-'>
                <ul className='flex space-x-8 text-gray-600 text-xs'>
                    {/* views */}
                    <li className='flex gap-x-2'>
                        <Eye size={18} />
                        <p>6324</p>
                    </li>
                    {/* likes */}
                    <li className='flex gap-x-2'>
                        <HeartIcon size={18} />
                        <p>21</p>
                    </li>
                    {/* comment */}
                    <li className='flex gap-x-2'>
                        <MessageCircleIcon size={18} />
                        <p>12</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
