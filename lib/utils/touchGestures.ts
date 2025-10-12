/**
 * Touch Gesture Utilities
 * Handles swipe, long-press, and other touch interactions
 */

export interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number // Minimum distance for swipe (default: 50px)
}

export interface LongPressConfig {
  onLongPress: () => void
  delay?: number // Delay before long press fires (default: 500ms)
}

/**
 * Swipe gesture detector
 * Usage: const swipeHandlers = useSwipe({ onSwipeLeft: () => delete() })
 */
export function useSwipe(config: SwipeConfig) {
  const threshold = config.threshold || 50
  let touchStart: { x: number; y: number } | null = null
  let touchEnd: { x: number; y: number } | null = null

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd = null
    touchStart = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Horizontal swipe
    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        config.onSwipeLeft?.()
      } else {
        config.onSwipeRight?.()
      }
    }

    // Vertical swipe
    if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        config.onSwipeUp?.()
      } else {
        config.onSwipeDown?.()
      }
    }

    touchStart = null
    touchEnd = null
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}

/**
 * Long press detector
 * Usage: const longPressHandlers = useLongPress({ onLongPress: () => showMenu() })
 */
export function useLongPress(config: LongPressConfig) {
  const delay = config.delay || 500
  let timeout: NodeJS.Timeout | null = null
  let preventClick = false

  const onTouchStart = (e: React.TouchEvent) => {
    preventClick = false
    timeout = setTimeout(() => {
      preventClick = true
      config.onLongPress()
      // Haptic feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }, delay)
  }

  const onTouchEnd = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  const onTouchMove = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  const onClick = (e: React.MouseEvent) => {
    if (preventClick) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onClick,
  }
}

/**
 * Pull to refresh
 * Usage: const pullRefreshHandlers = usePullToRefresh({ onRefresh: async () => await reload() })
 */
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  let touchStart = 0
  let pulling = false
  let refreshing = false

  const onTouchStart = (e: React.TouchEvent) => {
    // Only trigger if at top of page
    if (window.scrollY === 0) {
      touchStart = e.targetTouches[0].clientY
      pulling = true
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return

    const touchCurrent = e.targetTouches[0].clientY
    const pullDistance = touchCurrent - touchStart

    // If pulled down more than 80px
    if (pullDistance > 80) {
      // Visual feedback (handled by parent component)
      const element = e.currentTarget as HTMLElement
      element.style.transform = `translateY(${Math.min(pullDistance, 120)}px)`
    }
  }

  const onTouchEnd = async (e: React.TouchEvent) => {
    if (!pulling || refreshing) return

    const element = e.currentTarget as HTMLElement
    const pullDistance = parseInt(element.style.transform.match(/\d+/)?.[0] || '0')

    if (pullDistance > 80) {
      refreshing = true
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      await onRefresh()
      refreshing = false
    }

    // Reset transform
    element.style.transform = 'translateY(0)'
    element.style.transition = 'transform 0.3s ease'
    setTimeout(() => {
      element.style.transition = ''
    }, 300)

    pulling = false
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}

/**
 * Haptic feedback helper
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!('vibrate' in navigator)) return

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 50,
  }

  navigator.vibrate(patterns[type])
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

