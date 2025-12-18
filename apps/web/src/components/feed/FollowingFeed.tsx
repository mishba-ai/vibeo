import { useEffect } from 'react'
import api from '@/api/axiosInstance'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Post } from '@/types'
import CreatePostcard from './CreatePostcard'
import Posts from '../common/Posts'

export default function FollowingFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const { loading: authLoading } = useAuth()

  const fetchFollowingPosts = async () => {
    try {
      setLoadingPosts(true)
      // Use the new endpoint for following posts
      const response = await api.get('/api/v1/posts/following')
      setPosts(response.data)
    } catch (error) {
      console.error('Failed to fetch following posts:', error)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchFollowingPosts()
    }
  }, [authLoading])

  if (authLoading || loadingPosts) {
    return <div className="p-4 text-center">Loading posts...</div>
  }

  return (
    <div className="w-full">
      <CreatePostcard onPostCreated={fetchFollowingPosts} />
      
      <div className="mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="mb-4">
              <Posts post={post} />
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No posts yet. Start following users to see their posts here!
          </div>
        )}
      </div>
    </div>
  )
}