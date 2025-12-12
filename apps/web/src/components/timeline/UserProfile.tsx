import { ArrowLeftIcon } from 'lucide-react'
import type { User } from '@/types'
import { useState, useEffect } from 'react'
import api from '@/api/axiosInstance'
import { Posts } from '../feed'
import { useParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router'

export default function UserProfileComponent() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<User | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const { user } = useAuth()

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
      {/* Profile Header */}
      <div className='flex flex-col justify-center gap-x-8 p-4 border-b  w-full'>
       <Link to={'/feed'}><ArrowLeftIcon className='cursor-pointer' /></Link> 
        <div className='flex flex-col w-full px-10'>
          <div className=' flex gap-x-24 ' >
            <div>
              <img src={profile.avatar} alt={profile.username} className='rounded-full w-24 ' />
            </div>
            <div className='bg-red-'>
              <div className=' flex gap-x-10'>
                {/* followers */}
                <div className='w-36  flex flex-col items-center'>
                  <h1 className='font-bold text-3xl '>{profile.followersCount} </h1>
                  <p className='text-md font-bold text-gray-400'>Followers</p>
                </div>
                {/* following */}
                <div className='w-36  flex flex-col items-center'>
                  <h1 className='font-bold text-3xl '>{profile.followingCount} </h1>
                  <p className='text-md font-bold text-gray-400'>Following</p>
                </div>
              </div>
              {/* actions  */}
              {(profile.username == user?.username)
                ?
                (<div><button className='w-full px-2 py-2 cursor-pointer text-purple-400 font-bold text-xl bg-gray-100 mt-4 rounded-3xl'>Edit Profile</button></div>)
                :
                (<div className='flex items-center justify-center gap-x-6 mt-2'>
                  <div>
                    <button className='w-36 px-3 py-1 text-center text-purple-400 font-bold cursor-pointer bg-gray-100 rounded-3xl'>
                      Follow
                    </button>
                  </div>
                  <div>
                    <button className='w-36 px-3 py-1 text-center text-purple-400 font-bold cursor-pointer bg-gray-100 rounded-3xl'>
                      Message
                    </button>
                  </div>
                </div>)
              }

            </div>
          </div>
          <div className='flex flex-col ml-5 mt-2'>
            <h1 className='text-2xl font-bold'>{profile.username}</h1>
            <p className='text-sm text-gray-500'>
              {profile.posts.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* User's Posts/Timeline */}
      <div className='mt-4'>
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <div key={post.id} className='gap-y-4 flex flex-col p-4'>
              <Posts post={post} />

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