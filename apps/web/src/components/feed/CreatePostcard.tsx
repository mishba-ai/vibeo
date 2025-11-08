import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@repo/ui/components/ui/button'
import { Textarea } from '@repo/ui/components/ui/textarea'
import api from '@/api/axiosInstance'
import type { Post } from '@/types/index'
import { Link } from 'react-router'
import { ImageUploader, ImagePreviewGrid } from './ImageUploader'
import Emoji from './Emoji'


interface UploadedImage {
    id: string;
    url: string;
    previewUrl: string;
    uploading: boolean;
}

interface CreatePostcardProps {
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePostcard({ onPostCreated }: CreatePostcardProps) {
    const [postContent, setPostContent] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [images, setImages] = useState<UploadedImage[]>([])
    const [error, setError] = useState<string | null>(null)

    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    const API_BASE_URL = import.meta.env.VITE_EXPRESS_API_BASE_URL

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    //   Handle images change from ImageUploader
    const handleImagesChange = (updatedImages: UploadedImage[]) => {
        setImages(updatedImages)
        setError(null)
    }

    //  Handle image upload error
    const handleImageUploadError = (error: string) => {
        setError(`Image upload failed: ${error}`)
    }

    //   Handle image removal from preview grid
    const handleRemoveImage = (imageId: string) => {
        setImages(prev => prev.filter(img => img.id !== imageId))
    }
    
    const handleEmojiSelect = (emoji: string) => {
        const textarea = textareaRef.current
        if (!textarea) {
            // Fallback: append to end
            setPostContent(prev => prev + emoji)
            return
        }

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = postContent

        // Insert emoji at cursor position
        const newText = text.substring(0, start) + emoji + text.substring(end)
        setPostContent(newText)

        // Set cursor position after emoji
        setTimeout(() => {
            const newCursorPos = start + emoji.length
            textarea.setSelectionRange(newCursorPos, newCursorPos)
            textarea.focus()
        }, 0)
    }

    //   Handle post submission
    const handlePost = async () => {
        try {
            // Check if any images are still uploading
            const hasUploadingImages = images.some(img => img.uploading)
            if (hasUploadingImages) {
                setError('Please wait for images to finish uploading')
                return
            }

            // Check if post has content
            const uploadedUrls = images.filter(img => img.url).map(img => img.url)
            if (!postContent.trim() && uploadedUrls.length === 0) {
                setError('Post must have content or images')
                return
            }

            setIsPosting(true)
            setError(null)

            // Create post with content and image URLs
            const response = await api.post('api/v1/posts', {
                content: postContent,
                media: uploadedUrls,
            })

            console.log('Post created successfully:', response.data)
            onPostCreated(response.data.post)

            // Clear everything after successful post
            setPostContent('')
            setImages([])

        } catch (error: any) {
            console.error('Post creation failed:', error)
            const errorMsg = error.response?.data?.message || error.message || 'Post creation failed'
            setError(`Post creation failed: ${errorMsg}`)
        } finally {
            setIsPosting(false)
        }
    }

    const hasUploadingImages = images.some(img => img.uploading)
    const uploadedUrls = images.filter(img => img.url).map(img => img.url)

    return (
        <div className='w-full h-auto border-black rounded-xl bg-violet-100 p-6'>
            {/* Content Input */}
            <div className='flex w-full h-auto bg-gray-50 rounded-3xl gap-x-2 p-2'>
                {user ? (
                    <Link to={`/users/${encodeURIComponent(user.username)}`}>
                        <img
                            src={`${API_BASE_URL}/auth/avatar/${user.id}`}
                            className='rounded-full w-12 h-12 border'
                            alt={`${user.username}'s avatar`}
                        />
                    </Link>
                ) : (
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTMUJ_MS_0dtu_FTJs4X5V6VS6KqmARf8cfg&s"
                        className='rounded-full w-12 h-12'
                        alt="Default avatar"
                    />
                )}
                <Textarea
                    ref={textareaRef}
                    placeholder="What's on your mind?"
                    maxLength={400}
                    className="resize-none  focus-visible:ring-0 ring-0 border-0 outline-0 min-h-12 w-[90%] bg-gray-50"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isPosting}
                />
            </div>

            {/* Image Preview Grid */}
            <ImagePreviewGrid
                images={images}
                onRemove={handleRemoveImage}
            />

            {/* Error Message */}
            {error && (
                <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-red-600 text-sm'>{error}</p>
                </div>
            )}

            {/* Footer Actions  */}
            <div className='flex w-full justify-between mt-4 items-center'>
                <div className='flex gap-2'>
                    <ImageUploader
                        onImagesChange={handleImagesChange}
                        onUploadError={handleImageUploadError}
                        disabled={isPosting}
                        maxImages={4}
                    />
                    <Emoji onEmojiSelect={handleEmojiSelect} />
                </div>
                {/* Post Button */}
                <Button
                    onClick={handlePost}
                    disabled={isPosting || hasUploadingImages || (!postContent.trim() && uploadedUrls.length === 0)}
                >
                    {isPosting ? 'Posting...' : 'Post'}
                </Button>
            </div>
        </div>
    )
}