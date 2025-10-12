import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

// Extended User type with app-specific fields
export interface User extends Omit<SupabaseUser, 'user_metadata'> {
  user_metadata: {
    full_name?: string
    company_name?: string
    phone?: string
    avatar_url?: string
  }
}

// Auth session type
export interface AuthSession extends Session {
  user: User
}

// Auth error types
export interface AuthError {
  message: string
  status?: number
  code?: string
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// Signup credentials
export interface SignupCredentials {
  email: string
  password: string
  confirmPassword?: string
  fullName?: string
  companyName?: string
  phone?: string
}

// Password reset request
export interface PasswordResetRequest {
  email: string
}

// Auth state
export interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: AuthError | null
}

// Form validation errors
export interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  fullName?: string
  companyName?: string
  phone?: string
  general?: string
}

// Auth response
export interface AuthResponse<T = any> {
  data: T | null
  error: AuthError | null
}

