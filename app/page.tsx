import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-dewalt-yellow rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">⚡</span>
              </div>
              <span className="text-xl font-bold text-text-primary">QuickQuote AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Construction estimates <br />
            <span className="text-dewalt-yellow">in minutes, not hours</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            AI-powered estimating platform built for modern contractors. 
            Create professional quotes faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-text-tertiary mt-4">
            No credit card required • Free for 14 days
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-background-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Fast & Accurate</h3>
              <p className="text-sm text-text-secondary">
                Generate professional estimates in minutes with AI-powered suggestions
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">AI-Powered</h3>
              <p className="text-sm text-text-secondary">
                Smart pricing suggestions based on historical data and market trends
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Built for Pros</h3>
              <p className="text-sm text-text-secondary">
                Professional tools designed specifically for construction contractors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-text-tertiary">
            © 2025 QuickQuote AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
