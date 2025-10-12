'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Check } from 'lucide-react'
import { Button } from './button'
import { Card } from './card'
import { cn } from '@/lib/utils/cn'

interface PhotoCaptureProps {
  onCapture: (file: File) => void
  maxPhotos?: number
  className?: string
  acceptedFormats?: string
}

/**
 * Mobile photo capture component with camera and file upload
 */
export function PhotoCapture({
  onCapture,
  maxPhotos = 10,
  className,
  acceptedFormats = 'image/*',
}: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (photos.length < maxPhotos) {
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (event) => {
          const photoUrl = event.target?.result as string
          setPhotos((prev) => [...prev, photoUrl])
        }
        reader.readAsDataURL(file)
        
        // Call onCapture with the file
        onCapture(file)
      }
    })
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleGalleryClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePhotoClick = (photo: string) => {
    setCurrentPhoto(photo)
    setShowPreview(true)
  }

  // Check if device has camera
  const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

  return (
    <div className={cn('space-y-4', className)}>
      {/* Capture Buttons */}
      <div className="flex gap-3">
        {hasCamera && (
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleCameraClick}
          >
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
        )}
        
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={handleGalleryClick}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemovePhoto(index)
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-status-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Add more button */}
          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={handleGalleryClick}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-dewalt-yellow flex items-center justify-center transition-colors"
            >
              <Camera className="w-8 h-8 text-text-tertiary" />
            </button>
          )}
        </div>
      )}

      {/* Photo limit indicator */}
      {photos.length > 0 && (
        <p className="text-xs text-text-tertiary text-center">
          {photos.length} / {maxPhotos} photos
        </p>
      )}

      {/* Preview Modal */}
      {showPreview && currentPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <img
            src={currentPhoto}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

