// QuickQuote AI - Main Types Export
// Central location for all TypeScript types

// Database types
export * from './database.types'

// Auth types
export * from './auth'

// =============================================
// APPLICATION-SPECIFIC TYPES
// =============================================

// User interface (simplified for app use)
export interface User {
  id: string
  email: string
  full_name?: string
  company_name?: string
  phone?: string
  avatar_url?: string
}

// Project interface (simplified)
export interface Project {
  id: string
  user_id: string
  project_name: string
  project_type: string
  status: string
  client_name?: string
  client_email?: string
  address?: string
  zip_code: string
  created_at: string
  updated_at: string
}

// Estimate interface (simplified)
export interface Estimate {
  id: string
  project_id: string
  total: number
  status: string
  created_at: string
  updated_at: string
}

// Line item for estimates
export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
  category?: string
}

// =============================================
// STATUS TYPES
// =============================================

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived'
export type ProjectType = 'deck' | 'kitchen' | 'bathroom' | 'flooring' | 'painting' | 'roofing' | 'siding' | 'windows' | 'doors' | 'plumbing' | 'electrical' | 'hvac' | 'custom'
export type EstimateStatus = 'draft' | 'pending' | 'approved' | 'rejected'
