/**
 * Performance Optimization Utilities
 * Lazy loading, code splitting, and performance helpers
 */

import { ComponentType, lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

/**
 * Lazy load a component with automatic loading state
 * Usage: const MyComponent = lazyLoad(() => import('./MyComponent'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
) {
  const LazyComponent = lazy(importFunc)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Debounce function for search inputs and expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for scroll events and frequent updates
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Intersection Observer hook for lazy loading images
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof window === 'undefined' || !elementRef.current) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
        observer.disconnect()
      }
    })
  }, options)

  observer.observe(elementRef.current)

  return () => observer.disconnect()
}

/**
 * Optimize images for mobile
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  } = {}
) {
  // If using a CDN or image service, add query parameters
  const { width = 800, quality = 80, format = 'webp' } = options

  // For Next.js Image optimization
  if (url.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
  }

  // For external images, return as-is (implement CDN logic if needed)
  return url
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload critical resources
 */
export function preloadResources(resources: string[]) {
  if (typeof document === 'undefined') return

  resources.forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    
    if (href.endsWith('.js')) {
      link.as = 'script'
    } else if (href.endsWith('.css')) {
      link.as = 'style'
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(href)) {
      link.as = 'image'
    }
    
    link.href = href
    document.head.appendChild(link)
  })
}

/**
 * Measure and log performance
 */
export function measurePerformance(name: string, func: () => void) {
  if (typeof window === 'undefined' || !window.performance) {
    func()
    return
  }

  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = name

  performance.mark(startMark)
  func()
  performance.mark(endMark)
  performance.measure(measureName, startMark, endMark)

  const measure = performance.getEntriesByName(measureName)[0]
  console.log(`${name} took ${measure.duration.toFixed(2)}ms`)

  // Clean up
  performance.clearMarks(startMark)
  performance.clearMarks(endMark)
  performance.clearMeasures(measureName)
}

/**
 * Get device info for optimization
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      pixelRatio: 1,
      connection: 'unknown',
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent)
  const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent) && !isMobile

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pixelRatio: window.devicePixelRatio || 1,
    connection: (navigator as any).connection?.effectiveType || 'unknown',
  }
}

/**
 * Check if user is on slow connection
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const conn = (navigator as any).connection
  return conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'
}

/**
 * Request Idle Callback wrapper
 */
export function runWhenIdle(callback: () => void, options?: IdleRequestOptions) {
  if (typeof window === 'undefined') {
    callback()
    return
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options)
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Virtual scroll helper - only render visible items
 */
export function getVisibleItems<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  buffer: number = 3
): { visibleItems: T[]; startIndex: number; endIndex: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  )

  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
  }
}

