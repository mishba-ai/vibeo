import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns';
import { postColors } from '@/lib/constants'
import { Link } from 'react-router'
import type { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { usePostLikes } from '@/hooks/usePostLikes';
import { useMemo } from 'react';
interface PostProps {
    post: Post;
}

export default function Posts({ post }: PostProps) {
    //random color posts 
    // Memoize the color based on post.id so it stays consistent

    const getRandomPostColor = useMemo(() => {
        const hash = post.id.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const index = Math.abs(hash) % postColors.length;
        return postColors[index];
    }, [post.id]) // Only recalculate if post.id changes

    const { user } = useAuth()
    const {
        likesCount,
        isLikedByCurrentUser,
        toggleLike,
        isLoading
    } = usePostLikes(post.id, user?.id)


    return (
        <div>
            <div
                className=' w-full h-auto p-4 rounded-2xl gap-y-3'
                key={post.id}
                style={{ backgroundColor: getRandomPostColor }} >
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
                {/* Display images if they exist */}
                {post.media && post.media.length > 0 && (
                    <div className="post-images flex flex-wrap ">
                        {post.media.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Post image ${index + 1}`}
                                className="post-image w-40 "
                            />
                        ))}
                    </div>
                )}
                {/* posts footer action*/}
                <div className='w-full mt-4 p-'>
                    <ul className='flex space-x-8 text-gray-600 text-xs'>
                        {/* views */}
                        <li className='flex gap-x-2'>
                            <Eye size={18} />
                            <p>{post.viewsCount}</p>
                        </li>
                        {/* likes */}
                        <li className='flex gap-x-2'>
                            <button onClick={toggleLike} disabled={isLoading || !user}> <HeartIcon size={18} className={`${isLikedByCurrentUser ? 'fill-current text-red-400' : ''}`} /></button>
                            <p>{likesCount > 0 ? likesCount : '0'}</p>
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