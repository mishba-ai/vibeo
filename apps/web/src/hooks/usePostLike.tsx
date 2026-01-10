import api from "@/api/axiosInstance"
import { useState } from "react"
import { useAuth } from "./useAuth"

export const usePostLike = (postId: string,type: 'post' | 'comment' = 'post') => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const toggleLike = async () => {
        if (!user || isLoading) return
        
        setIsLoading(true)
        try {
            const endpoint = type === 'post'
                ? `/api/v1/posts/${postId}/like`
                : `/api/v1/comments/${postId}/like`;
            await api.post(endpoint);
        } catch (error) {
            console.error('Error toggling like', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { toggleLike, isLoading }
}