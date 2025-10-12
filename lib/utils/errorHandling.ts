/**
 * Error Handling Utilities
 * Converts technical errors into user-friendly messages
 */

export interface UserFriendlyError {
  title: string
  message: string
  suggestion?: string
  canRetry: boolean
}

/**
 * Handle Supabase authentication errors
 */
export function handleAuthError(error: any): UserFriendlyError {
  const errorMessage = error?.message?.toLowerCase() || ''
  const errorCode = error?.code || error?.status

  // Invalid credentials
  if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
    return {
      title: 'Invalid Credentials',
      message: 'The email or password you entered is incorrect.',
      suggestion: 'Please check your credentials and try again.',
      canRetry: true,
    }
  }

  // Email already in use
  if (errorMessage.includes('already') || errorMessage.includes('duplicate')) {
    return {
      title: 'Email Already Registered',
      message: 'An account with this email already exists.',
      suggestion: 'Try logging in instead, or use a different email address.',
      canRetry: false,
    }
  }

  // Session expired
  if (errorMessage.includes('session') || errorMessage.includes('expired')) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired for security reasons.',
      suggestion: 'Please sign in again to continue.',
      canRetry: false,
    }
  }

  // Too many requests
  if (errorCode === 429 || errorMessage.includes('rate limit')) {
    return {
      title: 'Too Many Attempts',
      message: 'You\'ve made too many requests in a short time.',
      suggestion: 'Please wait a few minutes and try again.',
      canRetry: true,
    }
  }

  // Network error
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      title: 'Connection Problem',
      message: 'Unable to connect to the server.',
      suggestion: 'Check your internet connection and try again.',
      canRetry: true,
    }
  }

  // Generic auth error
  return {
    title: 'Authentication Error',
    message: 'We couldn\'t complete that action.',
    suggestion: 'Please try again or contact support if the problem persists.',
    canRetry: true,
  }
}

/**
 * Handle OpenAI API errors
 */
export function handleAIError(error: any): UserFriendlyError {
  const errorMessage = error?.message?.toLowerCase() || ''
  const errorCode = error?.code || error?.status

  // Rate limit
  if (errorCode === 429 || errorMessage.includes('rate limit')) {
    return {
      title: 'AI Service Busy',
      message: 'Our AI assistant is experiencing high demand right now.',
      suggestion: 'Please wait a moment and try again.',
      canRetry: true,
    }
  }

  // API key issues
  if (errorCode === 401 || errorMessage.includes('api key')) {
    return {
      title: 'Configuration Error',
      message: 'There\'s an issue with the AI service configuration.',
      suggestion: 'Please contact support for assistance.',
      canRetry: false,
    }
  }

  // Timeout
  if (errorMessage.includes('timeout')) {
    return {
      title: 'Request Timed Out',
      message: 'The AI took too long to respond.',
      suggestion: 'Try again with a simpler request.',
      canRetry: true,
    }
  }

  // Context too long
  if (errorMessage.includes('context') || errorMessage.includes('token')) {
    return {
      title: 'Request Too Complex',
      message: 'Your request is too detailed for the AI to process.',
      suggestion: 'Try breaking it down into smaller parts.',
      canRetry: false,
    }
  }

  // Generic AI error
  return {
    title: 'AI Service Error',
    message: 'We couldn\'t get a response from the AI assistant.',
    suggestion: 'Please try again in a moment.',
    canRetry: true,
  }
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: any): UserFriendlyError {
  const errorMessage = error?.message?.toLowerCase() || ''

  // Offline
  if (!navigator.onLine || errorMessage.includes('offline')) {
    return {
      title: 'No Internet Connection',
      message: 'You appear to be offline.',
      suggestion: 'Check your internet connection and try again.',
      canRetry: true,
    }
  }

  // Timeout
  if (errorMessage.includes('timeout')) {
    return {
      title: 'Request Timed Out',
      message: 'The server took too long to respond.',
      suggestion: 'Please try again.',
      canRetry: true,
    }
  }

  // CORS or blocked
  if (errorMessage.includes('cors') || errorMessage.includes('blocked')) {
    return {
      title: 'Access Blocked',
      message: 'Your request was blocked for security reasons.',
      suggestion: 'Please contact support if this continues.',
      canRetry: false,
    }
  }

  // Generic network error
  return {
    title: 'Network Error',
    message: 'Unable to reach the server.',
    suggestion: 'Check your connection and try again.',
    canRetry: true,
  }
}

/**
 * Handle validation errors
 */
export function handleValidationError(field: string, rule: string): UserFriendlyError {
  const validationMessages: Record<string, string> = {
    required: `${field} is required`,
    email: 'Please enter a valid email address',
    minLength: `${field} is too short`,
    maxLength: `${field} is too long`,
    pattern: `${field} format is invalid`,
    min: `${field} value is too low`,
    max: `${field} value is too high`,
  }

  return {
    title: 'Invalid Input',
    message: validationMessages[rule] || `${field} is invalid`,
    suggestion: 'Please check your input and try again.',
    canRetry: true,
  }
}

/**
 * Handle Supabase database errors
 */
export function handleDatabaseError(error: any): UserFriendlyError {
  const errorMessage = error?.message?.toLowerCase() || ''
  const errorCode = error?.code

  // Foreign key constraint
  if (errorCode === '23503' || errorMessage.includes('foreign key')) {
    return {
      title: 'Cannot Delete',
      message: 'This item is linked to other data and cannot be deleted.',
      suggestion: 'Remove related items first, or contact support.',
      canRetry: false,
    }
  }

  // Unique constraint
  if (errorCode === '23505' || errorMessage.includes('unique')) {
    return {
      title: 'Duplicate Entry',
      message: 'An item with this information already exists.',
      suggestion: 'Try using different values.',
      canRetry: false,
    }
  }

  // Permission denied
  if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
    return {
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action.',
      suggestion: 'Contact your administrator if you need access.',
      canRetry: false,
    }
  }

  // Generic database error
  return {
    title: 'Database Error',
    message: 'We couldn\'t save your changes.',
    suggestion: 'Please try again or contact support if the problem persists.',
    canRetry: true,
  }
}

/**
 * Handle general errors with a fallback
 */
export function handleGenericError(error: any): UserFriendlyError {
  // Try to extract useful information
  const errorMessage = error?.message || error?.toString() || 'Unknown error'

  // Check for common error patterns
  if (errorMessage.toLowerCase().includes('network')) {
    return handleNetworkError(error)
  }

  if (errorMessage.toLowerCase().includes('auth')) {
    return handleAuthError(error)
  }

  // Fallback
  return {
    title: 'Something Went Wrong',
    message: 'We encountered an unexpected error.',
    suggestion: 'Please try again. If the problem persists, contact support.',
    canRetry: true,
  }
}

/**
 * Get a simple error message for display
 */
export function getErrorMessage(error: any): string {
  const friendlyError = handleGenericError(error)
  return friendlyError.message
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const friendlyError = handleGenericError(error)
  return friendlyError.canRetry
}

