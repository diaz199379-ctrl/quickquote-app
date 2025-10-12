'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
  onSave?: () => void
  isSaving?: boolean
  showSaveButton?: boolean
  saveButtonText?: string
}

export default function SettingsSection({
  title,
  description,
  children,
  onSave,
  isSaving = false,
  showSaveButton = true,
  saveButtonText = 'Save Changes',
}: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        
        {showSaveButton && onSave && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saveButtonText}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

