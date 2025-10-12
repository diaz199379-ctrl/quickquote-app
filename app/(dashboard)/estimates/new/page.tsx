'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Trash2, Save, Calculator } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

interface EstimateItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
}

export default function NewEstimatePage() {
  const { t } = useI18n()
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [items, setItems] = useState<EstimateItem[]>([
    { id: '1', description: '', quantity: 1, unit: 'unit', unitPrice: 0 }
  ])

  const addItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'unit',
      unitPrice: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof EstimateItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateItemTotal = (item: EstimateItem) => {
    return item.quantity * item.unitPrice
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSave = async (status: 'draft' | 'pending') => {
    // In a real app, save to Supabase
    console.log('Saving estimate...', { projectName, clientName, items, status })
    
    // Simulate save
    setTimeout(() => {
      router.push('/estimates')
    }, 500)
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Back Button Row */}
        <div>
          <Link href="/estimates">
            <Button variant="ghost" size="sm" className="hover:bg-background-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </Button>
          </Link>
        </div>
        
        {/* Title and Action Buttons */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">{t('estimates.newEstimate')}</h1>
            <p className="text-sm text-text-secondary mt-1">{t('estimates.newEstimateDescription', { fallback: 'Create a new construction estimate' })}</p>
          </div>
          
          {/* Action Buttons - Responsive */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop: Show both with text */}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('draft')}
              className="hidden sm:flex"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('estimates.saveDraft', { fallback: 'Save Draft' })}
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSave('pending')}
              className="hidden sm:flex"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {t('estimates.createEstimate')}
            </Button>
            
            {/* Mobile: Icon only */}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('draft')}
              className="sm:hidden w-10 h-10 p-0"
              title={t('estimates.saveDraft', { fallback: 'Save Draft' })}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSave('pending')}
              className="sm:hidden w-10 h-10 p-0"
              title={t('estimates.createEstimate')}
            >
              <Calculator className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Estimate Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('estimates.estimateDetails', { fallback: 'Estimate Details' })}</CardTitle>
          <CardDescription>{t('estimates.estimateDetailsDescription', { fallback: 'Basic information about this estimate' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                {t('projects.projectName')} <span className="text-status-error">*</span>
              </label>
              <Input
                placeholder={t('estimates.projectNamePlaceholder', { fallback: 'e.g., Kitchen Remodel - 123 Main St' })}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                {t('projects.clientName')} <span className="text-status-error">*</span>
              </label>
              <Input
                placeholder={t('estimates.clientNamePlaceholder', { fallback: 'e.g., John Smith' })}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{t('estimates.lineItems', { fallback: 'Line Items' })}</CardTitle>
              <CardDescription>{t('estimates.lineItemsDescription', { fallback: 'Add materials, labor, and other costs' })}</CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              {t('estimates.addItem', { fallback: 'Add Item' })}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary">{t('estimates.description', { fallback: 'Description' })}</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary w-24">{t('estimates.quantity', { fallback: 'Quantity' })}</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary w-24">{t('estimates.unit', { fallback: 'Unit' })}</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-text-primary w-32">{t('estimates.unitPrice', { fallback: 'Unit Price' })}</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-text-primary w-32">{t('common.total')}</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-border-light">
                    <td className="py-3 px-2">
                      <Input
                        placeholder={t('estimates.descriptionPlaceholder', { fallback: 'e.g., 2x4 Lumber, Paint, Labor' })}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      >
                        <option value="unit">Unit</option>
                        <option value="hours">Hours</option>
                        <option value="sq ft">Sq Ft</option>
                        <option value="linear ft">Linear Ft</option>
                        <option value="cubic yd">Cubic Yd</option>
                        <option value="each">Each</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-2 text-right text-sm font-semibold text-text-primary">
                      ${calculateItemTotal(item).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-status-error" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{t('estimates.item', { fallback: 'Item' })} {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-status-error" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">{t('estimates.description', { fallback: 'Description' })}</label>
                    <Input
                      placeholder={t('estimates.descriptionPlaceholder', { fallback: 'e.g., 2x4 Lumber, Paint, Labor' })}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary">{t('estimates.quantity', { fallback: 'Quantity' })}</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary">{t('estimates.unit', { fallback: 'Unit' })}</label>
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      >
                        <option value="unit">{t('estimates.units.unit', { fallback: 'Unit' })}</option>
                        <option value="hours">{t('estimates.units.hours', { fallback: 'Hours' })}</option>
                        <option value="sq ft">{t('estimates.units.sqFt', { fallback: 'Sq Ft' })}</option>
                        <option value="linear ft">{t('estimates.units.linearFt', { fallback: 'Linear Ft' })}</option>
                        <option value="cubic yd">{t('estimates.units.cubicYd', { fallback: 'Cubic Yd' })}</option>
                        <option value="each">{t('estimates.units.each', { fallback: 'Each' })}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary">{t('estimates.unitPrice', { fallback: 'Unit Price' })}</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="pt-2 border-t border-border-light">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text-secondary">{t('common.total')}</span>
                      <span className="text-lg font-bold text-text-primary">
                        ${calculateItemTotal(item).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('estimates.summary', { fallback: 'Summary' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-text-secondary">{t('estimates.subtotal')}</span>
            <span className="text-lg font-semibold text-text-primary">
              ${calculateSubtotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-text-secondary">{t('estimates.tax', { fallback: 'Tax (8%)' })}</span>
            <span className="text-lg font-semibold text-text-primary">
              ${calculateTax().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-text-primary">{t('common.total')}</span>
            <span className="text-2xl font-bold text-dewalt-yellow">
              ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

