import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@repo/ui/components/ui/button'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { ImageUploader, ImagePreviewGrid } from '../feed/ImageUploader'
import Emoji from '../feed/Emoji'

interface UploadedImage {
    id: string;
    url: string;
    previewUrl: string;
    uploading: boolean;
}

interface PostComposerProps {
    placeholder?: string;
    buttonText?: string;
    onSubmit: (content: string, media: string[]) => Promise<void>;
    onSuccess?: () => void;
}

export function PostComposer({
    placeholder = "What's on your mind?",
    buttonText = "Post",
    onSubmit,
    onSuccess
}: PostComposerProps) {
    const [postContent, setPostContent] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [images, setImages] = useState<UploadedImage[]>([])
    const [error, setError] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    // const { user } = useAuth()

    const handleEmojiSelect = (emoji: string) => {
        const textarea = textareaRef.current
        if (!textarea) {
            setPostContent(prev => prev + emoji)
            return
        }
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newText = postContent.substring(0, start) + emoji + postContent.substring(end)
        setPostContent(newText)
        setTimeout(() => {
            textarea.setSelectionRange(start + emoji.length, start + emoji.length)
            textarea.focus()
        }, 0)
    }
    const uploadedUrls = images.filter(img => img.url).map(img => img.url)

    const handleInternalSubmit = async () => {
        if (images.some(img => img.uploading)) return setError('Wait for uploads')
        if (!postContent.trim() && uploadedUrls.length === 0) return setError('Content required')

        try {
            setIsPosting(true)
            setError(null)
            await onSubmit(postContent, uploadedUrls)
            setPostContent('')
            setImages([])
            onSuccess?.()
        } catch (err: any) {
            setError(err.message || 'Action failed')
        } finally {
            setIsPosting(false)
        }
    }

    // const hasUploadingImages = images.some(img => img.uploading)

    return (
        <div className='w-full'>
            <div className='flex w-full  rounded-3xl gap-x-2  items-start'>
                {/* <img src={user?.avatar || "/default-avatar.png"} className='rounded-full w-10 h-10' /> */}
                <Textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    className="resize-none  focus-visible:ring-0 ring-0 border-0 outline-0 min-h-12 w-[95%] bg-transparent shadow-none"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isPosting}

                />
            </div>

            <ImagePreviewGrid images={images} onRemove={(id) => setImages(prev => prev.filter(i => i.id !== id))} />

            <div className='flex justify-between mt-3 items-center'>
                <div className='flex gap-2'>
                    <ImageUploader onImagesChange={setImages} onUploadError={setError} maxImages={4} />
                    <Emoji onEmojiSelect={handleEmojiSelect} />
                </div>
                <Button onClick={handleInternalSubmit} disabled={isPosting || images.some(i => i.uploading) || (!postContent.trim() && uploadedUrls.length === 0)}>
                    {isPosting ? 'Sending...' : buttonText}
                </Button>
            </div>
            {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
        </div>
    )
}