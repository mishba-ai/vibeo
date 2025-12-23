import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

interface LikeUpdate {
    type: 'connected' | 'initial' | 'likeUpdate'
    postId?: string
    likesCount?: number
    userId?: string
    isliked?: boolean
    likedBy?: string[]
}

export const usePostLikes = (postId: string, currentUserId?: string) => {
    const [likesCount, setLikesCount] = useState(0);
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false)
    const [likedByUsers, setLikedByUsers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [sseConnected, setSSEConnected] = useState(false)

    //sse connection for real-time updates
    useEffect(() => {
        if (!postId) return;
        const baseURL = api.defaults.baseURL || 'http://localhost:3000'
        console.log('🔌 Connecting to SSE:', baseURL);


        // Create SSE connection to receive real-time like updates for this post
        const eventSource = new EventSource(`${baseURL}/api/v1/posts/${postId}/subscribe`, { withCredentials: true })

        // Connection opened
        eventSource.onopen = () => {
            console.log('✅ SSE connection opened for post:', postId);
            setSSEConnected(true)
        }

        // Handle incoming messages from the server
        eventSource.onmessage = (event) => {
            try {
                // Parse the incoming JSON data
                const data: LikeUpdate = JSON.parse(event.data);

                // Process only initial data or like update events
                if (data.type === 'initial' || data.type === 'likeUpdate') {
                    if (data.userId === currentUserId) {
                console.log("Ignoring SSE update because it was triggered by this user.");
                return; 
            }
                    // Update total likes count if provided
                    if (data.likesCount != undefined) {
                        setLikesCount(data.likesCount)
                    }

                    // Update the list of users who liked this post
                    if (data.likedBy) {
                        setLikedByUsers(data.likedBy)

                        // Check if current user has liked the post
                        if (currentUserId) {
                            setIsLikedByCurrentUser(data.likedBy.includes(currentUserId))
                        }
                    }
                }
            } catch (error) {
                console.error('error parsing sse data', error);
            }
        }
        eventSource.onerror = (error) => {
            console.error('sse connection error', error);
                        setSSEConnected(false)

            eventSource.close()
        }

        return () => {
                        console.log(`SSE disconnected for post ${postId}`)

            eventSource.close()
        }
    }, [postId, currentUserId])

    //toggle like function
    const toggleLike = async () => {
        if (isLoading) return;
        setIsLoading(true)
        const previousLiked = isLikedByCurrentUser
        const previousCount = likesCount
        const previousUsers = [...likedByUsers]

        // Optimistic update for immediate UI feedback
        const newLikedState = !isLikedByCurrentUser
        setIsLikedByCurrentUser(newLikedState)
        setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1)

        // Update likedByUsers array optimistically
        if (currentUserId) {
            if (newLikedState) {
                // Adding like
                setLikedByUsers([...likedByUsers, currentUserId])
            } else {
                // Removing like
                setLikedByUsers(likedByUsers.filter(id => id !== currentUserId))
            }
        }
        console.log(' Toggling like for post:', postId);

        try {
            const response = await api.post(`/api/v1/posts/${postId}/like`);
            console.log('✅ Like toggle response:', response.data);

        } catch (error) {
            console.error('error togging like:', error);

            //revert update on error
            setIsLikedByCurrentUser(previousLiked)
            setLikesCount(previousCount)
            setLikedByUsers(previousUsers)
        } finally {
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