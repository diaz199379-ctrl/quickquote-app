'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/api/projects'
import { ProjectType, ProjectStatus } from '@/types/project'
import { useI18n } from '@/lib/i18n/context'

export default function NewProjectPage() {
  const { t } = useI18n()
  const router = useRouter()
  
  const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
    { value: 'deck', label: t('projects.types.deck') },
    { value: 'kitchen', label: t('projects.types.kitchen') },
    { value: 'bathroom', label: t('projects.types.bathroom') },
    { value: 'addition', label: t('projects.types.addition') },
    { value: 'remodel', label: t('projects.types.remodel') },
    { value: 'custom', label: t('projects.types.custom') },
  ]

  const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
    { value: 'draft', label: t('projects.status.draft') },
    { value: 'active', label: t('projects.status.active') },
    { value: 'completed', label: t('projects.status.completed') },
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    address: '',
    zip_code: '',
    project_type: 'custom' as ProjectType,
    status: 'draft' as ProjectStatus,
    notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert(t('projects.messages.nameRequired', { fallback: 'Project name is required' }))
      return
    }

    setIsSubmitting(true)

    const { data, error} = await createProject(formData)

    if (data) {
      alert(t('projects.messages.createSuccess', { fallback: 'Project created successfully!' }))
      router.push(`/projects/${data.id}`)
    } else if (error) {
      console.error('Error creating project:', error)
      alert(t('projects.messages.createError', { fallback: 'Failed to create project. Please try again.' }))
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('projects.backToProjects', { fallback: 'Back to Projects' })}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">{t('projects.newProject')}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {t('projects.newProjectDescription', { fallback: 'Create a new construction project' })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('projects.basicInfo', { fallback: 'Basic Information' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">
                {t('projects.projectName')} <span className="text-status-error">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={t('estimates.projectNamePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">{t('projects.description', { fallback: 'Description' })}</Label>
              <textarea
                id="description"
                name="description"
                placeholder={t('projects.descriptionPlaceholder', { fallback: 'Brief description of the project...' })}
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-tertiary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10 resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_type">{t('projects.projectType')}</Label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">{t('projects.status.label', { fallback: 'Status' })}</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('projects.clientInfo', { fallback: 'Client Information' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name">{t('projects.clientName')}</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  placeholder={t('estimates.clientNamePlaceholder')}
                  value={formData.client_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="client_email">{t('projects.clientEmail', { fallback: 'Client Email' })}</Label>
                <Input
                  id="client_email"
                  name="client_email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.client_email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client_phone">{t('projects.clientPhone', { fallback: 'Client Phone' })}</Label>
              <Input
                id="client_phone"
                name="client_phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.client_phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('projects.location', { fallback: 'Location' })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">{t('projects.address')}</Label>
              <Input
                id="address"
                name="address"
                placeholder={t('projects.addressPlaceholder', { fallback: '123 Main Street, Apt 4B' })}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip_code">{t('projects.zipCode')}</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  placeholder="90210"
                  value={formData.zip_code}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('projects.projectNotes', { fallback: 'Project Notes' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              id="notes"
              name="notes"
              placeholder={t('projects.notesPlaceholder', { fallback: 'Any additional notes about this project...' })}
              value={formData.notes}
              onChange={handleChange}
              className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-tertiary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10 resize-y"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? t('projects.creating', { fallback: 'Creating...' }) : t('projects.createProject')}
          </Button>
          <Link href="/projects" className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              {t('common.cancel')}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
