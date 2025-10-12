# Price Comparison Feature

## Overview
The Price Comparison feature allows contractors to compare material prices from multiple sources, ensuring they get the best deals and maintain transparent pricing throughout their estimates.

## Features

### 1. **Multi-Source Price Aggregation**
- **User Custom Prices**: Your saved, trusted prices (highest priority)
- **Cached Prices**: Recently fetched market prices (< 7 days old)
- **AI Estimates**: OpenAI-powered market estimates
- **Supplier APIs**: Live pricing from suppliers (when available)

### 2. **Visual Price Comparison**
- Side-by-side comparison of all available prices
- Best price highlighted with green border and checkmark
- Confidence ratings (High/Medium/Low) for each source
- Price range and percentage differences
- Total cost calculations based on quantity

### 3. **Price History & Trends**
- Line charts showing 30/60/90-day price trends
- Price change alerts (>10% variance)
- Average pricing calculations
- Visual indicators for price increases/decreases

### 4. **Smart Features**
- **Auto-select lowest price**: Toggle to automatically use the cheapest option
- **One-click price selection**: Instantly update your estimate
- **Refresh on demand**: Get latest prices whenever needed
- **Potential savings calculation**: See how much you can save

## Components

### Core Components

#### `PriceComparison.tsx`
Main component that displays the price comparison interface.

```tsx
<PriceComparison
  materials={[
    {
      id: 'mat-1',
      name: '2x6 Pressure Treated Lumber',
      category: 'Lumber',
      unit: 'each',
      quantity: 50,
      currentPrice: 12.50
    }
  ]}
  zipCode="90210"
  userId="user-123"
  onPriceSelect={(materialId, price, source) => {
    console.log(`Selected ${source} price: $${price}`)
  }}
  onClose={() => setShowComparison(false)}
/>
```

#### `PriceSourceBadge.tsx`
Visual badges indicating price sources.

```tsx
<PriceSourceBadge source="ai_estimate" />
<PriceSourceBadge source="user_custom" />
<PriceSourceBadge source="cached" />
<PriceSourceBadge source="supplier_api" supplierName="Home Depot" />
```

#### `PriceHistory.tsx`
Historical price trend visualization.

```tsx
<PriceHistory
  materialName="2x6 Pressure Treated Lumber"
  currentPrice={12.50}
  zipCode="90210"
  userId="user-123"
/>
```

### Backend Services

#### `priceAggregator.ts`
Core service for fetching and aggregating prices.

```typescript
import { PriceAggregator } from '@/lib/pricing/priceAggregator'

const aggregator = new PriceAggregator('user-id', '90210')

// Single material
const result = await aggregator.aggregatePrices(
  '2x6 Pressure Treated Lumber',
  'Lumber',
  'each'
)

// Multiple materials
const results = await aggregator.aggregateMultiplePrices([
  { name: 'Material 1', category: 'Cat 1', unit: 'each' },
  { name: 'Material 2', category: 'Cat 2', unit: 'sqft' }
])

// Price history
const history = await aggregator.getPriceHistory(
  '2x6 Pressure Treated Lumber',
  30 // days
)
```

## Database Schema

### Tables

#### `material_prices`
Stores cached material prices from various sources.

```sql
CREATE TABLE material_prices (
  id UUID PRIMARY KEY,
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  zip_code TEXT,
  source_type TEXT NOT NULL,
  supplier_name TEXT,
  confidence TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### `user_material_overrides`
User's custom material prices.

```sql
CREATE TABLE user_material_overrides (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  unit TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  zip_code TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, material_name, zip_code)
);
```

#### `price_alerts`
Price change alerts for users.

```sql
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  material_name TEXT NOT NULL,
  threshold_percentage DECIMAL(5, 2) DEFAULT 10.0,
  last_known_price DECIMAL(10, 2),
  alert_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, material_name)
);
```

## API Endpoints

### POST `/api/pricing/ai-estimate`
Get AI-powered price estimate for a material.

**Request:**
```json
{
  "material_name": "2x6 Pressure Treated Lumber",
  "category": "Lumber",
  "unit": "each",
  "zip_code": "90210"
}
```

**Response:**
```json
{
  "estimated_price": 12.50,
  "confidence": "high",
  "price_range": {
    "low": 11.00,
    "high": 14.00
  },
  "notes": "Based on current market conditions",
  "source": "openai",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Integration Guide

### 1. Add to EstimateReview Component

```tsx
import { useState } from 'react'
import PriceComparison from './PriceComparison'

function EstimateReview({ pricing }) {
  const [showPriceComparison, setShowPriceComparison] = useState(false)

  return (
    <>
      <Button onClick={() => setShowPriceComparison(true)}>
        Compare Prices
      </Button>

      {showPriceComparison && (
        <PriceComparison
          materials={pricing.materials.map(m => ({
            id: m.id,
            name: m.name,
            category: m.category,
            unit: m.unit,
            quantity: m.quantity,
            currentPrice: m.unitPrice
          }))}
          zipCode={userZipCode}
          userId={currentUserId}
          onPriceSelect={(id, price, source) => {
            updateMaterialPrice(id, price, source)
          }}
          onClose={() => setShowPriceComparison(false)}
        />
      )}
    </>
  )
}
```

### 2. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply migration manually
psql -d your_database -f supabase/migrations/005_price_comparison_tables.sql
```

### 3. Environment Variables

Add to `.env.local`:
```
OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Styling

The components use DEWALT theming:
- **Primary Yellow**: `#FFC107` (dewalt-yellow)
- **Dark Background**: `#1a1a1a` (background-secondary)
- **Borders**: `#333` (border)
- **Success Green**: For best prices
- **Warning Orange**: For price increases

## Best Practices

### 1. **Caching Strategy**
- Cache AI estimates for 7 days
- Refresh on demand when needed
- Store user preferences

### 2. **Confidence Levels**
- **High**: User custom prices, recent supplier quotes
- **Medium**: AI estimates, cached prices (< 7 days)
- **Low**: Older cached prices, fallback estimates

### 3. **Price Selection**
- Always show source with each price
- Highlight best price prominently
- Allow manual override
- Show confidence ratings

### 4. **Performance**
- Lazy load price history charts
- Batch price fetching
- Use loading states
- Implement error boundaries

## Future Enhancements

- [ ] Real-time supplier API integrations
- [ ] Bulk material pricing
- [ ] Price negotiation tracking
- [ ] Historical price exports
- [ ] Price alert notifications
- [ ] Regional pricing maps
- [ ] Seasonal price predictions
- [ ] Material substitution suggestions

## Support

For issues or questions:
1. Check component console logs
2. Verify API key configuration
3. Ensure database migrations are applied
4. Check Supabase RLS policies

## License

Part of the QuickQuote AI Estimator system.

