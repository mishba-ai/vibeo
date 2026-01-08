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

interface PostProps {
    post: Post;
    isComment: boolean
}

export default function Posts({ post, isComment = false }: PostProps) {

    //random color posts 
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
        isLiked,
        viewsCount,
        commentsCount
    } = usePostRealtime(post.id, post)

    usePostViews(post.id)
    const { toggleLike, isLoading } = usePostLike(post.id)

    // commentpost  
    const [commentbtn, setCommentbtn] = useState(false)

    function openCommmentPopup() {
        setCommentbtn(!commentbtn)
    }
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/${post.author.username}/${post.id}`);
    };

    return (
        <div onClick={handleCardClick}>
            <div
                id={`post-${post.id}`}
                className={`w-full h-auto p-4 rounded-2xl gap-y-3 cursor-pointer`}
                key={post.id}
                style={{ backgroundColor: !isComment ? getRandomPostColor : undefined }}
            >
                {/* posts header */}
                <div className='flex justify-between'>
                    <div className='flex space-x-5 text- gap-y-'>
                        <Link to={`/users/${encodeURIComponent(post.author.username)}`} onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <img src={post.author.avatar || "https://img.freepik.com/premium-vector/cute-adorable-little-girl-character-avatar-isolated_925324-1724.jpg"}
                                className='w-12 h-12 rounded-full' alt="" />
                        </Link>
                        <div className=''>
                            <div className='flex gap-x-2 items-baseline'>
                                <h1 className='font-bold'>{post.author.username}</h1>
                                {/* timestamp */}
                                <p className='text-xs text-gray-500'> {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                            </div>
                            <div className='mt-2'>
                                <div>
                                    <p className=''>{post.content}</p>
                                </div>
                                {/* Display images if they exist */}
                                {post.media && post.media.length > 0 && (
                                    <div className="post-images flex flex-wrap mt-3 ">
                                        {post.media.map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={imageUrl}
                                                alt={`Post image ${index + 1}`}
                                                className="post-image w-72 rounded-xl"
                                            />
                                        ))}
                                    </div>
                                )}
                                {/* posts footer action*/}
                                <div className='w-full mt-6'>
                                    <ul className='flex space-x-8 text-gray-600 text-xs'>
                                        {/* views */}
                                        <li className='flex gap-x-2'>
                                            <Eye size={18} />
                                            <p>{viewsCount}</p>
                                        </li>
                                        {/* likes */}
                                        <li className='flex gap-x-2'>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike()
                                            }} disabled={isLoading || !user} className="transition-transform active:scale-90">
                                                <HeartIcon size={18} className={`${isLiked ? 'fill-current text-red-400' : ''}`} />
                                            </button>
                                            <p> {likesCount}</p>
                                        </li>
                                        {/* comment */}
                                        <li className='flex gap-x-2'>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                openCommmentPopup();
                                            }}
                                            ><MessageCircleIcon size={18} /></button>
                                            <p>{commentsCount}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div></div>
                    </div>
                </div>

            </div>
            {commentbtn && (
                <div className='w-full flex justify-center items-center'>
                    <CommentPopup onClose={() => setCommentbtn(false)} post={post} />
                </div>
            )}
        </div>
    )
}