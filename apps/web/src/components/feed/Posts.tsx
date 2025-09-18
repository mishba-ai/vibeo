import React, { useEffect } from 'react'
import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
import api from '@/api/axiosInstance'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types'
import CreatePostcard from './CreatePostcard'
import { postColors } from '@/lib/constants'




export default function Posts() {

    const [posts, setPosts] = useState<Post[]>([])
    const [loadingPosts, setLoadingPosts] = useState(true)
    const { loading: authLoading } = useAuth()

    const fetchPosts = async () => {
        try {
            const response = await api.get('api/v1/posts');
            setPosts(response.data)
        } catch (error) {
            console.error('failed to fetch posts ', error)
        } finally {
            setLoadingPosts(false)
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchPosts()
        }
    }, [authLoading])

    const handlePostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    }

    if (authLoading || loadingPosts) {
        return <div>Loading feeds</div>
    }

    //random color posts 
    const getRandomPostColor= () => {
      const randomIndex =   Math.floor (Math.random()* postColors.length)
      return postColors[randomIndex]
    }

    return (
        <div className=' flex flex-col gap-y-8'>
            <CreatePostcard onPostCreated={handlePostCreated} />

            {posts.length > 0 ? (
                posts.map((post) => (
                    <div
                     className=' w-full h-auto p-4 rounded-2xl' 
                     key={post.id}
                      style={{ backgroundColor: getRandomPostColor() }} >
                        {/* posts header */}
                        <div className='flex justify-between'>
                            <div className='flex space-x-2 text-center'>
                                <img src={post.author.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"} className='w-12 h-12 rounded-full' alt="" />
                                <div className=''>
                                    <h1>{post.author.username}</h1>
                                    {/* timestamp */}
                                    <p> {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>{post.content}</p>
                        </div>
                        {/* posts footer */}
                        <div className='w-full mt-4 p-'>
                            <ul className='flex space-x-8 text-gray-600 text-xs'>
                                {/* views */}
                                <li className='flex gap-x-2'>
                                    <Eye size={18} />
                                    <p>{post.viewsCount}</p>
                                </li>
                                {/* likes */}
                                <li className='flex gap-x-2'>
                                    <HeartIcon size={18} />
                                    <p>{post.likesCount}</p>
                                </li>
                                {/* comment */}
                                <li className='flex gap-x-2'>
                                    <MessageCircleIcon size={18} />
                                    <p>{post.commentsCount}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))
            ) : (
                <p> no posts to display</p>
            )
            }

        </div>
    )
}
