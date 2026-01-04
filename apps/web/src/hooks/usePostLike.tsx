import api from "@/api/axiosInstance"
import { useState } from "react"
import { useAuth } from "./useAuth"

export const usePostLike = (postId: string) => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const toggleLike = async () => {
        if (!user || isLoading) return
        
        setIsLoading(true)
        try {
            await api.post(`api/v1/posts/${postId}/like`)
        } catch (error) {
            console.error('Error toggling like', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { toggleLike, isLoading }
}