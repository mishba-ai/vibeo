import { useEffect, useState } from "react"
import type { Post } from "@/types";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


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

    return (
        <>
            <div className="flex justify-center items-center backdrop-blur-sm z-40 fixed inset-0 bg-black/40 ">
                <div className="absolute top-10">
                    <div className="w-[540px] h-auto rounded-2xl bg-purple-100 p-4">
                        <button className="" onClick={onClose}> <X /> </button>
                        {/* replying to  */}
                        <div className="flex gap-x-2 mt-8">
                            <div className="">
                                <img src={post.author.avatar || ''} alt="img" className="w-10 h-10 rounded-full " />
                             {/* <div className="w-0.5 h-full bg-gray-300 my-1 min-h-[20px]"></div> */}

                            </div>
                            <div>
                                <div className=" flex gap-x-2 ">
                                    <h1 className="text-md font-bold">{post.author.username}</h1>
                                    <p className="text-sm text-gray-800"> {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                                </div>
                                <div>
                                    {post.content}
                                </div>
                                <div className="mt-2 mb-2">
                                    <p className="text-xs text-gray-800">
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
                            <div className="w-full ">
                                <Textarea placeholder="Reply to Post" className="resize-none  focus-visible:ring-0 ring-0 border-0 outline-0 min-h-12 w-[90%] bg-gray-50"/> 
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}