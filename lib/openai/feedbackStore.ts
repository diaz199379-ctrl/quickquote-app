import { AIFeedback } from '@/types/ai'

// In a real app, this would save to Supabase
// For now, we'll use localStorage and console logging

export class FeedbackStore {
  private static STORAGE_KEY = 'ai_feedback'

  static async saveFeedback(feedback: AIFeedback): Promise<void> {
    try {
      // Get existing feedback
      const existing = this.getAllFeedback()
      
      // Add new feedback
      existing.push({
        ...feedback,
        timestamp: new Date().toISOString()
      })

      // Save to localStorage (in production, save to Supabase)
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing))
      }

      // Log for analytics
      console.log('📊 AI Feedback Received:', feedback)

      // In production, send to Supabase:
      /*
      const { data, error } = await supabase
        .from('ai_feedback')
        .insert({
          message_id: feedback.messageId,
          rating: feedback.rating,
          comment: feedback.comment,
          user_id: userId, // from auth
          context: feedback.context
        })
      */

      // Could also send to analytics service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ai_feedback', {
          event_category: 'AI Assistant',
          event_label: feedback.rating,
          value: feedback.rating === 'up' ? 1 : -1
        })
      }
    } catch (error) {
      console.error('Error saving feedback:', error)
    }
  }

  static getAllFeedback(): any[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getFeedbackStats(): { total: number; positive: number; negative: number; ratio: number } {
    const feedback = this.getAllFeedback()
    const positive = feedback.filter((f: any) => f.rating === 'up').length
    const negative = feedback.filter((f: any) => f.rating === 'down').length
    
    return {
      total: feedback.length,
      positive,
      negative,
      ratio: feedback.length > 0 ? positive / feedback.length : 0
    }
  }

  static clearFeedback(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }
}

