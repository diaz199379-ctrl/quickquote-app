'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FolderKanban,
  Search,
  Filter,
  Grid3x3,
  List,
  X,
  Home,
  Utensils,
  Bath,
  Layers,
  Hammer,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import { getProjects, duplicateProject, archiveProject, deleteProject } from '@/lib/api/projects'
import { Project, ProjectType, ProjectStatus, SortOption, ViewMode } from '@/types/project'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { handleDatabaseError } from '@/lib/utils/errorHandling'

export default function ProjectsPage() {
  const router = useRouter()
  const { t } = useI18n()
  
  const PROJECT_TYPES: { value: ProjectType; label: string; icon: any }[] = [
    { value: 'deck', label: t('projects.types.deck'), icon: Home },
    { value: 'kitchen', label: t('projects.types.kitchen'), icon: Utensils },
    { value: 'bathroom', label: t('projects.types.bathroom'), icon: Bath },
    { value: 'addition', label: t('projects.types.addition'), icon: Layers },
    { value: 'remodel', label: t('projects.types.remodel'), icon: Hammer },
    { value: 'custom', label: t('projects.types.custom'), icon: FileText },
  ]

  const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
    { value: 'draft', label: t('projects.status.draft') },
    { value: 'active', label: t('projects.status.active') },
    { value: 'completed', label: t('projects.status.completed') },
    { value: 'archived', label: t('projects.status.archived') },
  ]

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('projects.sort.newest') },
    { value: 'oldest', label: t('projects.sort.oldest') },
    { value: 'name', label: t('projects.sort.name') },
    { value: 'value', label: t('projects.sort.value') },
  ]
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<ProjectType | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | undefined>()
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Load projects
  useEffect(() => {
    loadProjects()
  }, [searchQuery, selectedType, selectedStatus, sortBy])

  const loadProjects = async () => {
    setIsLoading(true)
    const { data, error } = await getProjects(
      {
        search: searchQuery,
        projectType: selectedType,
        status: selectedStatus,
      },
      sortBy
    )
    if (data) {
      setProjects(data)
    } else if (error) {
      console.error('Error loading projects:', error)
    }
    setIsLoading(false)
  }

  const handleDuplicate = async (project: Project) => {
    const { data, error } = await duplicateProject(project.id)
    if (data) {
      await loadProjects()
      alert(t('projects.messages.duplicateSuccess'))
    } else if (error) {
      const friendlyError = handleDatabaseError(error)
      alert(`${friendlyError.message} ${friendlyError.suggestion || ''}`)
    }
  }

  const handleArchive = async (project: Project) => {
    if (confirm(t('projects.messages.archiveConfirm', { name: project.name }))) {
      const { error } = await archiveProject(project.id)
      if (!error) {
        await loadProjects()
        alert(t('projects.messages.archiveSuccess'))
      } else {
        alert(t('projects.messages.archiveError'))
      }
    }
  }

  const handleDelete = async (project: Project) => {
    if (
      confirm(t('projects.messages.deleteConfirm', { name: project.name }))
    ) {
      const { error } = await deleteProject(project.id)
      if (!error) {
        await loadProjects()
        alert(t('projects.messages.deleteSuccess'))
      } else {
        alert(t('projects.messages.deleteError'))
      }
    }
  }

  const handleEdit = (project: Project) => {
    router.push(`/projects/${project.id}/edit`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedType(undefined)
    setSelectedStatus(undefined)
  }

  const hasActiveFilters = searchQuery || selectedType || selectedStatus

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('projects.title')}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {t('projects.description')}
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {t('projects.newProject')}
          </Button>
        </Link>
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
                placeholder={t('projects.searchPlaceholder')}
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
                {t('projects.filters')}
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
              {/* Project Type Filter */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2 block">
                  {t('projects.filterLabels.projectType')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        onClick={() =>
                          setSelectedType(
                            selectedType === type.value ? undefined : type.value
                          )
                        }
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all',
                          selectedType === type.value
                            ? 'border-dewalt-yellow bg-dewalt-yellow/10 text-dewalt-yellow font-semibold'
                            : 'border-border bg-white text-text-secondary hover:border-border-medium'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2 block">
                  {t('projects.filterLabels.status')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        setSelectedStatus(
                          selectedStatus === status.value ? undefined : status.value
                        )
                      }
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-sm transition-all',
                        selectedStatus === status.value
                          ? 'border-dewalt-yellow bg-dewalt-yellow/10 text-dewalt-yellow font-semibold'
                          : 'border-border bg-white text-text-secondary hover:border-border-medium'
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2 block">
                  {t('projects.filterLabels.sortBy')}
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
                  {t('projects.clearFilters')}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Projects Grid/List */}
      {isLoading ? (
        <LoadingSpinner text={t('projects.loading', { fallback: 'Loading projects...' })} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={hasActiveFilters ? Search : FolderKanban}
          title={hasActiveFilters ? t('projects.emptyState.noResults') : t('projects.emptyState.noProjects')}
          description={hasActiveFilters
            ? t('projects.emptyState.adjustFilters')
            : t('projects.emptyState.createFirst')}
          actionLabel={hasActiveFilters ? undefined : t('projects.createProject')}
          onAction={hasActiveFilters ? undefined : () => router.push('/projects/new')}
          secondaryActionLabel={hasActiveFilters ? t('projects.clearFilters') : undefined}
          onSecondaryAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
