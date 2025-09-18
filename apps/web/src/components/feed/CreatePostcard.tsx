import React, { useRef, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { File, Image, MapPin, Globe } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import { Textarea } from '@repo/ui/components/ui/textarea'
import api from '@/api/axiosInstance'
import type { Post } from '@/types/index'

interface CreatePostcardProps {
  onPostCreated: (newPost: Post) => void;
}

export default function CreatePostcard({ onPostCreated }: CreatePostcardProps) {

  const [postContent, setPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false); // To disable the button while posting

  const { user, loading } = useAuth()
  if (loading) {
    return <div>Loading...</div>;
  }
  const API_BASE_URL = import.meta.env.VITE_EXPRESS_API_BASE_URL
  const footer = [
    {
      icon: <File />,
      name: "file"
    },
    {
      icon: <Image />,
      name: "image"
    },
    {
      icon: <MapPin />,
      name: "location"
    },
    {
      icon: <Globe />,
      name: "globe"
    },
  ];

  const handlePost = async () => {
    try {
      if (!postContent.trim()) {
        // Prevent empty posts
        return;
      }
      setIsPosting(true);
      const response = await api.post('api/v1/posts', {
        content: postContent
      });
      console.log('Post created successfully:', response.data);

      onPostCreated(response.data.post);

      // Clear the textarea after a successful post
      setPostContent('');

    } catch (error) {
      console.error('Post failed:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false); // Re-enable the button
    }
  }


  return (
    <div className='w-full h-auto border-black rounded-xl bg-violet-100 p-6 '>
      <div className='flex w-full h-auto bg-gray-50 rounded-3xl gap-x-2 '>
        {user ? (
          <img
            src={`${API_BASE_URL}/auth/avatar/${user.id}`}
            className='rounded-full w-12 h-12 border '
            alt={`${user.username}'s avatar`}
          />
        ) : (
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMUJ_MS_0dtu_FTJs4X5V6VS6KqmARf8cfg&s" className='rounded-full w-12 h-12' alt="" />
        )}
        {/* <textarea className='w-full overflow-auto  rounded-3xl px-3 focus:outline- text-left ' placeholder='share something' /> */}
        <Textarea
          placeholder="Tell us a little bit about yourself" maxLength={400}
          className="resize-none focus-visible:ring-0 ring-0 border-0 outline-0  min-h-12 w-[90%]"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

      </div>

      <div className='flex w-full justify-between mt-4 items-center'>
        <ul className='flex gap-x-8'>
          {footer.map((item, index) => (
            <li key={index} className='flex '>
              <button className='flex gap-x-1 cursor-pointer'>
                {React.cloneElement(item.icon, { size: 18 })}
                <span className='hidden sm:inline text-sm font-bold'>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <Button onClick={handlePost} disabled={isPosting}> {isPosting ? 'Posting...' : 'Post'}</Button>
      </div>
    </div>
  )
}
