import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

interface PostUpdateState {
    likesCount: number
    viewsCount: number
    isLiked: boolean
    isViewed: boolean
    likedBy: string[]
    viewedBy: string[]
    commentsCount:number
}

export const usePostRealtime = (itemId: string,initialData: any) => {
    const { user } = useAuth()
    const [state, setState] = useState<PostUpdateState>({
      likesCount: initialData?.likesCount || 0,
        viewsCount: initialData?.viewsCount || 0,
        // isLiked: user && initialData?.likes?.some((l: any) => l.userId === user.id) : false,
        isLiked: user && initialData.likes 
                ? initialData.likes.some((l: any) => l.userId === user.id) 
                : false,
        isViewed: user ? initialData?.View?.some((v: any) => v.userId === user.id) : false,
        likedBy: initialData?.likes?.map((l: any) => l.userId) || [],
        viewedBy: initialData?.View?.map((v: any) => v.userId) || [],
        // commentsCount:initialData?.comments?.map((v:any) => v.userId) || [],
        commentsCount: initialData?.commentsCount || 0,
    })
    useEffect(() => {
        const handleUpdate = (event: any) => {
            const data = event.detail;
            switch (data.type) {
                case 'connected':
                    console.log('SSE Connected')
                    break

                case 'initial':
                    setState({
                        likesCount: data.likesCount || 0,
                        viewsCount: data.viewsCount || 0,
                        isLiked: user ? data.likedBy?.includes(user.id) : false,
                        isViewed: user ? data.viewedBy?.includes(user.id) : false,
                        likedBy: data.likedBy || [],
                        viewedBy: data.viewedBy || [],
                        commentsCount:data.commentsCount || 0
                    })
                    break

                case 'likeUpdate':
                    setState(prev => ({
                        ...prev,
                        likesCount: data.likesCount,
                        isLiked: user?.id === data.userId ? data.isLiked : prev.isLiked,
                        likedBy: data.likedBy || []
                    }))
                    break

                case 'viewUpdate':
                    setState(prev => ({
                        ...prev,
                        viewsCount: data.viewsCount,
                        isViewed: user?.id === data.userId ? data.isViewed : prev.isViewed,
                        viewedBy: data.viewedBy || []
                    }))
                    break
                case 'newComment':
                    setState(prev=>({
                        ...prev,
                        commentsCount:data.commentsCount,
                        
                    }))
            }
        }
        window.addEventListener(`post-update-${itemId}`, handleUpdate)
        return () => window.removeEventListener(`post-update-${itemId}`, handleUpdate);
    }, [itemId, user?.id])

    return state
}