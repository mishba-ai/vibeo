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
  const [follow, setFollow] = useState(false)
  const [loadingFollow, setLoadingFollow] = useState(false)

  const fetchUserProfile = async () => {
    if (!username) {
      setLoadingProfile(false)
      return
    }

    try {
      const response = await api.get(`/api/v1/users/${username}`)
      setProfile(response.data)

      if (user) {
        await checkFollowStatus()
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      setProfile(null);
    } finally {
      setLoadingProfile(false)
    }
  }

  const checkFollowStatus = async () => {
    if (!username || !user) return;

    try {
      // You'll need to create this endpoint or check from the profile data
      const response = await api.get(`/api/v1/${username}/follow/status`)
      setFollow(response.data.isFollowing)
    } catch (error) {
      console.error('Failed to check follow status:', error)
      setFollow(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [username])

  // Fetch follow status when profile loads
  // useEffect(() => {
  //   const checkFollowStatus = async () => {
  //     if (!username || !user || profile?.username === user.username) return;

  //     try {
  //       const response = await api.get(`/api/v1/${username}/follow/status`)
  //       setFollow(response.data.isFollowing)
  //     } catch (error) {
  //       console.error('Failed to check follow status:', error)
  //     }
  //   }
  //   if (profile) {
  //     checkFollowStatus()
  //   }
  // }, [username, profile, user])

  if (loadingProfile) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>User profile not found.</div>;
  }

  //toggle follow
  const toggleFollow = async () => {
    if (loadingFollow) return;

    setLoadingFollow(true)
    const previousFollow = follow

    // Optimistic update
    setFollow(!follow)

    try {
      if (!follow) {
        // Follow
        await api.post(`/api/v1/${username}/follow`)
        // Optionally refetch profile to get updated counts
        fetchUserProfile()
      } else {
        // Unfollow
        await api.delete(`/api/v1/${username}/follow`)
        fetchUserProfile()
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // Revert on error
      setFollow(previousFollow)
    } finally {
      setLoadingFollow(false)
    }
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
              {/* actions authenticated user */}

              {(profile.username == user?.username)
                ?
                (<div><button className='w-full px-2 py-2 cursor-pointer text-purple-400 font-bold text-xl bg-gray-100 mt-4 rounded-3xl'>Edit Profile</button></div>)
                :
                (<div className='flex items-center justify-center gap-x-6 mt-2'>
                  <div>
                    <button onClick={toggleFollow} className='w-36 px-3 py-1 text-center hover:bg-gray-100 text-purple-400 font-bold cursor-pointer bg-gray-200 rounded-3xl'>
                      {`${follow ? 'Followed' : 'Follow'} `}
                    </button>
                  </div>
                  <div>
                    //create a conversation room 
                    <Link to={`/message/${profile.conversation.id}`}>
                      <button className='w-36 px-3 py-1 text-center hover:bg-gray-100 text-purple-400 font-bold cursor-pointer bg-gray-200 rounded-3xl'>
                        Message
                      </button>
                    </Link>
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