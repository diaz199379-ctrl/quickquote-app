'use client'

import { Estimate, EstimateStatus } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Eye,
  Edit2,
  Download,
  Copy,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface EstimateCardProps {
  estimate: Estimate
  projectName?: string
  onView?: (estimate: Estimate) => void
  onEdit?: (estimate: Estimate) => void
  onDownload?: (estimate: Estimate) => void
  onDuplicate?: (estimate: Estimate) => void
  onDelete?: (estimate: Estimate) => void
  viewMode?: 'grid' | 'list'
}

const statusConfig: Record<
  EstimateStatus,
  { label: string; icon: any; className: string }
> = {
  draft: {
    label: 'Draft',
    icon: FileText,
    className: 'bg-background-tertiary text-text-tertiary',
  },
  finalized: {
    label: 'Finalized',
    icon: CheckCircle2,
    className: 'badge-info',
  },
  sent: {
    label: 'Sent',
    icon: Send,
    className: 'badge-warning',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'badge-success',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'badge-error',
  },
}

export default function EstimateCard({
  estimate,
  projectName,
  onView,
  onEdit,
  onDownload,
  onDuplicate,
  onDelete,
  viewMode = 'grid',
}: EstimateCardProps) {
  const [showActions, setShowActions] = useState(false)
  const status = statusConfig[estimate.status]
  const StatusIcon = status.icon

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const materialCount = estimate.materials?.length || 0

  if (viewMode === 'list') {
    return (
      <Card
        interactive
        className="p-4 hover:border-dewalt-yellow transition-all group relative"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-dewalt-yellow" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className="font-semibold text-text-primary hover:text-dewalt-yellow transition-colors truncate">
                  {estimate.name}
                </h3>
                {projectName && (
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Project: {projectName}
                  </p>
                )}
              </div>
              <span
                className={cn('badge text-xs whitespace-nowrap flex items-center gap-1', status.className)}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
              <span>{materialCount} materials</span>
              <span>{formatDate(estimate.created_at)}</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(estimate.total)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <Button variant="ghost" size="sm" onClick={() => onView(estimate)}>
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(estimate)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={() => onDownload(estimate)}>
                <Download className="w-4 h-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(estimate)}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(estimate)}
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
          <FileText className="w-7 h-7 text-dewalt-yellow" />
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
                {onView && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onView(estimate)
                      setShowActions(false)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                )}
                {onEdit && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onEdit(estimate)
                      setShowActions(false)
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {onDownload && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onDownload(estimate)
                      setShowActions(false)
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                {onDuplicate && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                    onClick={() => {
                      onDuplicate(estimate)
                      setShowActions(false)
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                )}
                {onDelete && (
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors border-t border-border-light mt-1"
                    onClick={() => {
                      onDelete(estimate)
                      setShowActions(false)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-text-primary group-hover:text-dewalt-yellow transition-colors mb-1 line-clamp-2">
            {estimate.name}
          </h3>
          {projectName && (
            <p className="text-xs text-text-tertiary">Project: {projectName}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>{materialCount} materials</span>
          {estimate.labor_hours && (
            <span>{estimate.labor_hours}hrs labor</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <span
            className={cn('badge text-xs flex items-center gap-1', status.className)}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          <span className="text-lg font-bold text-text-primary">
            {formatCurrency(estimate.total)}
          </span>
        </div>

        <div className="text-xs text-text-tertiary">
          Created {formatDate(estimate.created_at)}
        </div>
      </div>
    </Card>
  )
}

