'use client'

import { Project, ProjectType } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Home,
  Utensils,
  Bath,
  Layers,
  Hammer,
  FileText,
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDuplicate?: (project: Project) => void
  onArchive?: (project: Project) => void
  onDelete?: (project: Project) => void
  viewMode?: 'grid' | 'list'
}

const projectTypeIcons: Record<ProjectType, any> = {
  deck: Home,
  kitchen: Utensils,
  bathroom: Bath,
  addition: Layers,
  remodel: Hammer,
  custom: FileText,
}

export default function ProjectCard({
  project,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  viewMode = 'grid',
}: ProjectCardProps) {
  const { t } = useI18n()
  const [showActions, setShowActions] = useState(false)
  const Icon = projectTypeIcons[project.project_type]
  
  const statusConfig = {
    draft: {
      label: t('projects.status.draft'),
      className: 'bg-background-tertiary text-text-tertiary',
    },
    active: {
      label: t('projects.status.active'),
      className: 'badge-info',
    },
    completed: {
      label: t('projects.status.completed'),
      className: 'badge-success',
    },
    archived: {
      label: t('projects.status.archived'),
      className: 'bg-text-tertiary/20 text-text-tertiary',
    },
  }
  
  const status = statusConfig[project.status]

  const formatCurrency = (value?: number) => {
    if (!value) return '$0'
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (viewMode === 'list') {
    return (
      <Card
        interactive
        className="p-4 hover:border-dewalt-yellow transition-all group relative"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-dewalt-yellow" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link href={`/projects/${project.id}`}>
                <h3 className="font-semibold text-text-primary hover:text-dewalt-yellow transition-colors truncate">
                  {project.name}
                </h3>
              </Link>
              <span className={cn('badge text-xs whitespace-nowrap', status.className)}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
              {project.client_name && (
                <span className="truncate">{project.client_name}</span>
              )}
              <span>{formatDate(project.created_at)}</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(project.total_value)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/projects/${project.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(project)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(project)}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
            {onArchive && (
              <Button variant="ghost" size="sm" onClick={() => onArchive(project)}>
                <Archive className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(project)}
                className="text-status-error hover:text-status-error hover:bg-status-error/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Grid view
  return (
    <Card
      interactive
      className="p-5 hover:border-dewalt-yellow transition-all group relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-dewalt-yellow/10 rounded-xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-dewalt-yellow" />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-background-secondary rounded transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-text-tertiary" />
          </button>
          
          {/* Dropdown Menu */}
          {showActions && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-border z-50 py-1">
                <Link href={`/projects/${project.id}`}>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="w-4 h-4" />
                    {t('common.view')}
                  </button>
                </Link>
                {onEdit && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onEdit(project)
                      setShowActions(false)
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                )}
                {onDuplicate && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onDuplicate(project)
                      setShowActions(false)
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    {t('projects.duplicate', { fallback: 'Duplicate' })}
                  </button>
                )}
                {onArchive && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onArchive(project)
                      setShowActions(false)
                    }}
                  >
                    <Archive className="w-4 h-4" />
                    {t('projects.archive', { fallback: 'Archive' })}
                  </button>
                )}
                {onDelete && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors border-t border-border-light mt-1"
                    onClick={() => {
                      onDelete(project)
                      setShowActions(false)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/projects/${project.id}`}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-dewalt-yellow transition-colors mb-1 line-clamp-2">
              {project.name}
            </h3>
            {project.client_name && (
              <p className="text-sm text-text-secondary truncate">{project.client_name}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-light">
            <span className={cn('badge text-xs', status.className)}>{status.label}</span>
            <span className="text-lg font-bold text-text-primary">
              {formatCurrency(project.total_value)}
            </span>
          </div>

          <div className="text-xs text-text-tertiary">
            {t('projects.created', { fallback: 'Created' })} {formatDate(project.created_at)}
          </div>
        </div>
      </Link>
    </Card>
  )
}

