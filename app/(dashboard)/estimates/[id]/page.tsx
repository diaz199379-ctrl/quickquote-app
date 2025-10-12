'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit2, Trash2, Download, Share2, Copy, MoreVertical } from 'lucide-react'
import Link from 'next/link'

// Mock data - in real app, fetch from Supabase
const getMockEstimate = (id: string) => {
  return {
    id,
    projectName: 'Smith Deck Project',
    clientName: 'John Smith',
    status: 'approved',
    createdAt: '2025-01-10',
    dimensions: {
      length: 20,
      width: 12,
      height: 3,
      sqft: 240
    },
    materials: [
      { category: 'Decking', name: 'Composite decking boards', quantity: 45, unit: 'boards', unitPrice: 28.50, total: 1282.50 },
      { category: 'Framing', name: '2x8 Joists', quantity: 18, unit: 'boards', unitPrice: 12.75, total: 229.50 },
      { category: 'Framing', name: '4x4 Posts', quantity: 8, unit: 'posts', unitPrice: 18.99, total: 151.92 },
    ],
    pricing: {
      materialsSubtotal: 8450.00,
      labor: 3200.00,
      markup: 2330.00,
      total: 13980.00
    }
  }
}

export default function EstimateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showActions, setShowActions] = useState(false)
  
  const estimate = getMockEstimate(params.id as string)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this estimate? This action cannot be undone.')) {
      // TODO: Delete from Supabase
      console.log('Deleting estimate:', estimate.id)
      router.push('/estimates')
    }
  }

  const handleDuplicate = () => {
    // TODO: Create duplicate in Supabase
    console.log('Duplicating estimate:', estimate.id)
    router.push('/estimator/deck')
  }

  const handleExportPDF = () => {
    // TODO: Generate PDF
    console.log('Exporting PDF for estimate:', estimate.id)
    alert('PDF export will open in new tab')
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{estimate.projectName}</h1>
            <p className="text-sm text-text-secondary mt-1">
              Created on {new Date(estimate.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/estimator/deck?edit=${estimate.id}`)}
            className="hidden sm:flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          
          {/* Mobile Actions Menu */}
          <div className="relative sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleExportPDF()
                        setShowActions(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push(`/estimator/deck?edit=${estimate.id}`)
                        setShowActions(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDuplicate()
                        setShowActions(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Duplicate</span>
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={() => {
                        handleDelete()
                        setShowActions(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-status-error/10 text-status-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="hidden sm:flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          estimate.status === 'approved' ? 'bg-status-success/10 text-status-success' :
          estimate.status === 'pending' ? 'bg-status-warning/10 text-status-warning' :
          'bg-text-tertiary/10 text-text-tertiary'
        }`}>
          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
        </span>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-text-tertiary mb-1">Client</p>
              <p className="font-semibold text-text-primary">{estimate.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Deck Size</p>
              <p className="font-semibold text-text-primary">{estimate.dimensions.length}' × {estimate.dimensions.width}'</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Total Area</p>
              <p className="font-semibold text-text-primary">{estimate.dimensions.sqft} sq ft</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Height</p>
              <p className="font-semibold text-text-primary">{estimate.dimensions.height} ft</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {estimate.materials.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border-light hover:bg-background-secondary transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-tertiary">
                    {item.quantity} {item.unit} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-text-primary">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Materials Subtotal</span>
              <span className="font-semibold text-text-primary">${estimate.pricing.materialsSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Labor</span>
              <span className="font-semibold text-text-primary">${estimate.pricing.labor.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Markup</span>
              <span className="font-semibold text-text-primary">${estimate.pricing.markup.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t-2 border-dewalt-yellow">
              <span className="text-lg font-bold text-text-primary">Total</span>
              <span className="text-2xl font-bold text-dewalt-yellow">${estimate.pricing.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={handleDuplicate} className="flex-1 md:flex-none">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button variant="secondary" className="flex-1 md:flex-none">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}

