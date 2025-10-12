'use client'

import { useState } from 'react'
import { ProjectWithEstimates } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit2,
  Share2,
  Download,
  Archive,
  Trash2,
  Plus,
  Clock,
  User,
  MapPin,
  DollarSign,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import EstimateCard from './EstimateCard'
import { Estimate } from '@/types/project'

interface ProjectDetailViewProps {
  project: ProjectWithEstimates
  onEdit?: (project: ProjectWithEstimates) => void
  onArchive?: (project: ProjectWithEstimates) => void
  onDelete?: (project: ProjectWithEstimates) => void
  onShare?: (project: ProjectWithEstimates) => void
  onExportAll?: (project: ProjectWithEstimates) => void
  onNewEstimate?: (projectId: string) => void
  onEditEstimate?: (estimate: Estimate) => void
  onDownloadEstimate?: (estimate: Estimate) => void
  onDuplicateEstimate?: (estimate: Estimate) => void
  onDeleteEstimate?: (estimate: Estimate) => void
}

export default function ProjectDetailView({
  project,
  onEdit,
  onArchive,
  onDelete,
  onShare,
  onExportAll,
  onNewEstimate,
  onEditEstimate,
  onDownloadEstimate,
  onDuplicateEstimate,
  onDeleteEstimate,
}: ProjectDetailViewProps) {
  const [notes, setNotes] = useState(project.notes || '')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const formatCurrency = (value?: number) => {
    if (!value) return '$0'
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSaveNotes = () => {
    // In a real app, save to Supabase
    console.log('Saving notes:', notes)
    setIsEditingNotes(false)
    // Call API to update notes
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Back Button */}
      <Link href="/projects">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-text-secondary">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(project)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onShare && (
            <Button variant="secondary" size="sm" onClick={() => onShare(project)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          {onExportAll && (
            <Button variant="secondary" size="sm" onClick={() => onExportAll(project)}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          )}
          {onArchive && (
            <Button variant="secondary" size="sm" onClick={() => onArchive(project)}>
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          )}
          {onDelete && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete(project)}
              className="text-status-error hover:text-status-error hover:bg-status-error/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Project Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {project.client_name && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-dewalt-yellow" />
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Client</div>
                <div className="font-semibold text-text-primary">{project.client_name}</div>
                {project.client_email && (
                  <div className="text-xs text-text-secondary">{project.client_email}</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {project.address && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-dewalt-yellow" />
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Location</div>
                <div className="font-semibold text-text-primary">{project.address}</div>
                {project.zip_code && (
                  <div className="text-xs text-text-secondary">{project.zip_code}</div>
                )}
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-dewalt-yellow" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary mb-1">Total Value</div>
              <div className="font-bold text-xl text-text-primary">
                {formatCurrency(project.total_value)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-dewalt-yellow" />
            </div>
            <div>
              <div className="text-xs text-text-tertiary mb-1">Estimates</div>
              <div className="font-bold text-xl text-text-primary">
                {project.estimate_count}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Estimates Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Estimates</CardTitle>
            {onNewEstimate && (
              <Button size="sm" onClick={() => onNewEstimate(project.id)}>
                <Plus className="w-4 h-4 mr-2" />
                New Estimate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {project.estimates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Estimates Yet
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                Create your first estimate for this project
              </p>
              {onNewEstimate && (
                <Button onClick={() => onNewEstimate(project.id)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Estimate
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.estimates.map((estimate) => (
                <EstimateCard
                  key={estimate.id}
                  estimate={estimate}
                  onEdit={onEditEstimate}
                  onDownload={onDownloadEstimate}
                  onDuplicate={onDuplicateEstimate}
                  onDelete={onDeleteEstimate}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Project Notes</CardTitle>
            {!isEditingNotes ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotes(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveNotes}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setNotes(project.notes || '')
                    setIsEditingNotes(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10 resize-y"
              placeholder="Add notes about this project..."
            />
          ) : (
            <div className="text-text-secondary whitespace-pre-wrap">
              {notes || (
                <span className="text-text-tertiary italic">No notes yet</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-dewalt-yellow/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-dewalt-yellow" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">Project Created</div>
                <div className="text-xs text-text-tertiary">
                  {formatDate(project.created_at)}
                </div>
              </div>
            </div>
            {project.updated_at !== project.created_at && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-dewalt-yellow/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-dewalt-yellow" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">Last Updated</div>
                  <div className="text-xs text-text-tertiary">
                    {formatDate(project.updated_at)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

