'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EstimatePDFGenerator, EstimatePDFData } from '@/lib/pdf/generator'
import { Download, Eye, Loader2, FileText, Mail, Share2, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PDFPreviewProps {
  isOpen: boolean
  onClose: () => void
  estimateData: EstimatePDFData
}

export default function PDFPreview({ isOpen, onClose, estimateData }: PDFPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state for additional info
  const [projectName, setProjectName] = useState(estimateData.projectName || 'Deck Estimate')
  const [clientName, setClientName] = useState(estimateData.clientName || '')
  const [address, setAddress] = useState(estimateData.address || '')
  const [customNotes, setCustomNotes] = useState(estimateData.customNotes || '')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Generate preview when modal opens
  useEffect(() => {
    if (isOpen) {
      generatePreview()
    } else {
      // Cleanup preview URL when modal closes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }, [isOpen])

  const generatePreview = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const updatedData: EstimatePDFData = {
        ...estimateData,
        projectName,
        clientName: clientName || undefined,
        address: address || undefined,
        customNotes: customNotes || undefined,
      }
      
      const url = await EstimatePDFGenerator.generatePreviewURL(updatedData)
      setPreviewUrl(url)
    } catch (err) {
      console.error('Preview generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setError(null)

    try {
      const updatedData: EstimatePDFData = {
        ...estimateData,
        projectName,
        clientName: clientName || undefined,
        address: address || undefined,
        customNotes: customNotes || undefined,
      }

      // Validate data
      const validation = EstimatePDFGenerator.validateEstimateData(updatedData)
      if (!validation.valid) {
        setError(validation.errors.join(', '))
        return
      }

      await EstimatePDFGenerator.downloadPDF(updatedData)
      
      // Show success (could be a toast notification in a real app)
      console.log('✅ PDF downloaded successfully!')
      
      // Close modal after successful download
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err) {
      console.error('Download error:', err)
      setError(err instanceof Error ? err.message : 'Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleUpdatePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    generatePreview()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-6 h-6 text-dewalt-yellow" />
                PDF Preview & Export
              </DialogTitle>
              <DialogDescription className="mt-1">
                Review your estimate and customize before downloading
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Options */}
          <div className="w-80 border-r border-border p-6 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-4">Estimate Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Smith Deck Project"
                />
              </div>

              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <Label htmlFor="address">Project Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 123 Main St, Beverly Hills, CA"
                />
              </div>

              <div>
                <Label htmlFor="customNotes">Custom Notes</Label>
                <Textarea
                  id="customNotes"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Add any additional notes or conditions..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleUpdatePreview}
                variant="secondary"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Update Preview
                  </>
                )}
              </Button>

              {/* Advanced Options (Future) */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showAdvancedOptions ? '▼' : '▶'} Advanced Options
                </button>
                
                {showAdvancedOptions && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-text-tertiary">
                      Coming soon: Email delivery, custom branding, multi-page layouts
                    </p>
                    <Button variant="ghost" size="sm" disabled className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email to Client
                    </Button>
                    <Button variant="ghost" size="sm" disabled className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Generate Share Link
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-status-error/10 border border-status-error/30 rounded-lg">
                <p className="text-xs text-status-error">{error}</p>
              </div>
            )}
          </div>

          {/* Right Area - PDF Preview */}
          <div className="flex-1 bg-background-tertiary p-6 overflow-hidden flex flex-col">
            {isGenerating ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-dewalt-yellow animate-spin mx-auto mb-4" />
                  <p className="text-text-secondary">Generating PDF preview...</p>
                </div>
              </div>
            ) : previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full bg-white rounded-lg shadow-lg"
                title="PDF Preview"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-secondary">No preview available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <DialogFooter className="p-6 pt-4 border-t border-border flex-row justify-between items-center">
          <div className="text-sm text-text-tertiary">
            📄 PDF will be saved to your Downloads folder
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading || isGenerating}
              className="min-w-[140px]"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

