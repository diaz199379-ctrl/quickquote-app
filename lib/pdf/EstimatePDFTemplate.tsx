import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { DeckDimensions, DeckOptions, MaterialItem } from '@/lib/estimator/MaterialCalculator'
import { PricingResult } from '@/lib/estimator/PriceFetcher'

// Define styles for the PDF - Premium Professional Edition
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1F2937',
  },
  
  // Header Section - Premium Design
  header: {
    marginBottom: 35,
    paddingBottom: 20,
    borderBottom: '1 solid #E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logo: {
    flexDirection: 'column',
    gap: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  logoTagline: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.6,
  },
  estimateNumber: {
    textAlign: 'right',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #F3F4F6',
  },
  estimateLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  estimateValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },
  
  // Title Section - Elegant
  titleSection: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '1 solid #F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 1.5,
  },
  
  // Info Grid - Clean & Spacious
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  infoBox: {
    flex: 1,
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    border: '1 solid #F3F4F6',
  },
  infoLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 1.4,
  },
  
  // Dimensions Section - Premium
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #FFCD00',
    letterSpacing: -0.2,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dimensionItem: {
    width: '30%',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    border: '1 solid #F3F4F6',
  },
  dimensionLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 'bold',
  },
  dimensionValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // Materials Table - Sophisticated Design
  table: {
    marginBottom: 25,
    border: '1 solid #E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #F3F4F6',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '1 solid #F3F4F6',
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  categoryRow: {
    flexDirection: 'row',
    backgroundColor: '#FEF9E7',
    padding: 10,
    borderLeft: '4 solid #FFCD00',
    borderBottom: '1 solid #F3F4F6',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#854D0E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  tableCellRight: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'right',
    lineHeight: 1.4,
  },
  
  // Column widths - Optimized
  colDescription: { width: '40%' },
  colQuantity: { width: '15%', textAlign: 'center' },
  colUnit: { width: '15%', textAlign: 'center' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  
  // Cost Summary - Premium Style
  costSummary: {
    marginTop: 25,
    marginLeft: 'auto',
    width: '55%',
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    border: '2 solid #E5E7EB',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  costValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTop: '2 solid #111827',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCD00',
    letterSpacing: -0.5,
  },
  
  // Notes Section - Professional
  notesBox: {
    marginTop: 30,
    padding: 18,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    border: '1 solid #E5E7EB',
    borderLeft: '4 solid #9CA3AF',
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  notesText: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.6,
  },
  
  // Footer - Refined
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTop: '1 solid #E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  footerBrand: {
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerAccent: {
    fontSize: 8,
    color: '#FFCD00',
    fontWeight: 'bold',
  },
})

export interface EstimatePDFData {
  projectName: string
  clientName?: string
  address?: string
  zipCode: string
  projectType: string
  dimensions: DeckDimensions
  options: DeckOptions
  pricing: PricingResult
  laborHours: number
  laborRate: number
  markup: number
  companyName?: string
  companyPhone?: string
  companyEmail?: string
  customNotes?: string
}

export const EstimatePDFTemplate: React.FC<{ data: EstimatePDFData }> = ({ data }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Generate estimate number (in real app, get from database)
  const estimateNumber = `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

  // Calculate totals
  const materialsTotal = data.pricing.subtotal
  const laborTotal = data.laborHours * data.laborRate
  const subtotal = materialsTotal + laborTotal
  const markupAmount = subtotal * (data.markup / 100)
  const grandTotal = Math.ceil(subtotal + markupAmount)

  // Group materials by category
  const groupMaterialsByCategory = (materials: any[]) => {
    const categories: { [key: string]: any[] } = {}
    materials.forEach((item) => {
      const category = item.category || 'Other Materials'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(item)
    })
    return categories
  }

  const groupedMaterials = groupMaterialsByCategory(data.pricing.materials)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header - Premium Design */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>QuickQuote AI</Text>
              <Text style={styles.logoTagline}>AI-Powered Construction Estimates</Text>
            </View>
            <View>
              <View style={styles.companyInfo}>
                {data.companyName && <Text style={{ fontWeight: 'bold', fontSize: 11, color: '#111827', marginBottom: 2 }}>{data.companyName}</Text>}
                {data.companyPhone && <Text>{data.companyPhone}</Text>}
                {data.companyEmail && <Text>{data.companyEmail}</Text>}
              </View>
              <View style={styles.estimateNumber}>
                <Text style={styles.estimateLabel}>Estimate Number</Text>
                <Text style={styles.estimateValue}>{estimateNumber}</Text>
              </View>
              <View style={{ textAlign: 'right', marginTop: 6 }}>
                <Text style={{ fontSize: 9, color: '#6B7280' }}>{today}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Construction Estimate</Text>
          <Text style={styles.subtitle}>Professional estimate generated with AI-powered pricing</Text>
        </View>

        {/* Project Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Project Name</Text>
            <Text style={styles.infoValue}>{data.projectName}</Text>
          </View>
          {data.clientName && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoValue}>{data.clientName}</Text>
            </View>
          )}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Project Type</Text>
            <Text style={styles.infoValue}>{data.projectType}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{data.address || `ZIP ${data.zipCode}`}</Text>
          </View>
        </View>

        {/* Dimensions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Dimensions</Text>
          <View style={styles.dimensionsGrid}>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Length</Text>
              <Text style={styles.dimensionValue}>{data.dimensions.length} ft</Text>
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Width</Text>
              <Text style={styles.dimensionValue}>{data.dimensions.width} ft</Text>
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Height</Text>
              <Text style={styles.dimensionValue}>{data.dimensions.height} ft</Text>
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Total Area</Text>
              <Text style={styles.dimensionValue}>{(data.dimensions.length * data.dimensions.width).toFixed(0)} sq ft</Text>
            </View>
            {data.dimensions.hasStairs && (
              <View style={styles.dimensionItem}>
                <Text style={styles.dimensionLabel}>Stairs</Text>
                <Text style={styles.dimensionValue}>{data.dimensions.stairSteps} steps</Text>
              </View>
            )}
            {data.dimensions.hasRailing && (
              <View style={styles.dimensionItem}>
                <Text style={styles.dimensionLabel}>Railing Sides</Text>
                <Text style={styles.dimensionValue}>{data.dimensions.railingSides?.length || 0}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Materials Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials Breakdown</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.colQuantity]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unit</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>Unit Price</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
            </View>

            {/* Table Body - Grouped by Category */}
            {Object.entries(groupedMaterials).map(([category, items], catIndex) => (
              <View key={catIndex}>
                {/* Category Header */}
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
                
                {/* Items in Category */}
                {items.map((item, itemIndex) => (
                  <View key={itemIndex} style={itemIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, styles.colDescription]}>{item.name}</Text>
                    <Text style={[styles.tableCell, styles.colQuantity]}>{item.quantity.toFixed(0)}</Text>
                    <Text style={[styles.tableCell, styles.colUnit]}>{item.unit}</Text>
                    <Text style={[styles.tableCellRight, styles.colUnitPrice]}>${item.unitPrice.toFixed(2)}</Text>
                    <Text style={[styles.tableCellRight, styles.colTotal]}>${item.totalPrice.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Cost Summary */}
        <View style={styles.costSummary}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Materials Subtotal</Text>
            <Text style={styles.costValue}>${materialsTotal.toFixed(2)}</Text>
          </View>
          {laborTotal > 0 && (
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Labor ({data.laborHours} hrs × ${data.laborRate}/hr)</Text>
              <Text style={styles.costValue}>${laborTotal.toFixed(2)}</Text>
            </View>
          )}
          {markupAmount > 0 && (
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Markup ({data.markup}%)</Text>
              <Text style={styles.costValue}>${markupAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Estimate</Text>
            <Text style={styles.totalValue}>${grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Notes & Disclaimer */}
        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>Important Notes</Text>
          {data.customNotes && (
            <Text style={[styles.notesText, { marginBottom: 8 }]}>{data.customNotes}</Text>
          )}
          <Text style={styles.notesText}>
            This estimate is preliminary and subject to change. Final costs may vary based on site conditions, material availability, code requirements, and other factors. All work will be completed in accordance with local building codes. This estimate is valid for 30 days from the date shown above.
          </Text>
        </View>

        {/* Footer - Professional */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBrand}>QuickQuote AI</Text>
            <Text style={styles.footerAccent}>Professional Construction Estimates</Text>
          </View>
          <Text style={styles.footerText}>Page 1 of 1</Text>
          <Text style={styles.footerText}>{new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}</Text>
        </View>
      </Page>
    </Document>
  )
}

