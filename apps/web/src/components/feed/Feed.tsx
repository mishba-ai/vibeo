import React, { useEffect } from 'react'
import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
import api from '@/api/axiosInstance'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types'
import CreatePostcard from './CreatePostcard'
import { postColors } from '@/lib/constants'
import { Link } from 'react-router'
import Posts from './Posts'



export default function Feed() {

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

    

    return (
        <div className=' flex flex-col gap-y-8'>
            <CreatePostcard onPostCreated={handlePostCreated} />

            {posts.length > 0 ? (
                posts.map((post) => (
                    <Posts key={post.id} post={post} />
                ))
            ) : (
                <p> no posts to display</p>
            )
            }

        </div>
    )
}
