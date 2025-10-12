# PDF Export System Documentation

## Overview

QuickQuote AI includes a professional PDF export system that generates beautifully formatted estimate PDFs with DEWALT branding. The system is built using `@react-pdf/renderer` for high-quality, enterprise-level PDF generation.

## Features

✅ **Professional Layout**
- DEWALT yellow & black branding
- Clean, modern design
- Easy-to-read tables
- Grouped materials by category

✅ **Comprehensive Content**
- Company branding (logo, contact info)
- Project details (name, client, location, type)
- Complete dimensions breakdown
- Itemized materials list with pricing
- Labor calculations
- Markup/margin
- Cost summary with grand total
- Custom notes section
- Legal disclaimer
- Footer with timestamp and page numbers

✅ **Interactive Preview**
- Live PDF preview before download
- Edit project name, client, address
- Add custom notes
- Update preview in real-time
- Validation before download

✅ **Mobile Responsive**
- Works on all devices
- Touch-friendly interface
- Responsive modal layout

## Architecture

### Core Files

1. **`lib/pdf/EstimatePDFTemplate.tsx`**
   - React-PDF document template
   - All PDF styling and layout
   - Handles data formatting and display
   - Exports `EstimatePDFTemplate` component

2. **`lib/pdf/generator.ts`**
   - PDF generation utilities
   - `EstimatePDFGenerator` class with static methods:
     - `generatePDFBlob()` - Create blob from data
     - `downloadPDF()` - Trigger browser download
     - `generatePreviewURL()` - Create preview URL
     - `validateEstimateData()` - Validate before generation
     - `getUserCompanyInfo()` - Get company branding (TODO: integrate with Supabase)
   - Exports helper function `downloadEstimatePDF()`

3. **`components/estimator/PDFPreview.tsx`**
   - Preview modal component
   - Form fields for additional data
   - Live PDF preview in iframe
   - Download button
   - Error handling

4. **`components/estimator/EstimateReview.tsx`** (updated)
   - Integrated PDF export button
   - Opens PDFPreview modal
   - Passes estimate data

### Supporting UI Components

- **`components/ui/dialog.tsx`** - Modal dialog (Radix UI)
- **`components/ui/textarea.tsx`** - Text area for notes
- **`components/ui/scroll-area.tsx`** - Scrollable areas

## Usage

### Basic Usage (From EstimateReview Component)

The PDF export is already integrated into the estimate review page. Users simply:

1. Complete the deck estimator
2. Review the estimate
3. Click "Export PDF" button
4. Review and customize in the preview modal
5. Click "Download PDF"

### Programmatic Usage

```typescript
import { EstimatePDFGenerator } from '@/lib/pdf/generator'
import { EstimatePDFData } from '@/lib/pdf/EstimatePDFTemplate'

// Prepare data
const pdfData: EstimatePDFData = {
  projectName: 'Smith Deck Project',
  clientName: 'John Smith',
  address: '123 Main St, Beverly Hills, CA',
  zipCode: '90210',
  projectType: 'Deck Construction',
  dimensions: { /* ... */ },
  options: { /* ... */ },
  pricing: { /* ... */ },
  laborHours: 40,
  laborRate: 65,
  markup: 20,
  companyName: 'ABC Construction',
  companyPhone: '(555) 123-4567',
  companyEmail: 'contact@abcconstruction.com',
  customNotes: 'Custom notes here...',
}

// Validate
const validation = EstimatePDFGenerator.validateEstimateData(pdfData)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  return
}

// Download PDF
await EstimatePDFGenerator.downloadPDF(pdfData)

// Or get preview URL
const previewUrl = await EstimatePDFGenerator.generatePreviewURL(pdfData)
```

### Using the Helper Function

```typescript
import { downloadEstimatePDF } from '@/lib/pdf/generator'

await downloadEstimatePDF(
  'Deck Project',
  dimensions,
  options,
  pricing,
  laborHours,
  laborRate,
  markup,
  {
    clientName: 'John Smith',
    address: '123 Main St',
    zipCode: '90210',
    customNotes: 'Special conditions apply',
  }
)
```

## PDF Structure

### Header Section
- QuickQuote AI logo (⚡ icon + text)
- Company name, phone, email (from user profile)
- Date generated
- Yellow bottom border for branding

### Title Section
- "Construction Estimate" heading
- Subtitle with AI-powered pricing mention

### Project Info Grid
- Project name
- Client name (if provided)
- Project type (e.g., "Deck Construction")
- Location (address or ZIP code)

### Dimensions Section
- All project dimensions in a grid
- Length, width, height
- Total area (sqft)
- Stairs info (if applicable)
- Railing info (if applicable)

### Materials Breakdown Table
- **Grouped by category** (Framing, Decking, Railing, Stairs, etc.)
- Columns: Description, Qty, Unit, Unit Price, Total
- Category headers with yellow background
- Alternating row colors for readability
- Materials subtotal at bottom

### Cost Summary Box
- Materials subtotal
- Labor (hours × rate)
- Markup (percentage)
- **TOTAL ESTIMATE** (large, bold, yellow)

### Notes & Disclaimer
- Custom notes (if provided by user)
- Standard legal disclaimer:
  - Preliminary estimate subject to change
  - Final costs may vary
  - Site conditions disclaimer
  - Code compliance mention
  - 30-day validity

### Footer
- "Generated by QuickQuote AI" (yellow branding)
- Page numbers
- Timestamp

## Styling

### Colors
- **Primary Yellow**: `#FFCD00` (DEWALT yellow)
- **Black**: `#111827` (text primary)
- **Gray**: `#6B7280` (text secondary)
- **Light Gray**: `#F9FAFB` (backgrounds)
- **Borders**: `#E5E7EB`

### Typography
- **Headings**: Bold, Helvetica
- **Body**: 10pt base, Helvetica
- **Emphasis**: Yellow color for totals

### Layout
- **Page**: Letter size (8.5" × 11")
- **Margins**: 40pt all sides
- **Borders**: Rounded corners (4-8pt radius)
- **Spacing**: Consistent gaps (10-20pt)

## Customization

### Adding Company Logo

To add a custom company logo (instead of the ⚡ icon):

1. Store logo image in Supabase Storage or public folder
2. Update `EstimatePDFTemplate.tsx`:

```tsx
import { Image } from '@react-pdf/renderer'

// In the header section, replace logoIcon with:
<Image
  src="/path/to/logo.png"
  style={{ width: 40, height: 40, borderRadius: 8 }}
/>
```

### Custom Branding Colors

Update colors in `lib/pdf/EstimatePDFTemplate.tsx`:

```tsx
// Find and replace:
'#FFCD00' // Primary yellow
'#111827' // Dark text
'#FF6B00' // Orange accent
```

### Adding More Sections

Add new sections before the footer:

```tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Your Section Title</Text>
  {/* Your content */}
</View>
```

### Multi-Page PDFs

React-PDF automatically handles page breaks. For explicit page breaks:

```tsx
<Page size="LETTER" style={styles.page}>
  {/* Page 1 content */}
</Page>
<Page size="LETTER" style={styles.page}>
  {/* Page 2 content */}
</Page>
```

## Future Enhancements

### Planned Features

- [ ] **Email Delivery** - Send PDF directly to client via email
- [ ] **Share Links** - Generate shareable links to view estimates online
- [ ] **QR Code** - Add QR code linking back to QuickQuote AI
- [ ] **Custom Templates** - Multiple PDF templates (modern, classic, minimal)
- [ ] **Multi-Language Support** - Generate PDFs in different languages
- [ ] **Digital Signatures** - Add signature fields for client approval
- [ ] **Supabase Integration** - Pull company info from user profiles
- [ **Saved Templates** - Save custom PDF settings per user

### Integration with Supabase

Update `getUserCompanyInfo()` in `lib/pdf/generator.ts`:

```typescript
static async getUserCompanyInfo(): Promise<{
  companyName?: string
  companyPhone?: string
  companyEmail?: string
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return {}
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, company_phone, company_email')
    .eq('id', user.id)
    .single()
  
  return {
    companyName: profile?.company_name,
    companyPhone: profile?.company_phone,
    companyEmail: profile?.company_email,
  }
}
```

## Troubleshooting

### PDF Not Generating

**Issue**: Error when clicking "Export PDF"

**Solutions**:
- Check browser console for errors
- Verify all required fields are filled
- Ensure pricing data is available
- Check that `@react-pdf/renderer` is installed

### Preview Not Showing

**Issue**: Blank preview in modal

**Solutions**:
- Check for PDF generation errors in console
- Ensure browser supports `<iframe>` elements
- Try updating preview manually
- Verify blob URL is created correctly

### Download Not Starting

**Issue**: Nothing happens when clicking "Download PDF"

**Solutions**:
- Check browser download permissions
- Verify popup blocker is not interfering
- Try different browser
- Check for JavaScript errors

### Styling Issues

**Issue**: PDF looks broken or poorly formatted

**Solutions**:
- React-PDF uses limited CSS properties
- Use only supported properties (see React-PDF docs)
- Test with simple data first
- Check for overflow issues

## Dependencies

- `@react-pdf/renderer` - PDF generation library
- `@radix-ui/react-dialog` - Modal dialog
- `@radix-ui/react-scroll-area` - Scrollable areas
- React 18+
- Next.js 14+

## License

Part of QuickQuote AI system. See main project license.

---

**Generated by QuickQuote AI** - Professional estimates made simple.

