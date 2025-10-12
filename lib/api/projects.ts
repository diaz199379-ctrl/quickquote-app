import { createClient } from '@/lib/supabase/client'
import {
  Project,
  Estimate,
  ProjectWithEstimates,
  CreateProjectInput,
  UpdateProjectInput,
  CreateEstimateInput,
  UpdateEstimateInput,
  ProjectFilters,
  EstimateFilters,
  SortOption,
} from '@/types/project'

const supabase = createClient()

// ============================================
// PROJECT API
// ============================================

/**
 * Get all projects for the current user with optional filters
 */
export async function getProjects(
  filters?: ProjectFilters,
  sort: SortOption = 'newest',
  limit?: number,
  offset?: number
): Promise<{ data: Project[] | null; error: any }> {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .eq('archived_at', null) // Don't show archived by default

    // Apply filters
    if (filters?.projectType) {
      query = query.eq('project_type', filters.projectType)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'value':
        query = query.order('total_value', { ascending: false, nullsFirst: false })
        break
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit)
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { data: null, error }
  }
}

/**
 * Get a single project by ID with all its estimates
 */
export async function getProjectById(
  projectId: string
): Promise<{ data: ProjectWithEstimates | null; error: any }> {
  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError) {
      return { data: null, error: projectError }
    }

    const { data: estimates, error: estimatesError } = await supabase
      .from('estimates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (estimatesError) {
      console.error('Error fetching estimates:', estimatesError)
    }

    const projectWithEstimates: ProjectWithEstimates = {
      ...project,
      estimates: estimates || [],
      estimate_count: estimates?.length || 0,
    }

    return { data: projectWithEstimates, error: null }
  } catch (error) {
    console.error('Error fetching project:', error)
    return { data: null, error }
  }
}

/**
 * Create a new project
 */
export async function createProject(
  input: CreateProjectInput
): Promise<{ data: Project | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...input,
        status: input.status || 'draft',
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error creating project:', error)
    return { data: null, error }
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<{ data: Project | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error updating project:', error)
    return { data: null, error }
  }
}

/**
 * Archive a project (soft delete)
 */
export async function archiveProject(
  projectId: string
): Promise<{ data: Project | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error archiving project:', error)
    return { data: null, error }
  }
}

/**
 * Delete a project permanently
 */
export async function deleteProject(projectId: string): Promise<{ error: any }> {
  try {
    // First delete all estimates for this project
    await supabase.from('estimates').delete().eq('project_id', projectId)

    // Then delete the project
    const { error } = await supabase.from('projects').delete().eq('id', projectId)

    return { error }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { error }
  }
}

/**
 * Duplicate a project
 */
export async function duplicateProject(
  projectId: string,
  newName?: string
): Promise<{ data: Project | null; error: any }> {
  try {
    const { data: originalProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (fetchError || !originalProject) {
      return { data: null, error: fetchError }
    }

    const { id, created_at, updated_at, archived_at, ...projectData } = originalProject

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        name: newName || `${originalProject.name} (Copy)`,
        status: 'draft',
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error duplicating project:', error)
    return { data: null, error }
  }
}

// ============================================
// ESTIMATE API
// ============================================

/**
 * Get all estimates for the current user with optional filters
 */
export async function getEstimates(
  filters?: EstimateFilters,
  sort: SortOption = 'newest',
  limit?: number,
  offset?: number
): Promise<{ data: Estimate[] | null; error: any }> {
  try {
    let query = supabase.from('estimates').select('*')

    // Apply filters
    if (filters?.projectId) {
      query = query.eq('project_id', filters.projectId)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'value':
        query = query.order('total', { ascending: false })
        break
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit)
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error } = await query

    return { data, error }
  } catch (error) {
    console.error('Error fetching estimates:', error)
    return { data: null, error }
  }
}

/**
 * Get a single estimate by ID
 */
export async function getEstimateById(
  estimateId: string
): Promise<{ data: Estimate | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error fetching estimate:', error)
    return { data: null, error }
  }
}

/**
 * Create a new estimate
 */
export async function createEstimate(
  input: CreateEstimateInput
): Promise<{ data: Estimate | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .insert({
        ...input,
        status: input.status || 'draft',
      })
      .select()
      .single()

    // Update project total_value if estimate is linked to a project
    if (data && input.project_id) {
      await updateProjectTotalValue(input.project_id)
    }

    return { data, error }
  } catch (error) {
    console.error('Error creating estimate:', error)
    return { data: null, error }
  }
}

/**
 * Update an existing estimate
 */
export async function updateEstimate(
  estimateId: string,
  input: UpdateEstimateInput
): Promise<{ data: Estimate | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', estimateId)
      .select()
      .single()

    // Update project total_value if estimate is linked to a project
    if (data && data.project_id) {
      await updateProjectTotalValue(data.project_id)
    }

    return { data, error }
  } catch (error) {
    console.error('Error updating estimate:', error)
    return { data: null, error }
  }
}

/**
 * Delete an estimate permanently
 */
export async function deleteEstimate(estimateId: string): Promise<{ error: any }> {
  try {
    // Get the estimate to find the project_id
    const { data: estimate } = await supabase
      .from('estimates')
      .select('project_id')
      .eq('id', estimateId)
      .single()

    const { error } = await supabase.from('estimates').delete().eq('id', estimateId)

    // Update project total_value if estimate was linked to a project
    if (!error && estimate?.project_id) {
      await updateProjectTotalValue(estimate.project_id)
    }

    return { error }
  } catch (error) {
    console.error('Error deleting estimate:', error)
    return { error }
  }
}

/**
 * Duplicate an estimate
 */
export async function duplicateEstimate(
  estimateId: string,
  newName?: string
): Promise<{ data: Estimate | null; error: any }> {
  try {
    const { data: originalEstimate, error: fetchError } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single()

    if (fetchError || !originalEstimate) {
      return { data: null, error: fetchError }
    }

    const { id, created_at, updated_at, finalized_at, sent_at, pdf_url, ...estimateData } =
      originalEstimate

    const { data, error } = await supabase
      .from('estimates')
      .insert({
        ...estimateData,
        name: newName || `${originalEstimate.name} (Copy)`,
        status: 'draft',
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error duplicating estimate:', error)
    return { data: null, error }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Update project total value based on all its estimates
 */
async function updateProjectTotalValue(projectId: string): Promise<void> {
  try {
    const { data: estimates } = await supabase
      .from('estimates')
      .select('total')
      .eq('project_id', projectId)

    const totalValue = estimates?.reduce((sum, est) => sum + (est.total || 0), 0) || 0

    await supabase
      .from('projects')
      .update({ total_value: totalValue, updated_at: new Date().toISOString() })
      .eq('id', projectId)
  } catch (error) {
    console.error('Error updating project total value:', error)
  }
}

/**
 * Get recently viewed projects (stored in localStorage)
 */
export function getRecentlyViewedProjects(): string[] {
  if (typeof window === 'undefined') return []
  const recent = localStorage.getItem('recentlyViewedProjects')
  return recent ? JSON.parse(recent) : []
}

/**
 * Add a project to recently viewed
 */
export function addToRecentlyViewed(projectId: string): void {
  if (typeof window === 'undefined') return
  const recent = getRecentlyViewedProjects()
  const updated = [projectId, ...recent.filter((id) => id !== projectId)].slice(0, 10)
  localStorage.setItem('recentlyViewedProjects', JSON.stringify(updated))
}

