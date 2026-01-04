import api from "@/api/axiosInstance"
import { useAuth } from "./useAuth"
import { useEffect, useRef } from "react"

export const usePostViews = (postId: string) => {
    const { user } = useAuth()
    const hasViewed = useRef(false)

    const trackView = async () => {
        if (!user || hasViewed.current) return

        try {
            hasViewed.current = true
             await api.post(`api/v1/posts/${postId}/view`
            )
        } catch (error) {
            console.error('error tracking view', error);
            hasViewed.current = false;
        }
    }
    useEffect(() => {
        if (!user || !postId) return
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Trigger view when 50% of post is visible for at least 1 second
                if (entry.isIntersecting && !hasViewed.current) {
                        trackView()
                   observer.unobserve(entry.target); // Stop watching this post
                }
            })
        },
            {
                threshold: 0.5,
                rootMargin: '0px'
            }
        )
        const element = document.getElementById(`post-${postId}`)
        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [postId, user])
    return { trackView }
}