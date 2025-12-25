import { useEffect, useState, useRef } from "react";
import api from "@/api/axiosInstance";

interface LikeUpdate {
    type: 'connected' | 'initial' | 'likeUpdate'
    postId?: string
    likesCount?: number
    userId?: string
    isliked?: boolean
    likedBy?: string[]
}

export const usePostRealtime = (postId: string, currentUserId?: string) => {
    const [likesCount, setLikesCount] = useState(0);
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false)
    const [likedByUsers, setLikedByUsers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [sseConnected, setSSEConnected] = useState(false)
    const eventSourceRef = useRef<EventSource | null>(null)
    const isLoadingRef = useRef(false) // Track loading with ref to avoid recreating effect

    // SSE connection for real-time updates
    useEffect(() => {
        if (!postId) return;
        
        // Prevent duplicate connections
        if (eventSourceRef.current) {
            console.log(`⚠️ SSE already connected for post ${postId}, skipping...`);
            return;
        }

        const baseURL = api.defaults.baseURL || 'http://localhost:3000'
        console.log('🔌 Connecting to SSE:', `${baseURL}/api/v1/posts/${postId}/subscribe`);

        const eventSource = new EventSource(
            `${baseURL}/api/v1/posts/${postId}/subscribe`, 
            { withCredentials: true }
        )
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log('✅ SSE connection opened for post:', postId);
            setSSEConnected(true)
        }

        eventSource.onmessage = (event) => {
            try {
                const data: LikeUpdate = JSON.parse(event.data);

                if (data.type === 'initial' || data.type === 'likeUpdate') {
                    // Skip updates if we're currently loading AND it's our own action
                    if (isLoadingRef.current && data.userId === currentUserId) {
                        return;
                    }
                    
                    if (data.likesCount !== undefined) setLikesCount(data.likesCount);
                    if (data.likedBy) {
                        setLikedByUsers(data.likedBy);
                        if (currentUserId) {
                            setIsLikedByCurrentUser(data.likedBy.includes(currentUserId));
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Error parsing SSE data:', error);
            }
        }

        eventSource.onerror = (error) => {
            console.error('❌ SSE connection error:', error);
            setSSEConnected(false)
            eventSourceRef.current = null // Clear ref on error
            eventSource.close()
        }

        return () => {
            console.log(`🔌 Cleaning up SSE for post ${postId}`)
            eventSource.close()
            eventSourceRef.current = null
        }
    }, [postId]) // Only reconnect if postId changes

    // Toggle like function with optimistic update
    const toggleLike = async () => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true
        setIsLoading(true)

        // Optimistic update for INSTANT UI feedback
        const prevLikedState = isLikedByCurrentUser
        const prevCount = likesCount
        
        setIsLikedByCurrentUser(!prevLikedState)
        setLikesCount(prev => prevLikedState ? prev - 1 : prev + 1)

        try {
            await api.post(`/api/v1/posts/${postId}/like`);
            console.log('✅ Like toggled successfully');
        } catch (error) {
            console.error('❌ Error toggling like:', error);
            
            // Revert optimistic update on error
            setIsLikedByCurrentUser(prevLikedState)
            setLikesCount(prevCount)
        } finally {
            isLoadingRef.current = false
            setIsLoading(false)
        }
    }

    return {
        likesCount,
        isLikedByCurrentUser,
        likedByUsers,
        toggleLike,
        isLoading,
        sseConnected
    }
}