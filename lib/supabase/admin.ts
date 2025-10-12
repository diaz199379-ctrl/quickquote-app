/**
 * Supabase Admin Client (Server-Side Only)
 * 
 * SECURITY WARNING: This client uses the SERVICE ROLE KEY which bypasses RLS.
 * ⚠️  NEVER import this in client-side code!
 * ⚠️  Only use in API routes and server components
 * ⚠️  Always validate user permissions before operations
 * 
 * Use cases:
 * - Admin operations that need to bypass RLS
 * - Bulk operations (e.g., data imports)
 * - System-level tasks (e.g., cleanup jobs)
 * - Service account operations
 */

import { createClient } from '@supabase/supabase-js'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

/**
 * Admin Supabase client with service role privileges
 * Bypasses Row Level Security (RLS)
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
  }
)

/**
 * Type-safe helper to verify this code is running server-side
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

/**
 * Guard function to prevent client-side usage
 */
export function assertServerSide(functionName: string): void {
  if (!isServerSide()) {
    throw new Error(
      `${functionName} can only be called server-side. ` +
      'This function uses the service role key which must never be exposed to the client.'
    )
  }
}

// Example admin operations

/**
 * Get all users (admin only)
 * @returns List of all users
 */
export async function getAllUsers() {
  assertServerSide('getAllUsers')
  
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  
  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
  
  return data.users
}

/**
 * Delete user by ID (admin only)
 * @param userId - UUID of user to delete
 */
export async function deleteUser(userId: string) {
  assertServerSide('deleteUser')
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`)
  }
}

/**
 * Update user metadata (admin only)
 * @param userId - UUID of user
 * @param metadata - Metadata to update
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, any>) {
  assertServerSide('updateUserMetadata')
  
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: metadata
  })
  
  if (error) {
    throw new Error(`Failed to update user metadata: ${error.message}`)
  }
}

/**
 * Bulk insert with bypass RLS (admin only)
 * Use with extreme caution!
 */
export async function bulkInsert<T>(
  table: string,
  data: T[]
): Promise<{ data: T[] | null; error: any }> {
  assertServerSide('bulkInsert')
  
  const { data: result, error } = await supabaseAdmin
    .from(table)
    .insert(data)
    .select()
  
  return { data: result, error }
}

/**
 * Get database stats (admin only)
 */
export async function getDatabaseStats() {
  assertServerSide('getDatabaseStats')
  
  const [profilesCount, projectsCount, estimatesCount] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('projects').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('estimates').select('id', { count: 'exact', head: true }),
  ])
  
  return {
    profiles: profilesCount.count || 0,
    projects: projectsCount.count || 0,
    estimates: estimatesCount.count || 0,
  }
}

