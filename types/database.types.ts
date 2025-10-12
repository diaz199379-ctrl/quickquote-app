// QuickQuote AI Database Types
// Auto-generated from Supabase schema
// Do not edit manually

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// =============================================
// ENUMS
// =============================================

export type ProjectType =
  | 'deck'
  | 'kitchen'
  | 'bathroom'
  | 'flooring'
  | 'painting'
  | 'roofing'
  | 'siding'
  | 'windows'
  | 'doors'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'custom'

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type PriceSource = 'openai' | 'user' | 'supplier' | 'manual'

// =============================================
// DATABASE TYPES
// =============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          default_markup: number
          default_labor_rate: number
          zip_code: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          default_markup?: number
          default_labor_rate?: number
          zip_code?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          default_markup?: number
          default_labor_rate?: number
          zip_code?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          project_name: string
          project_type: ProjectType
          status: ProjectStatus
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string
          description: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_name: string
          project_type?: ProjectType
          status?: ProjectStatus
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_name?: string
          project_type?: ProjectType
          status?: ProjectStatus
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      estimates: {
        Row: {
          id: string
          project_id: string
          estimate_name: string
          version: number
          dimensions: Json
          materials: Json
          labor_hours: number | null
          labor_rate: number
          labor_total: number | null // computed
          markup_percentage: number
          materials_subtotal: number
          subtotal: number | null // computed
          markup_amount: number | null // computed
          total: number | null // computed
          notes: string | null
          internal_notes: string | null
          price_date: string
          is_approved: boolean
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          estimate_name?: string
          version?: number
          dimensions?: Json
          materials?: Json
          labor_hours?: number | null
          labor_rate: number
          markup_percentage?: number
          materials_subtotal?: number
          notes?: string | null
          internal_notes?: string | null
          price_date?: string
          is_approved?: boolean
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          estimate_name?: string
          version?: number
          dimensions?: Json
          materials?: Json
          labor_hours?: number | null
          labor_rate?: number
          markup_percentage?: number
          materials_subtotal?: number
          notes?: string | null
          internal_notes?: string | null
          price_date?: string
          is_approved?: boolean
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      material_prices: {
        Row: {
          id: string
          material_name: string
          material_category: string
          material_sku: string | null
          unit: string
          price: number
          zip_code: string
          source: PriceSource
          confidence: ConfidenceLevel
          supplier_name: string | null
          fetched_at: string
          expires_at: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          material_name: string
          material_category: string
          material_sku?: string | null
          unit: string
          price: number
          zip_code: string
          source?: PriceSource
          confidence?: ConfidenceLevel
          supplier_name?: string | null
          fetched_at?: string
          expires_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          material_name?: string
          material_category?: string
          material_sku?: string | null
          unit?: string
          price?: number
          zip_code?: string
          source?: PriceSource
          confidence?: ConfidenceLevel
          supplier_name?: string | null
          fetched_at?: string
          expires_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_material_overrides: {
        Row: {
          id: string
          user_id: string
          material_name: string
          material_category: string | null
          custom_price: number
          unit: string
          notes: string | null
          supplier_name: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          material_name: string
          material_category?: string | null
          custom_price: number
          unit: string
          notes?: string | null
          supplier_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          material_name?: string
          material_category?: string | null
          custom_price?: number
          unit?: string
          notes?: string | null
          supplier_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      estimate_history: {
        Row: {
          id: string
          estimate_id: string
          user_id: string
          action: string
          changes: Json
          total_before: number | null
          total_after: number | null
          created_at: string
        }
        Insert: {
          id?: string
          estimate_id: string
          user_id: string
          action: string
          changes?: Json
          total_before?: number | null
          total_after?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          estimate_id?: string
          user_id?: string
          action?: string
          changes?: Json
          total_before?: number | null
          total_after?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_project: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      user_owns_estimate: {
        Args: { estimate_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      project_type: ProjectType
      project_status: ProjectStatus
      confidence_level: ConfidenceLevel
      price_source: PriceSource
    }
  }
}

// =============================================
// HELPER TYPES FOR APPLICATION USE
// =============================================

// Table row types (for querying)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Estimate = Database['public']['Tables']['estimates']['Row']
export type MaterialPrice = Database['public']['Tables']['material_prices']['Row']
export type UserMaterialOverride = Database['public']['Tables']['user_material_overrides']['Row']
export type EstimateHistory = Database['public']['Tables']['estimate_history']['Row']

// Insert types (for creating records)
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type EstimateInsert = Database['public']['Tables']['estimates']['Insert']
export type MaterialPriceInsert = Database['public']['Tables']['material_prices']['Insert']
export type UserMaterialOverrideInsert = Database['public']['Tables']['user_material_overrides']['Insert']
export type EstimateHistoryInsert = Database['public']['Tables']['estimate_history']['Insert']

// Update types (for updating records)
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type EstimateUpdate = Database['public']['Tables']['estimates']['Update']
export type MaterialPriceUpdate = Database['public']['Tables']['material_prices']['Update']
export type UserMaterialOverrideUpdate = Database['public']['Tables']['user_material_overrides']['Update']
export type EstimateHistoryUpdate = Database['public']['Tables']['estimate_history']['Update']

// =============================================
// MATERIAL STRUCTURES
// =============================================

export interface MaterialItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  notes?: string
  sku?: string
}

export interface ProjectDimensions {
  // Common dimensions (all projects)
  length?: number
  width?: number
  height?: number
  area?: number // square feet
  
  // Deck-specific
  deck_length?: number
  deck_width?: number
  deck_height?: number
  railing_length?: number
  stair_count?: number
  
  // Kitchen/Bathroom-specific
  cabinet_linear_feet?: number
  countertop_sqft?: number
  backsplash_sqft?: number
  flooring_sqft?: number
  
  // Flooring-specific
  room_count?: number
  total_sqft?: number
  
  // Painting-specific
  wall_area?: number
  ceiling_area?: number
  trim_length?: number
  coats?: number
  
  // Custom dimensions
  [key: string]: number | string | undefined
}

// =============================================
// QUERY RESULT TYPES
// =============================================

export interface ProjectWithEstimates extends Project {
  estimates: Estimate[]
}

export interface EstimateWithProject extends Estimate {
  project: Project
}

export interface ProfileWithProjects extends Profile {
  projects: Project[]
}
