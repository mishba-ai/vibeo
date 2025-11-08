// ImageUploader.tsx
import { uploadSingleFile } from '@/api/uploadService'
import { validateFile } from '@/utils/fileValidation'
import React, { useRef, useState, type ChangeEvent } from 'react'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface UploadedImage {
    id: string;
    url: string;
    previewUrl: string;
    uploading: boolean;
}

interface ImageUploaderProps {
    onImagesChange: (images: UploadedImage[]) => void;
    onUploadError?: (error: string) => void;
    disabled?: boolean;
    maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImagesChange,
    onUploadError,
    disabled = false,
    maxImages = 4
}) => {
    const [images, setImages] = useState<UploadedImage[]>([])
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    
    //   Handle file selection - supports multiple files
     
    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Check max images limit
        if (images.length + files.length > maxImages) {
            const errorMsg = `You can only upload up to ${maxImages} images`
            setError(errorMsg)
            if (onUploadError) onUploadError(errorMsg)
            return
        }

        setError(null)

        // Process each file
        for (const file of files) {
            // Validate file
            const validation = validateFile(file)
            if (!validation.isValid) {
                setError(validation.error || 'Invalid file')
                if (onUploadError) onUploadError(validation.error || 'Invalid file')
                continue
            }

            // Create temporary ID
            const tempId = `temp-${Date.now()}-${Math.random()}`

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                const previewUrl = reader.result as string

                // Add image with loading state
                const newImage: UploadedImage = {
                    id: tempId,
                    url: '',
                    previewUrl,
                    uploading: true
                }

                setImages(prev => {
                    const updated = [...prev, newImage]
                    onImagesChange(updated)
                    return updated
                })

                // Upload the file
                uploadFile(file, tempId, previewUrl)
            }
            reader.readAsDataURL(file)
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    
    //  * Upload file to server
     
    const uploadFile = async (file: File, tempId: string, previewUrl: string) => {
        try {
            const response = await uploadSingleFile(file, (progress) => {
                console.log(`Upload progress: ${progress}%`)
            })

            const imageUrl = response.data.url

            // Update image with uploaded URL
            setImages(prev => {
                const updated = prev.map(img =>
                    img.id === tempId
                        ? { ...img, url: imageUrl, uploading: false }
                        : img
                )
                onImagesChange(updated)
                return updated
            })

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Upload failed'
            setError(errorMessage)
            if (onUploadError) onUploadError(errorMessage)

            // Remove failed upload
            setImages(prev => {
                const updated = prev.filter(img => img.id !== tempId)
                onImagesChange(updated)
                return updated
            })
        }
    }

    
    //  * Remove image by ID
     
    const handleRemoveImage = (imageId: string) => {
        setImages(prev => {
            const updated = prev.filter(img => img.id !== imageId)
            onImagesChange(updated)
            return updated
        })
        setError(null)
    }

    
    //   Trigger file input click
     
    const handleButtonClick = () => {
        if (!disabled && images.length < maxImages) {
            fileInputRef.current?.click()
        }
    }

    const hasUploadingImages = images.some(img => img.uploading)
    const canAddMore = images.length < maxImages

    return (
        <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
                disabled={disabled || !canAddMore}
            />

            {/* Add Image Button */}
            <button
                onClick={handleButtonClick}
                disabled={disabled || !canAddMore || hasUploadingImages}
                className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-violet-600 transition-colors disabled:opacity-50 border border-dashed border-gray-300 rounded-lg hover:border-violet-400 min-w-[120px] justify-center"
                type="button"
            >
                {hasUploadingImages ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <ImageIcon size={18} />
                )}
                <span className="font-medium">
                    {hasUploadingImages ? 'Uploading...' : canAddMore ? 'Add Image' : `Max ${maxImages}`}
                </span>
            </button>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-xs">{error}</p>
            )}
        </div>
    )
}

/*
 Image Preview Grid Component 
 */
interface ImagePreviewGridProps {
    images: UploadedImage[];
    onRemove: (imageId: string) => void;
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({ images, onRemove }) => {
    if (images.length === 0) return null

    return (
        <div className={`grid gap-2 mt-4 ${
            images.length === 1 ? 'grid-cols-1' :
            images.length === 2 ? 'grid-cols-2' :
            images.length === 3 ? 'grid-cols-3' :
            'grid-cols-2'
        }`}>
            {images.map((image) => (
                <div key={image.id} className="relative group">
                    <img
                        src={image.previewUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                    
                    {/* Loading overlay */}
                    {image.uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <Loader2 size={24} className="text-white animate-spin" />
                        </div>
                    )}
                    
                    {/* Remove button  */}
                    <button
                        onClick={() => onRemove(image.id)}
                        disabled={image.uploading}
                        className="absolute top-2 right-2 bg-gray-900 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50 opacity-90 hover:opacity-100"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    )
}