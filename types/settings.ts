// Settings Types

export interface UserProfile {
  id: string
  email: string
  company_name?: string
  phone?: string
  address?: string
  zip_code?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface EstimatorDefaults {
  user_id: string
  default_markup_percentage: number
  default_labor_rate: number
  default_waste_factor: number
  preferred_lumber_brand?: string
  preferred_composite_brand?: string
  preferred_fastener_brand?: string
  preferred_concrete_brand?: string
  created_at: string
  updated_at: string
}

export interface CustomMaterialPrice {
  id: string
  user_id: string
  material_name: string
  category: string
  unit: string
  price: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  user_id: string
  email_estimates: boolean
  email_tips: boolean
  email_updates: boolean
  email_marketing: boolean
  language: 'en' | 'es'
  created_at: string
  updated_at: string
}

export interface UpdateProfileInput {
  company_name?: string
  phone?: string
  address?: string
  zip_code?: string
  avatar_url?: string
}

export interface UpdateDefaultsInput {
  default_markup_percentage?: number
  default_labor_rate?: number
  default_waste_factor?: number
  preferred_lumber_brand?: string
  preferred_composite_brand?: string
  preferred_fastener_brand?: string
  preferred_concrete_brand?: string
}

export interface CreateCustomPriceInput {
  material_name: string
  category: string
  unit: string
  price: number
  notes?: string
}

export interface UpdateCustomPriceInput {
  material_name?: string
  category?: string
  unit?: string
  price?: number
  notes?: string
}

export interface UpdateNotificationPreferencesInput {
  email_estimates?: boolean
  email_tips?: boolean
  email_updates?: boolean
  email_marketing?: boolean
  language?: 'en' | 'es'
}

export type SettingsTab = 'profile' | 'defaults' | 'pricing' | 'billing' | 'account'

