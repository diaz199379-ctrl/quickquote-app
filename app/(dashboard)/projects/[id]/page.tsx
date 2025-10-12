'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProjectDetailView from '@/components/projects/ProjectDetailView'
import { getProjectById, archiveProject, deleteProject } from '@/lib/api/projects'
import { duplicateEstimate, deleteEstimate } from '@/lib/api/projects'
import { ProjectWithEstimates, Estimate } from '@/types/project'
import { addToRecentlyViewed } from '@/lib/api/projects'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectWithEstimates | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      loadProject()
      addToRecentlyViewed(projectId)
    }
  }, [projectId])

  const loadProject = async () => {
    setIsLoading(true)
    const { data, error } = await getProjectById(projectId)
    if (data) {
      setProject(data)
    } else if (error) {
      console.error('Error loading project:', error)
      alert('Failed to load project')
      router.push('/projects')
    }
    setIsLoading(false)
  }

  const handleEdit = () => {
    router.push(`/projects/${projectId}/edit`)
  }

  const handleArchive = async () => {
    if (!project) return
    if (confirm(`Archive "${project.name}"?`)) {
      const { error } = await archiveProject(projectId)
      if (!error) {
        router.push('/projects')
      } else {
        alert('Failed to archive project')
      }
    }
  }

  const handleDelete = async () => {
    if (!project) return
    if (
      confirm(
        `Permanently delete "${project.name}"? This will also delete all estimates in this project.`
      )
    ) {
      const { error } = await deleteProject(projectId)
      if (!error) {
        router.push('/projects')
      } else {
        alert('Failed to delete project')
      }
    }
  }

  const handleShare = () => {
    // In a real app, generate share link
    alert('Share functionality will be implemented with Supabase integration')
  }

  const handleExportAll = () => {
    // In a real app, export all estimates as PDFs
    alert('Export all functionality will be implemented with Supabase integration')
  }

  const handleNewEstimate = (projectId: string) => {
    router.push(`/estimator/deck?project=${projectId}`)
  }

  const handleEditEstimate = (estimate: Estimate) => {
    router.push(`/estimator/deck?edit=${estimate.id}`)
  }

  const handleDownloadEstimate = async (estimate: Estimate) => {
    // In a real app, trigger PDF download
    alert('PDF download will be implemented with Supabase integration')
  }

  const handleDuplicateEstimate = async (estimate: Estimate) => {
    const { data, error } = await duplicateEstimate(estimate.id)
    if (data) {
      await loadProject()
      alert('Estimate duplicated successfully!')
    } else if (error) {
      alert('Failed to duplicate estimate')
    }
  }

  const handleDeleteEstimate = async (estimate: Estimate) => {
    if (confirm(`Permanently delete "${estimate.name}"?`)) {
      const { error } = await deleteEstimate(estimate.id)
      if (!error) {
        await loadProject()
        alert('Estimate deleted successfully!')
      } else {
        alert('Failed to delete estimate')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-dewalt-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Project Not Found
          </h2>
          <p className="text-text-secondary">
            The project you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ProjectDetailView
      project={project}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onDelete={handleDelete}
      onShare={handleShare}
      onExportAll={handleExportAll}
      onNewEstimate={handleNewEstimate}
      onEditEstimate={handleEditEstimate}
      onDownloadEstimate={handleDownloadEstimate}
      onDuplicateEstimate={handleDuplicateEstimate}
      onDeleteEstimate={handleDeleteEstimate}
    />
  )
}

