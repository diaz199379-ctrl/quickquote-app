import { createClient } from './client'
import type { 
  LoginCredentials, 
  SignupCredentials, 
  PasswordResetRequest,
  AuthResponse 
} from '@/types/auth'

/**
 * Sign in with email and password
 */
export async function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.status?.toString(),
        },
      }
    }

    return {
      data: data.session,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

/**
 * Sign up new user
 */
export async function signUp(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          company_name: credentials.companyName,
          phone: credentials.phone,
        },
      },
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.status?.toString(),
        },
      }
    }

    return {
      data: data.session,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
        },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(
  request: PasswordResetRequest
): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
        },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
        },
      }
    }

    return {
      data: user,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || 'An unexpected error occurred',
      },
    }
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    }
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    }
  }

  return { valid: true }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address',
    }
  }

  return { valid: true }
}

