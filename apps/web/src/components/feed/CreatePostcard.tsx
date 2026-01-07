import { useAuth } from '@/hooks/useAuth'
import api from '@/api/axiosInstance'
import type { Post } from '@/types/index'
import { Link } from 'react-router'
import { PostComposer } from '../common/PostComposer'


interface CreatePostcardProps {
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePostcard({ onPostCreated }: CreatePostcardProps) {

    const { user } = useAuth()

    const API_BASE_URL = import.meta.env.VITE_EXPRESS_API_BASE_URL

    const handleCreatePost = async (content: string, media: string[]) => {
        const response = await api.post('api/v1/posts', { content, media })
        onPostCreated(response.data.post)
    }
    return (
        <div className='w-full h-auto border-black rounded-xl bg-violet-100 p-6'>
            {/* Content Input */}
            <div className='flex w-full h-auto bg-gray-50 rounded-3xl gap-x-2 p-2'>
                {user ? (
                    <Link to={`/users/${encodeURIComponent(user.username)}`}>
                        <img
                            src={`${API_BASE_URL}/auth/avatar/${user.id}`}
                            className='rounded-full w-12 h-12 border'
                            alt={`${user.username}'s avatar`}
                        />
                    </Link>
                ) : (
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMUJ_MS_0dtu_FTJs4X5V6VS6KqmARf8cfg&s"
                        className='rounded-full w-12 h-12'
                        alt="Default avatar"
                    />
                )}
                <PostComposer onSubmit={handleCreatePost} />
            </div>
        </div>
    )
}