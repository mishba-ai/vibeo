import api from "@/api/axiosInstance"
import { useState, useEffect, useRef } from "react"
import type { Post } from "@/types"


export const usePostComments = (postId: String) => {
    const [comments, setComments] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     const fetchComments = async () => {
    //         try {
    //             setIsLoading(true);
    //             const response = await api.post(`api/v1/posts/${postId}/comments`);
    //             setComments(response.data)
    //         } catch (error) {
    //             console.error(error);
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    //     if (postId) fetchComments()
    // }, [postId]);

    useEffect(() => {
        const handleNewComment = (event: any) => {
            const data = event.detail;

            //only act if the event type 
            if (data.type === 'newComment') {
                const newComment = {
                    ...data.comment,
                    author: data.author,
                    likes: [],
                    View: [],
                    likesCount: 0,
                    viewsCount: 0,
                    commentsCount: 0
                }
                setComments(prev => [newComment as Post, ...prev])
            }
        }
        window.addEventListener(`post-update-${postId}`, handleNewComment);
        return () => {
            window.removeEventListener(`post-update-${postId}`, handleNewComment);
        };
    }, [postId])

    const addComment = async (content: string) => {
        try {
            const response = await api.post(`api/v1/posts/${postId}/comment`, { content })
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    return { comments, isLoading, addComment }
}