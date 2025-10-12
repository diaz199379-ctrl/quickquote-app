'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  Info, 
  Lightbulb, 
  FileText, 
  X,
  Sparkles
} from 'lucide-react'
import { AISuggestion, AIContext } from '@/types/ai'
import { getAIAssistant } from '@/lib/openai/assistant'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface AISuggestionsProps {
  context: AIContext
  onDismiss?: (suggestionId: string) => void
}

export default function AISuggestions({ context, onDismiss }: AISuggestionsProps) {
  const { t } = useI18n()
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const assistant = getAIAssistant()

  useEffect(() => {
    // Generate suggestions based on current context
    const generated = assistant.generateSuggestions(context)
    setSuggestions(generated)
  }, [context, assistant])

  const handleDismiss = (suggestionId: string) => {
    setDismissed(prev => new Set(prev).add(suggestionId))
    onDismiss?.(suggestionId)
  }

  const getIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'tip':
        return <Lightbulb className="w-5 h-5" />
      case 'code':
        return <FileText className="w-5 h-5" />
      case 'info':
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: AISuggestion['type'], priority: AISuggestion['priority']) => {
    const base = 'border-l-4 transition-all hover:shadow-md'
    
    switch (type) {
      case 'warning':
        return cn(
          base,
          'bg-status-warning/10 border-status-warning',
          priority === 'high' && 'ring-2 ring-status-warning/20'
        )
      case 'code':
        return cn(
          base,
          'bg-accent-orange/10 border-accent-orange',
          priority === 'high' && 'ring-2 ring-accent-orange/20'
        )
      case 'tip':
        return cn(
          base,
          'bg-dewalt-yellow/10 border-dewalt-yellow'
        )
      case 'info':
      default:
        return cn(
          base,
          'bg-status-info/10 border-status-info'
        )
    }
  }

  const getTextColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'text-status-warning'
      case 'code':
        return 'text-accent-orange'
      case 'tip':
        return 'text-dewalt-yellow'
      case 'info':
      default:
        return 'text-status-info'
    }
  }

  // Filter out dismissed suggestions
  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id))

  if (visibleSuggestions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-dewalt-yellow" />
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
          {t('ai.noticed', { fallback: 'AI Noticed' })}
        </h3>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {visibleSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className={cn('p-4', getStyles(suggestion.type, suggestion.priority))}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn('flex-shrink-0 mt-0.5', getTextColor(suggestion.type))}>
                {getIcon(suggestion.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-text-primary text-sm">
                    {suggestion.title}
                  </h4>
                  {suggestion.dismissible && (
                    <button
                      onClick={() => handleDismiss(suggestion.id)}
                      className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
                      title={t('header.notifications.dismiss')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-text-secondary leading-relaxed">
                  {suggestion.message}
                </p>

                {/* Action Button */}
                {suggestion.action && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={suggestion.action.onClick}
                    className="mt-3"
                  >
                    {suggestion.action.label}
                  </Button>
                )}

                {/* Priority Badge */}
                {suggestion.priority === 'high' && !suggestion.dismissible && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-status-error">
                    <AlertCircle className="w-3 h-3" />
                    <span>{t('ai.important', { fallback: 'Important' })}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Disclaimer for code-related suggestions */}
      {visibleSuggestions.some(s => s.type === 'code') && (
        <p className="text-xs text-text-tertiary italic">
          {t('ai.codeDisclaimer', { fallback: '* Code requirements may vary by location. Always verify with your local building department.' })}
        </p>
      )}
    </div>
  )
}

