'use client'

import { useState } from 'react'
import { Trash2, Archive, Edit } from 'lucide-react'
import { Card } from './card'
import { useSwipe, hapticFeedback } from '@/lib/utils/touchGestures'
import { cn } from '@/lib/utils/cn'

interface SwipeableCardProps {
  children: React.ReactNode
  onDelete?: () => void
  onArchive?: () => void
  onEdit?: () => void
  className?: string
  deleteThreshold?: number
}

/**
 * Card with swipe-to-delete/archive functionality
 * Swipe left to delete, swipe right to archive
 */
export function SwipeableCard({
  children,
  onDelete,
  onArchive,
  onEdit,
  className,
  deleteThreshold = 100,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0)
  const [swiping, setSwiping] = useState(false)

  let touchStart = 0
  let currentTranslate = 0

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart = e.targetTouches[0].clientX
    setSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return

    const currentTouch = e.targetTouches[0].clientX
    const diff = currentTouch - touchStart
    
    // Limit swipe distance
    if (onDelete && diff < 0 && Math.abs(diff) < 150) {
      currentTranslate = diff
      setTranslateX(diff)
    } else if (onArchive && diff > 0 && diff < 150) {
      currentTranslate = diff
      setTranslateX(diff)
    }
  }

  const handleTouchEnd = () => {
    setSwiping(false)

    // Delete action (swipe left)
    if (onDelete && currentTranslate < -deleteThreshold) {
      setTranslateX(-300) // Slide off screen
      hapticFeedback('medium')
      setTimeout(() => {
        onDelete()
      }, 200)
      return
    }

    // Archive action (swipe right)
    if (onArchive && currentTranslate > deleteThreshold) {
      setTranslateX(300) // Slide off screen
      hapticFeedback('medium')
      setTimeout(() => {
        onArchive()
      }, 200)
      return
    }

    // Reset position
    setTranslateX(0)
    currentTranslate = 0
  }

  const showDelete = onDelete && translateX < -50
  const showArchive = onArchive && translateX > 50

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between">
        {/* Archive button (left side, revealed on right swipe) */}
        {onArchive && (
          <div
            className={cn(
              'h-full flex items-center px-6 bg-status-success text-white transition-opacity',
              showArchive ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Archive className="w-6 h-6" />
          </div>
        )}
        
        {/* Delete button (right side, revealed on left swipe) */}
        {onDelete && (
          <div
            className={cn(
              'h-full flex items-center px-6 bg-status-error text-white ml-auto transition-opacity',
              showDelete ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Trash2 className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Card */}
      <Card
        className={cn(
          'relative transition-transform',
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: swiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Card>
    </div>
  )
}

