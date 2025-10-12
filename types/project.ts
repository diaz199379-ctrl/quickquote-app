// Project and Estimate Types

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived'
export type EstimateStatus = 'draft' | 'finalized' | 'sent' | 'approved' | 'rejected'
export type ProjectType = 'deck' | 'kitchen' | 'bathroom' | 'addition' | 'remodel' | 'custom'

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  address?: string
  zip_code?: string
  project_type: ProjectType
  status: ProjectStatus
  total_value?: number
  created_at: string
  updated_at: string
  archived_at?: string
  notes?: string
  thumbnail_url?: string
}

export interface Estimate {
  id: string
  user_id: string
  project_id?: string
  name: string
  description?: string
  estimate_data: any // JSON data specific to estimate type
  materials: any[] // Material list
  labor_hours?: number
  labor_rate?: number
  markup_percentage?: number
  subtotal: number
  total: number
  status: EstimateStatus
  created_at: string
  updated_at: string
  finalized_at?: string
  sent_at?: string
  pdf_url?: string
}

export interface ProjectWithEstimates extends Project {
  estimates: Estimate[]
  estimate_count: number
}

export interface CreateProjectInput {
  name: string
  description?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  address?: string
  zip_code?: string
  project_type: ProjectType
  status?: ProjectStatus
  notes?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  address?: string
  zip_code?: string
  project_type?: ProjectType
  status?: ProjectStatus
  notes?: string
  total_value?: number
}

export interface CreateEstimateInput {
  project_id?: string
  name: string
  description?: string
  estimate_data: any
  materials: any[]
  labor_hours?: number
  labor_rate?: number
  markup_percentage?: number
  subtotal: number
  total: number
  status?: EstimateStatus
}

export interface UpdateEstimateInput {
  project_id?: string
  name?: string
  description?: string
  estimate_data?: any
  materials?: any[]
  labor_hours?: number
  labor_rate?: number
  markup_percentage?: number
  subtotal?: number
  total?: number
  status?: EstimateStatus
}

export interface ProjectFilters {
  projectType?: ProjectType
  status?: ProjectStatus
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface EstimateFilters {
  projectId?: string
  status?: EstimateStatus
  dateFrom?: string
  dateTo?: string
  search?: string
}

export type SortOption = 'newest' | 'oldest' | 'name' | 'value'
export type ViewMode = 'grid' | 'list'

