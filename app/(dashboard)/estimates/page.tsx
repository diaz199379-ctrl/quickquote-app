'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  Search,
  Filter,
  Grid3x3,
  List,
  X,
  CheckCircle,
  Clock,
  Send,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import EstimateCard from '@/components/projects/EstimateCard'
import { getEstimates, duplicateEstimate, deleteEstimate } from '@/lib/api/projects'
import { Estimate, EstimateStatus, SortOption, ViewMode } from '@/types/project'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

export default function EstimatesPage() {
  const router = useRouter()
  const { t } = useI18n()

  const STATUS_OPTIONS: { value: EstimateStatus; label: string; icon: any }[] = [
    { value: 'draft', label: t('estimates.status.draft'), icon: FileText },
    { value: 'finalized', label: t('estimates.status.finalized'), icon: CheckCircle },
    { value: 'sent', label: t('estimates.status.sent'), icon: Send },
    { value: 'approved', label: t('estimates.status.approved'), icon: CheckCircle },
    { value: 'rejected', label: t('estimates.status.rejected'), icon: XCircle },
  ]

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('estimates.sort.newest') },
    { value: 'oldest', label: t('estimates.sort.oldest') },
    { value: 'name', label: t('estimates.sort.name') },
    { value: 'value', label: t('estimates.sort.value') },
  ]
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EstimateStatus | undefined>()
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Load estimates
  useEffect(() => {
    loadEstimates()
  }, [searchQuery, selectedStatus, sortBy])

  const loadEstimates = async () => {
    setIsLoading(true)
    const { data, error } = await getEstimates(
      {
        search: searchQuery,
        status: selectedStatus,
      },
      sortBy
    )
    if (data) {
      setEstimates(data)
    } else if (error) {
      console.error('Error loading estimates:', error)
    }
    setIsLoading(false)
  }

  const handleView = (estimate: Estimate) => {
    router.push(`/estimates/${estimate.id}`)
  }

  const handleEdit = (estimate: Estimate) => {
    // In a real app, navigate to the appropriate estimator based on estimate type
    router.push(`/estimator/deck?edit=${estimate.id}`)
  }

  const handleDownload = async (estimate: Estimate) => {
    // In a real app, trigger PDF download
    alert(t('estimates.messages.pdfDownloadPending'))
  }

  const handleDuplicate = async (estimate: Estimate) => {
    const { data, error} = await duplicateEstimate(estimate.id)
    if (data) {
      await loadEstimates()
      alert(t('estimates.messages.duplicateSuccess'))
    } else if (error) {
      alert(t('estimates.messages.duplicateError'))
    }
  }

  const handleDelete = async (estimate: Estimate) => {
    if (confirm(t('estimates.messages.deleteConfirm', { name: estimate.name }))) {
      const { error } = await deleteEstimate(estimate.id)
      if (!error) {
        await loadEstimates()
        alert(t('estimates.messages.deleteSuccess'))
      } else {
        alert(t('estimates.messages.deleteError'))
      }
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedStatus(undefined)
  }

  const hasActiveFilters = searchQuery || selectedStatus

  // Calculate stats
  const stats = {
    total: estimates.length,
    approved: estimates.filter((e) => e.status === 'approved').length,
    pending: estimates.filter((e) => e.status === 'sent' || e.status === 'finalized').length,
    value: estimates.reduce((sum, e) => sum + e.total, 0),
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('estimates.title')}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {t('estimates.description')}
          </p>
        </div>
        <Link href="/estimates/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {t('estimates.newEstimate')}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-1">
            {t('estimates.stats.total')}
          </div>
          <div className="text-xl font-bold text-text-primary">{stats.total}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-1">
            {t('estimates.stats.approved')}
          </div>
          <div className="text-xl font-bold text-text-primary">{stats.approved}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-1">
            {t('estimates.stats.pending')}
          </div>
          <div className="text-xl font-bold text-text-primary">{stats.pending}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-1">
            {t('estimates.stats.value')}
          </div>
          <div className="text-xl font-bold text-text-primary">
            ${stats.value.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card className="p-4">
        <div className="space-y-3">
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder={t('estimates.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-tertiary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('estimates.filters')}
              </Button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-3 py-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-dewalt-yellow text-dewalt-black'
                      : 'bg-white text-text-secondary hover:bg-background-secondary'
                  )}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'px-3 py-2 transition-colors border-l border-border',
                    viewMode === 'list'
                      ? 'bg-dewalt-yellow text-dewalt-black'
                      : 'bg-white text-text-secondary hover:bg-background-secondary'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="pt-3 border-t border-border space-y-3">
              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2 block">
                  {t('estimates.filterLabels.status')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => {
                    const Icon = status.icon
                    return (
                      <button
                        key={status.value}
                        onClick={() =>
                          setSelectedStatus(
                            selectedStatus === status.value ? undefined : status.value
                          )
                        }
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all',
                          selectedStatus === status.value
                            ? 'border-dewalt-yellow bg-dewalt-yellow/10 text-dewalt-yellow font-semibold'
                            : 'border-border bg-white text-text-secondary hover:border-border-medium'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {status.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2 block">
                  {t('estimates.filterLabels.sortBy')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  {t('estimates.clearFilters')}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Estimates Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-dewalt-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      ) : estimates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {hasActiveFilters ? t('estimates.emptyState.noResults') : t('estimates.emptyState.noEstimates')}
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            {hasActiveFilters
              ? t('estimates.emptyState.adjustFilters')
              : t('estimates.emptyState.createFirst')}
          </p>
          {hasActiveFilters ? (
            <Button variant="secondary" onClick={clearFilters}>
              {t('estimates.clearFilters')}
            </Button>
          ) : (
            <Link href="/estimates/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('estimates.createEstimate')}
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          {estimates.map((estimate) => (
            <EstimateCard
              key={estimate.id}
              estimate={estimate}
              onView={handleView}
              onEdit={handleEdit}
              onDownload={handleDownload}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
