'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Wrench, 
  X, 
  Send, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Loader2
} from 'lucide-react'
import { AIMessage, AIContext } from '@/types/ai'
import { getAIAssistant } from '@/lib/openai/assistant'
import { FeedbackStore } from '@/lib/openai/feedbackStore'
import { cn } from '@/lib/utils/cn'

interface AIAssistantProps {
  context: AIContext
}

export default function AIAssistant({ context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<Map<string, 'up' | 'down'>>(new Map())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const assistant = getAIAssistant()

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await assistant.sendMessage([...messages, userMessage], context)
      setMessages(prev => [...prev, response])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleClear = () => {
    if (confirm('Clear all messages?')) {
      setMessages([])
    }
  }

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleFeedback = async (messageId: string, rating: 'up' | 'down', messageContent: string) => {
    // Save feedback
    await FeedbackStore.saveFeedback({
      messageId,
      rating,
      comment: undefined // Could prompt user for optional comment
    })

    // Update UI to show feedback was given
    setFeedbackGiven(prev => new Map(prev).set(messageId, rating))

    // Get stats for logging
    const stats = FeedbackStore.getFeedbackStats()
    console.log(`✅ Feedback saved! Total: ${stats.total}, Positive: ${stats.positive} (${(stats.ratio * 100).toFixed(1)}%)`)
  }

  const quickQuestions = assistant.getQuickQuestions(context)

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-24 md:bottom-8 right-8 z-40',
          'w-14 h-14 bg-dewalt-yellow rounded-full shadow-lg',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-transform',
          'group',
          isOpen && 'hidden'
        )}
        title="Ask AI Assistant"
      >
        <Wrench className="w-6 h-6 text-dewalt-black group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-orange rounded-full animate-pulse" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <Card className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] md:w-[400px] h-[600px] z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-dewalt-yellow rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-dewalt-black rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-dewalt-yellow" />
                </div>
                <div>
                  <h3 className="font-bold text-dewalt-black">AI Assistant</h3>
                  <p className="text-xs text-dewalt-black/70">Expert construction advice</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 w-8 p-0 hover:bg-dewalt-black/10"
                  >
                    <Trash2 className="w-4 h-4 text-dewalt-black" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-dewalt-black/10"
                >
                  <X className="w-5 h-5 text-dewalt-black" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-dewalt-yellow/10 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="w-8 h-8 text-dewalt-yellow" />
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Ask me anything!</h4>
                  <p className="text-sm text-text-secondary mb-4 max-w-xs">
                    I can help with building codes, material selection, best practices, and more.
                  </p>
                  
                  {/* Quick Questions */}
                  {quickQuestions.length > 0 && (
                    <div className="w-full space-y-2">
                      <p className="text-xs text-text-tertiary uppercase tracking-wide mb-2">Try asking:</p>
                      {quickQuestions.slice(0, 3).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:border-dewalt-yellow hover:bg-dewalt-yellow/5 transition-all text-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg p-3',
                          message.role === 'user'
                            ? 'bg-text-primary text-white'
                            : 'bg-dewalt-yellow/10 border border-dewalt-yellow/30 text-text-primary'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Assistant Message Actions */}
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-light">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="text-xs text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
                              title="Copy"
                            >
                              <Copy className="w-3 h-3" />
                              {copiedId === message.id ? 'Copied!' : ''}
                            </button>
                            <div className="flex-1" />
                            
                            {/* Feedback given indicator */}
                            {feedbackGiven.has(message.id) && (
                              <span className="text-xs text-text-tertiary italic">
                                Thanks for feedback!
                              </span>
                            )}
                            
                            {/* Thumbs up */}
                            <button
                              onClick={() => handleFeedback(message.id, 'up', message.content)}
                              disabled={feedbackGiven.has(message.id)}
                              className={cn(
                                'transition-all',
                                feedbackGiven.get(message.id) === 'up'
                                  ? 'text-status-success scale-110'
                                  : 'text-text-tertiary hover:text-status-success hover:scale-110',
                                feedbackGiven.has(message.id) && feedbackGiven.get(message.id) !== 'up' && 'opacity-30'
                              )}
                              title={feedbackGiven.get(message.id) === 'up' ? 'You liked this' : 'Helpful'}
                            >
                              <ThumbsUp className={cn(
                                'w-3 h-3',
                                feedbackGiven.get(message.id) === 'up' && 'fill-current'
                              )} />
                            </button>
                            
                            {/* Thumbs down */}
                            <button
                              onClick={() => handleFeedback(message.id, 'down', message.content)}
                              disabled={feedbackGiven.has(message.id)}
                              className={cn(
                                'transition-all',
                                feedbackGiven.get(message.id) === 'down'
                                  ? 'text-status-error scale-110'
                                  : 'text-text-tertiary hover:text-status-error hover:scale-110',
                                feedbackGiven.has(message.id) && feedbackGiven.get(message.id) !== 'down' && 'opacity-30'
                              )}
                              title={feedbackGiven.get(message.id) === 'down' ? 'You disliked this' : 'Not helpful'}
                            >
                              <ThumbsDown className={cn(
                                'w-3 h-3',
                                feedbackGiven.get(message.id) === 'down' && 'fill-current'
                              )} />
                            </button>
                          </div>
                        )}
                        
                        <p className="text-xs text-text-tertiary mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-dewalt-yellow/10 border border-dewalt-yellow/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-dewalt-yellow" />
                          <span className="text-sm text-text-secondary">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about codes, materials, best practices..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-text-tertiary mt-2">
                AI advice • Always verify with local building officials
              </p>
            </div>
          </Card>
        </>
      )}
    </>
  )
}

