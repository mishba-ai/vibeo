import { useEffect, useState } from "react"
import type { Post } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { X, } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PostComposer } from "./PostComposer";
import api from "@/api/axiosInstance";

interface CommentPopupProps {
    onClose: () => void;
    post: Post;
}

export const CommentPopup = ({ onClose, post }: CommentPopupProps) => {

    const { user } = useAuth()
    // prevent scrolling when popup stopped
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalStyle;
        }
    }, [])

    const handleCreateComment = async (content: string, media: string[]) => {
        await api.post(`api/v1/posts/${post.id}/comment`, { content, media })
    }
    return (
        <>
            <div className="flex justify-center items-center backdrop-blur-sm z-40 fixed inset-0 bg-black/40 " onClick={(e) => e.stopPropagation()} >
                <div className="absolute top-10">
                    <div className="w-[540px] h-auto rounded-2xl bg-purple-100 p-4">
                        <button className="" onClick={(e) => {e.stopPropagation(); onClose();}}> <X /> </button>
                        {/* replying to  */}
                        <div className="flex gap-x-4 mt-8">
                            <div className="flex flex-col items-center">
                                <img src={post.author.avatar || ''} alt="img" className="w-10 h-10 rounded-full aspect-square object-cover" />
                                <div className="w-0.5  h-full bg-purple-200 mt-1 min-h-[]"></div>

                            </div>
                            <div>
                                <div className=" flex gap-x-2 items-baseline">
                                    <h1 className="text-md font-bold">{post.author.username}</h1>
                                    <p className="text-xs text-gray-400"> {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                                </div>
                                <div className="mt-1">
                                    {post.content}

                                </div>
                                <div className="mt-4 mb-2">
                                    <p className="text-xs text-gray-400 font-medium">
                                        Replying to <span className="text-purple-800"> @{post.author.username}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/*  */}
                        <div className="flex gap-x-2 mt-4">
                            <div>
                                <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full" />
                            </div>

                            <PostComposer
                                placeholder="Post your reply"
                                buttonText="Reply"
                                onSubmit={handleCreateComment}
                                onSuccess={onClose}
                            />                      
                          </div>
                    </div>
                </div>
            </div>
        </>
    )
}