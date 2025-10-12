export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface AIContext {
  projectType?: string
  zipCode?: string
  dimensions?: {
    length?: number
    width?: number
    height?: number
    sqft?: number
  }
  materials?: {
    // Deck materials
    deckingMaterial?: string
    framingMaterial?: string
    railingStyle?: string
    // Kitchen materials
    cabinetStyle?: string
    countertopMaterial?: string
    flooringMaterial?: string
    // Generic
    [key: string]: string | undefined
  }
  budget?: number
}

export interface AISuggestion {
  id: string
  type: 'info' | 'warning' | 'tip' | 'code'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  dismissible: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface AIAssistantConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  enableStream?: boolean
}

export interface AIFeedback {
  messageId: string
  rating: 'up' | 'down'
  comment?: string
  context?: AIContext
  messageContent?: string
}

export interface ChatRequest {
  messages: AIMessage[]
  context: AIContext
  config?: AIAssistantConfig
}

export interface ChatResponse {
  message: AIMessage
  suggestions?: AISuggestion[]
  error?: string
}

