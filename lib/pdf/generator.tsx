import { pdf } from '@react-pdf/renderer'
import { EstimatePDFTemplate, EstimatePDFData } from './EstimatePDFTemplate'
import { DeckDimensions, DeckOptions } from '@/lib/estimator/MaterialCalculator'
import { PricingResult } from '@/lib/estimator/PriceFetcher'

// Re-export EstimatePDFData for convenience
export type { EstimatePDFData }

export class EstimatePDFGenerator {
  /**
   * Generate a PDF blob from estimate data
   */
  static async generatePDFBlob(data: EstimatePDFData): Promise<Blob> {
    try {
      const doc = <EstimatePDFTemplate data={data} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      return blob
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  /**
   * Download PDF to user's device
   */
  static async downloadPDF(data: EstimatePDFData, filename?: string): Promise<void> {
    try {
      const blob = await this.generatePDFBlob(data)
      
      // Generate filename if not provided
      const defaultFilename = `${data.projectName.replace(/\s+/g, '_')}_Estimate_${new Date().toISOString().split('T')[0]}.pdf`
      const finalFilename = filename || defaultFilename
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = finalFilename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log(`✅ PDF downloaded: ${finalFilename}`)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw new Error('Failed to download PDF. Please try again.')
    }
  }

  /**
   * Generate a preview URL for the PDF (for use in iframe or preview modal)
   */
  static async generatePreviewURL(data: EstimatePDFData): Promise<string> {
    try {
      const blob = await this.generatePDFBlob(data)
      const url = URL.createObjectURL(blob)
      return url
    } catch (error) {
      console.error('Error generating preview URL:', error)
      throw new Error('Failed to generate PDF preview. Please try again.')
    }
  }

  /**
   * Validate estimate data before generating PDF
   */
  static validateEstimateData(data: EstimatePDFData): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.projectName || data.projectName.trim() === '') {
      errors.push('Project name is required')
    }

    if (!data.zipCode || data.zipCode.trim() === '') {
      errors.push('ZIP code is required')
    }

    if (!data.projectType || data.projectType.trim() === '') {
      errors.push('Project type is required')
    }

    if (!data.dimensions) {
      errors.push('Dimensions are required')
    } else {
      if (!data.dimensions.length || data.dimensions.length <= 0) {
        errors.push('Invalid deck length')
      }
      if (!data.dimensions.width || data.dimensions.width <= 0) {
        errors.push('Invalid deck width')
      }
    }

    if (!data.pricing) {
      errors.push('Pricing data is required')
    } else {
      if (!data.pricing.materials || data.pricing.materials.length === 0) {
        errors.push('No materials found in pricing')
      }
      if (!data.pricing.subtotal || data.pricing.subtotal <= 0) {
        errors.push('Invalid materials subtotal')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Get user company info from profile (if available)
   * In a real app, this would fetch from Supabase
   */
  static async getUserCompanyInfo(): Promise<{
    companyName?: string
    companyPhone?: string
    companyEmail?: string
  }> {
    // TODO: Integrate with Supabase user profile
    // For now, return defaults
    return {
      companyName: 'Your Company Name',
      companyPhone: '(555) 123-4567',
      companyEmail: 'contact@yourcompany.com',
    }
  }
}

/**
 * Helper function for quick PDF download
 */
export async function downloadEstimatePDF(
  projectName: string,
  dimensions: DeckDimensions,
  options: DeckOptions,
  pricing: PricingResult,
  laborHours: number,
  laborRate: number,
  markup: number,
  additionalData?: {
    clientName?: string
    address?: string
    zipCode?: string
    customNotes?: string
  }
): Promise<void> {
  const companyInfo = await EstimatePDFGenerator.getUserCompanyInfo()

  const estimateData: EstimatePDFData = {
    projectName,
    clientName: additionalData?.clientName,
    address: additionalData?.address,
    zipCode: additionalData?.zipCode || '90210',
    projectType: 'Deck Construction',
    dimensions,
    options,
    pricing,
    laborHours,
    laborRate,
    markup,
    ...companyInfo,
    customNotes: additionalData?.customNotes,
  }

  // Validate before generating
  const validation = EstimatePDFGenerator.validateEstimateData(estimateData)
  if (!validation.valid) {
    throw new Error(`Cannot generate PDF:\n${validation.errors.join('\n')}`)
  }

  await EstimatePDFGenerator.downloadPDF(estimateData)
}

