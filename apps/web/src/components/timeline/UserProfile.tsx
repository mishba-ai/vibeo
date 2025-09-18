import { ArrowLeftIcon } from 'lucide-react'
import type { Post, User } from '@/types'
import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'
import { Posts } from '../feed'
import { useParams } from 'react-router'

interface UserProfile {
  id: string;
  username: string;
  avatar?: string | null;
  posts: Post[];
}

export default function UserProfileComponent() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const fetchUserProfile = async () => {
    if (!username) {
      setLoadingProfile(false)
      return
    }

    try {
      const response = await api.get(`/api/v1/users/${username}`)
      setProfile(response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      setProfile(null);
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {

    fetchUserProfile()

  }, [username])

  if (loadingProfile) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>User profile not found.</div>;
  }

  return (
    <div className=''>
      {/* Profile Header, rendered once */}
      <div className='flex items-center gap-x-8 p-4 border-b'>
        <ArrowLeftIcon className='cursor-pointer' />
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>{profile.username}</h1>
          <p className='text-sm text-gray-500'>
            {profile.posts.length} posts
          </p>
        </div>
      </div>

      {/* User's Posts/Timeline */}
      <div className='mt-4'>
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <div key={post.id} className='gap-y-4 flex flex-col p-4'>
              <Posts post={post} />
              {/* Add more post details like likes, comments, etc. */}
            </div>
          ))
        ) : (
          <div className='p-4 text-center text-gray-500'>
            This user hasn't posted anything yet.
          </div>
        )}
      </div>
    </div>
  )
}