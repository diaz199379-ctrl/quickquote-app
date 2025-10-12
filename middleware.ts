/**
 * Next.js Middleware - Route Protection & Session Management
 * 
 * This middleware:
 * 1. Refreshes Supabase auth sessions on every request
 * 2. Protects dashboard routes (requires authentication)
 * 3. Redirects authenticated users away from auth pages
 * 4. Handles session cookies securely
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get current user session
  const { data: { user }, error } = await supabase.auth.getUser()

  // Get current path
  const path = request.nextUrl.pathname

  // Define protected routes (require authentication)
  const protectedRoutes = [
    '/dashboard',
    '/estimator',
    '/estimates',
    '/projects',
    '/settings',
  ]

  // Define auth routes (redirect if already authenticated)
  const authRoutes = ['/login', '/signup', '/reset-password']

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Redirect logic
  if (isProtectedRoute && !user) {
    // User is not authenticated, redirect to login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', path)
    console.log(`🔒 Protected route accessed without auth: ${path} → /login`)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // User is authenticated, redirect to dashboard
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    console.log(`✅ Auth route accessed with session: ${path} → /dashboard`)
    return NextResponse.redirect(redirectUrl)
  }

  // Log authentication status (helpful for debugging)
  if (process.env.NODE_ENV === 'development') {
    const authStatus = user ? `✅ Authenticated: ${user.email}` : '❌ Not authenticated'
    console.log(`[Middleware] ${path} | ${authStatus}`)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
