import { Eye, HeartIcon, MessageCircleIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns';
import { postColors } from '@/lib/constants'
import { Link, useNavigate } from 'react-router'
import type { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { usePostRealtime } from '@/hooks/usePostRealtime';
import { useMemo, useState } from 'react';
import { usePostViews } from '@/hooks/usePostViews';
import { usePostLike } from '@/hooks/usePostLike';
import { CommentPopup } from './CommentPopup';

interface CardProps {
    post: Post;
    type: 'post' | 'comment';
}

export default function Card({ post, type }: CardProps) {
    const { user } = useAuth()
    const navigate = useNavigate();

    // Random color for posts only
    const getRandomPostColor = useMemo(() => {
        if (type === 'comment' || !post?.id) return "#ffffff";
        const hash = post?.id.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const index = Math.abs(hash) % postColors.length;
        return postColors[index];
    }, [post?.id, type])

    // Use appropriate hooks based on type
    const {
        likesCount,
        isLiked,
        viewsCount,
        commentsCount
    } = usePostRealtime(post.id, post)

    // Track views and likes with type-specific logic
    usePostViews(post.id, type)
    const { toggleLike, isLoading } = usePostLike(post.id, type)

    // Comment popup state
    const [commentbtn, setCommentbtn] = useState(false)

    function openCommentPopup() {
        setCommentbtn(!commentbtn)
    }

    const handleCardClick = () => {
        if (type === 'post') {
            navigate(`/${post.author.username}/${post.id}`);
        }
    };

    return (
        <div onClick={type === 'post' ? handleCardClick : undefined}>
            <div
                id={`${type}-${post.id}`}
                className={`w-full h-auto p-4 rounded-2xl gap-y-3 ${type === 'post' ? 'cursor-pointer' : ''}`}
                key={post.id}
                style={{ backgroundColor: type === 'post' ? getRandomPostColor : undefined }}
            >
                {/* Header */}
                <div className='flex justify-between'>
                    <div className='flex space-x-5 text- gap-y-'>
                        <Link to={`/users/${encodeURIComponent(post.author?.username)}`} onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <img 
                                src={post.author?.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"}
                                className='w-12 h-12 rounded-full' 
                                alt="" 
                            />
                        </Link>
                        <div className=''>
                            <div className='flex gap-x-2 posts-baseline'>
                                <h1 className='font-bold'>{post.author?.username}</h1>
                                {/* Timestamp */}
                                <p className='text-xs text-gray-500'>{(() => {
                                    const date = new Date(post?.createdAt);
                                    return !post?.createdAt || isNaN(date.getTime())
                                        ? "Just now"
                                        : formatDistanceToNow(date, { addSuffix: true });
                                })()}</p>
                            </div>
                            <div className='mt-2'>
                                <div>
                                    <p className=''>{post?.content}</p>
                                </div>
                                {/* Display images if they exist */}
                                {post?.media && post.media?.length > 0 && (
                                    <div className="post-images flex flex-wrap mt-3">
                                        {post.media?.map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={imageUrl}
                                                alt={`${type} image ${index + 1}`}
                                                className="post-image w-72 rounded-xl"
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* Footer actions */}
                                <div className='w-full mt-6'>
                                    <ul className='flex space-x-8 text-gray-600 text-xs'>
                                        {/* Views */}
                                        <li className='flex gap-x-2'>
                                            <Eye size={18} />
                                            <p>{viewsCount}</p>
                                        </li>
                                        {/* Likes */}
                                        <li className='flex gap-x-2'>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike()
                                                }} 
                                                disabled={isLoading || !user} 
                                                className="transition-transform active:scale-90"
                                            >
                                                <HeartIcon 
                                                    size={18} 
                                                    className={`${isLiked ? 'fill-current text-red-400' : ''}`} 
                                                />
                                            </button>
                                            <p>{likesCount}</p>
                                        </li>
                                        {/* Comments - only show for posts */}
                                        {type === 'post' && (
                                            <li className='flex gap-x-2'>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openCommentPopup();
                                                    }}
                                                >
                                                    <MessageCircleIcon size={18} />
                                                </button>
                                                <p>{commentsCount}</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {commentbtn && type === 'post' && (
                <div className='w-full flex justify-center posts-center'>
                    <CommentPopup onClose={() => setCommentbtn(false)} post={post} />
                </div>
            )}
        </div>
    )
}