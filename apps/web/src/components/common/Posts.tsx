import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns';
import { postColors } from '@/lib/constants'
import { Link } from 'react-router'
import type { Post } from '@/types';

interface PostProps {
    post: Post;
}

export default function Posts({ post }: PostProps) {

    //random color posts 
    const getRandomPostColor = () => {
        const randomIndex = Math.floor(Math.random() * postColors.length)
        return postColors[randomIndex]
    }
    return (
        <div>
            <div
                className=' w-full h-auto p-4 rounded-2xl gap-y-3'
                key={post.id}
                style={{ backgroundColor: getRandomPostColor() }} >
                {/* posts header */}
                <div className='flex justify-between'>
                    <div className='flex space-x-2 text- gap-y-'>
                        <Link to={`/users/${encodeURIComponent(post.author.username)}`}>
                            <img src={post.author.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"}
                                className='w-12 h-12 rounded-full' alt="" /></Link>
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
        </div>
    )
}