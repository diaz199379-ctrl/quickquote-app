'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatsCard from '@/components/dashboard/StatsCard'
import OnboardingManager from '@/components/onboarding/OnboardingManager'
import { 
  DollarSign, 
  FolderKanban, 
  TrendingUp, 
  Award,
  Home,
  Utensils,
  Bath,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export default function DashboardPage() {
  const { t } = useI18n()
  
  // In a real app, fetch this data from Supabase
  const stats = [
    {
      title: t('dashboard.stats.estimatesThisMonth'),
      value: '24',
      icon: DollarSign,
      trend: { value: 12, isPositive: true },
      subtitle: t('dashboard.stats.vsLastMonth')
    },
    {
      title: t('dashboard.stats.activeProjects'),
      value: '8',
      icon: FolderKanban,
      subtitle: t('dashboard.stats.dueThisWeek', { count: 3 })
    },
    {
      title: t('dashboard.stats.avgEstimateValue'),
      value: '$42,500',
      icon: TrendingUp,
      trend: { value: 8.3, isPositive: true },
      subtitle: t('dashboard.stats.vsLastMonth')
    },
    {
      title: t('dashboard.stats.winRate'),
      value: '67%',
      icon: Award,
      trend: { value: 5, isPositive: true },
      subtitle: t('dashboard.stats.ofSubmittedBids')
    },
  ]

  const recentEstimates = [
    { id: 1, project: 'Kitchen Remodel - Smith Residence', value: 45000, status: 'approved', date: '2025-10-10' },
    { id: 2, project: 'Deck Construction - Johnson Home', value: 18500, status: 'pending', date: '2025-10-09' },
    { id: 3, project: 'Bathroom Renovation - Davis Property', value: 12000, status: 'approved', date: '2025-10-08' },
    { id: 4, project: 'Home Addition - Martinez Residence', value: 125000, status: 'pending', date: '2025-10-07' },
    { id: 5, project: 'Fence Installation - Brown Home', value: 8500, status: 'approved', date: '2025-10-06' },
  ]

  const quickActions = [
    { title: t('dashboard.quickActions.deckEstimate'), icon: Home, description: t('dashboard.quickActions.deckDescription'), href: '/estimator/deck' },
    { title: t('dashboard.quickActions.kitchenEstimate'), icon: Utensils, description: t('dashboard.quickActions.kitchenDescription'), href: '/estimator/kitchen' },
    { title: t('dashboard.quickActions.bathroomEstimate'), icon: Bath, description: t('dashboard.quickActions.bathroomDescription'), href: '/estimator/bathroom' },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: t('dashboard.status.approved'), className: 'badge-success' }
      case 'pending':
        return { label: t('dashboard.status.pending'), className: 'badge-warning' }
      default:
        return { label: status, className: 'badge' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-dewalt-yellow/10 to-transparent p-6 rounded-xl border border-dewalt-yellow/20">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('dashboard.welcome')} 👋
        </h1>
        <p className="text-text-secondary">
          {t('dashboard.welcomeMessage', { estimates: 3, projects: 2 })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('dashboard.quickActions.title')}</CardTitle>
          <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="p-4 h-full hover:shadow-card-hover hover:border-dewalt-yellow/30 transition-all cursor-pointer active:scale-[0.99]">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-dewalt-yellow rounded-lg flex items-center justify-center">
                      <action.icon className="w-6 h-6 text-dewalt-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{action.title}</h3>
                      <p className="text-xs text-text-tertiary mt-1">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Estimates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{t('dashboard.recentEstimates.title')}</CardTitle>
            <CardDescription>{t('dashboard.recentEstimates.description')}</CardDescription>
          </div>
          <Link href="/estimates">
            <Button variant="ghost" size="sm">
              {t('dashboard.recentEstimates.viewAll')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEstimates.map((estimate) => {
              const statusConfig = getStatusConfig(estimate.status)
              return (
                <div
                  key={estimate.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border-light hover:border-border hover:bg-background-secondary transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary truncate">{estimate.project}</h4>
                    <p className="text-sm text-text-tertiary mt-1">{estimate.date}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="font-bold text-text-primary">${estimate.value.toLocaleString()}</p>
                      <span className={`badge ${statusConfig.className} text-xs`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    {estimate.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-status-warning flex-shrink-0" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started (for new users) */}
      <Card className="bg-background-secondary border-border-light">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('dashboard.gettingStarted.title')}</CardTitle>
          <CardDescription>{t('dashboard.gettingStarted.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border">
              <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{t('dashboard.gettingStarted.step1')}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{t('dashboard.gettingStarted.completed')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border">
              <div className="w-8 h-8 bg-status-success rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{t('dashboard.gettingStarted.step2')}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{t('dashboard.gettingStarted.completed')}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-dewalt-yellow/30">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-dewalt-yellow rounded-full flex items-center justify-center flex-shrink-0 font-bold text-dewalt-black text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-text-primary">{t('dashboard.gettingStarted.step3')}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{t('dashboard.gettingStarted.step3Description')}</p>
                </div>
              </div>
              <Link href="/settings">
                <Button size="sm" variant="secondary">
                  {t('dashboard.gettingStarted.setUp')}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding */}
      <OnboardingManager />
    </div>
  )
}
