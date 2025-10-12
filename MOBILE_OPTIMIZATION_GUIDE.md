# Mobile Optimization Guide

Complete guide for QuickQuote AI's mobile-first features and optimizations.

## 📱 Mobile Components

### 1. MobileInput
Mobile-optimized input with proper keyboard types and 44px+ touch targets.

```tsx
import { MobileInput } from '@/components/ui/MobileInput'

// Automatic keyboard type based on input type
<MobileInput
  type="number"
  label="Length (feet)"
  placeholder="12"
  helperText="Typical deck length"
/>

// Explicit input mode for better UX
<MobileInput
  type="text"
  inputMode="numeric"
  label="ZIP Code"
  placeholder="90210"
/>

// With icon
<MobileInput
  type="email"
  label="Email"
  icon={<Mail className="w-5 h-5" />}
/>
```

**Input Modes Available:**
- `numeric` - Number pad without decimal
- `decimal` - Number pad with decimal
- `tel` - Phone number pad
- `email` - Email keyboard
- `url` - URL keyboard
- `search` - Search keyboard with "Go" button

### 2. MobileTable
Responsive table that switches to card view on mobile.

```tsx
import { MobileTable } from '@/components/ui/MobileTable'

interface Material {
  name: string
  quantity: number
  unit: string
  price: number
  total: number
}

const columns = [
  { key: 'name', label: 'Material' },
  { key: 'quantity', label: 'Qty' },
  { key: 'unit', label: 'Unit', mobileHidden: true }, // Hide on mobile
  { 
    key: 'price', 
    label: 'Price',
    render: (item) => formatCurrency(item.price)
  },
  {
    key: 'total',
    label: 'Total',
    render: (item) => formatCurrency(item.total)
  },
]

<MobileTable
  data={materials}
  columns={columns}
  keyExtractor={(item) => item.name}
  onRowClick={(item) => editMaterial(item)}
  defaultViewMode="card"
  allowViewToggle={true}
/>
```

### 3. SwipeableCard
Card with swipe gestures for quick actions.

```tsx
import { SwipeableCard } from '@/components/ui/SwipeableCard'

<SwipeableCard
  onDelete={() => deleteItem(id)}
  onArchive={() => archiveItem(id)}
  deleteThreshold={100}
>
  <div className="p-4">
    <h3>{project.name}</h3>
    <p>{project.description}</p>
  </div>
</SwipeableCard>
```

**Gestures:**
- **Swipe Left** (100px+) → Delete (red background)
- **Swipe Right** (100px+) → Archive (green background)
- **Haptic Feedback** on action trigger

### 4. ClickToCall
One-tap phone dialing for mobile devices.

```tsx
import { ClickToCall } from '@/components/ui/ClickToCall'

// Basic usage
<ClickToCall phoneNumber="5551234567" />

// With custom styling
<ClickToCall
  phoneNumber="(555) 123-4567"
  variant="default"
  size="lg"
  showIcon={true}
/>

// Custom content
<ClickToCall phoneNumber="5551234567">
  Call Client
</ClickToCall>
```

**Features:**
- Auto-formats display: `(555) 123-4567`
- Creates `tel:` links for mobile
- Only shows on valid phone numbers (10+ digits)
- Works with any format: `555-123-4567`, `(555) 123-4567`, `5551234567`

### 5. PhotoCapture
Camera and photo upload for site documentation.

```tsx
import { PhotoCapture } from '@/components/ui/PhotoCapture'

<PhotoCapture
  onCapture={(file) => uploadPhoto(file)}
  maxPhotos={10}
  acceptedFormats="image/*"
/>
```

**Features:**
- **Take Photo** - Opens device camera
- **Upload** - Opens file picker
- **Grid Preview** - Shows captured photos
- **Full-Screen Preview** - Tap to enlarge
- **Remove Photos** - X button on hover
- **Progress Indicator** - Shows count (3/10)

## 🎯 Touch Gesture Utilities

### useSwipe Hook

```tsx
import { useSwipe } from '@/lib/utils/touchGestures'

const swipeHandlers = useSwipe({
  onSwipeLeft: () => console.log('Swiped left'),
  onSwipeRight: () => console.log('Swiped right'),
  onSwipeUp: () => console.log('Swiped up'),
  onSwipeDown: () => console.log('Swiped down'),
  threshold: 50, // Minimum distance in px
})

<div {...swipeHandlers}>
  Swipeable content
</div>
```

### useLongPress Hook

```tsx
import { useLongPress } from '@/lib/utils/touchGestures'

const longPressHandlers = useLongPress({
  onLongPress: () => showContextMenu(),
  delay: 500, // ms
})

<div {...longPressHandlers}>
  Long press me
</div>
```

**Features:**
- Haptic feedback on trigger
- Prevents click after long press
- Cancels on movement

### usePullToRefresh Hook

```tsx
import { usePullToRefresh } from '@/lib/utils/touchGestures'

const pullRefreshHandlers = usePullToRefresh(async () => {
  await reloadData()
})

<div {...pullRefreshHandlers} className="min-h-screen">
  <ProjectList />
</div>
```

**Features:**
- Only triggers at top of page
- Visual feedback (element transforms)
- Haptic feedback
- Smooth animation
- Works with any scrollable container

### Haptic Feedback

```tsx
import { hapticFeedback } from '@/lib/utils/touchGestures'

// Light tap
hapticFeedback('light') // 10ms

// Medium vibration
hapticFeedback('medium') // 20ms

// Heavy feedback
hapticFeedback('heavy') // 50ms
```

## ⚡ Performance Utilities

### Lazy Loading

```tsx
import { lazyLoad } from '@/lib/utils/performance'

// Lazy load heavy components
const PDFViewer = lazyLoad(() => import('./PDFViewer'))
const Charts = lazyLoad(() => import('./Charts'))

// With custom loading state
const Dashboard = lazyLoad(
  () => import('./Dashboard'),
  <LoadingSpinner text="Loading dashboard..." />
)

// Use normally
<PDFViewer estimate={estimate} />
```

### Debounce & Throttle

```tsx
import { debounce, throttle } from '@/lib/utils/performance'

// Debounce search input (waits for user to stop typing)
const handleSearch = debounce((query: string) => {
  searchProjects(query)
}, 300)

<input onChange={(e) => handleSearch(e.target.value)} />

// Throttle scroll handler (limits frequency)
const handleScroll = throttle(() => {
  loadMoreItems()
}, 200)

<div onScroll={handleScroll}>...</div>
```

### Image Optimization

```tsx
import { getOptimizedImageUrl, preloadImage } from '@/lib/utils/performance'

// Optimize image URL
const optimizedUrl = getOptimizedImageUrl('/photo.jpg', {
  width: 800,
  quality: 80,
  format: 'webp'
})

<img src={optimizedUrl} alt="Project photo" />

// Preload critical images
useEffect(() => {
  preloadImage('/hero-banner.jpg')
}, [])
```

### Device Detection

```tsx
import { getDeviceInfo, isSlowConnection } from '@/lib/utils/performance'

const device = getDeviceInfo()

if (device.isMobile) {
  // Show mobile UI
}

if (isSlowConnection()) {
  // Reduce image quality
  // Skip animations
  // Defer non-critical features
}
```

### Virtual Scrolling

```tsx
import { getVisibleItems } from '@/lib/utils/performance'

const [scrollTop, setScrollTop] = useState(0)

const { visibleItems, startIndex } = getVisibleItems(
  allItems,
  containerHeight,
  itemHeight,
  scrollTop,
  3 // buffer
)

// Only render visible items
{visibleItems.map((item, index) => (
  <div key={startIndex + index} style={{ height: itemHeight }}>
    {item.name}
  </div>
))}
```

## 📐 Responsive Breakpoints

QuickQuote AI uses these breakpoints:

```css
/* Mobile First Approach */
/* Default: Mobile (320px - 767px) */
.element {
  /* Mobile styles */
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) {
  .element {
    /* Tablet styles */
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .element {
    /* Desktop styles */
  }
}
```

**Tailwind Breakpoints:**
- `sm:` - 640px+ (Small tablets)
- `md:` - 768px+ (Tablets)
- `lg:` - 1024px+ (Small desktops)
- `xl:` - 1280px+ (Large desktops)
- `2xl:` - 1536px+ (Extra large)

## 📱 Touch-Friendly Guidelines

### Minimum Touch Targets
- **44×44px** minimum (iOS standard)
- **48×48px** recommended (Android standard)
- QuickQuote uses **44×44px** minimum for all interactive elements

### Examples:

```tsx
// Button - 44px height
<Button className="h-11">Action</Button>

// Input - 48px height
<MobileInput className="h-12" />

// Icon button - 44px
<button className="w-11 h-11">
  <Icon className="w-5 h-5" />
</button>

// List item - 56px minimum
<div className="py-4"> {/* 16px top + 24px content + 16px bottom = 56px */}
  <ProjectCard />
</div>
```

## 🎨 Mobile-Specific Styling

### Hide/Show Based on Screen Size

```tsx
// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Hide on desktop
<div className="md:hidden">Mobile only</div>

// Different layouts
<div className="flex-col md:flex-row">
  {/* Vertical on mobile, horizontal on desktop */}
</div>
```

### Stack Forms on Mobile

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <MobileInput label="First Name" />
  <MobileInput label="Last Name" />
</div>
{/* Mobile: 1 column, Desktop: 2 columns */}
```

### Responsive Text

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

<p className="text-sm md:text-base">
  Responsive body text
</p>
```

## 🚀 Performance Checklist

When building a new feature, ensure:

- [ ] **Forms**
  - [ ] Use `MobileInput` for proper keyboards
  - [ ] Touch targets are 44×44px minimum
  - [ ] Stack fields on mobile (1 column)
  - [ ] Test with iPhone SE (smallest screen)

- [ ] **Lists**
  - [ ] Use `MobileTable` for data tables
  - [ ] Add pull-to-refresh if data updates
  - [ ] Consider virtual scrolling for 100+ items
  - [ ] Test scrolling performance

- [ ] **Images**
  - [ ] Lazy load below-the-fold images
  - [ ] Use optimized formats (WebP)
  - [ ] Provide responsive sizes
  - [ ] Add loading states

- [ ] **Actions**
  - [ ] Use `SwipeableCard` for delete/archive
  - [ ] Add `ClickToCall` for phone numbers
  - [ ] Include haptic feedback
  - [ ] Test gestures on actual device

- [ ] **Performance**
  - [ ] Lazy load heavy components
  - [ ] Debounce search inputs
  - [ ] Throttle scroll handlers
  - [ ] Check bundle size

- [ ] **Testing**
  - [ ] iPhone SE (320px width)
  - [ ] iPhone 13 Pro (390px width)
  - [ ] iPad (768px width, both orientations)
  - [ ] Android devices
  - [ ] Slow 3G network

## 🔧 Common Patterns

### Responsive Navigation

```tsx
// Desktop: Sidebar + Header
// Mobile: Bottom Nav + Header with hamburger

<div className="min-h-screen pb-16 md:pb-0">
  {/* Mobile: Bottom padding for bottom nav */}
  {/* Desktop: No bottom padding */}
  
  <Header onMobileMenuToggle={toggleSidebar} />
  
  <div className="md:flex">
    <Sidebar className="hidden md:block" />
    <main className="flex-1">
      {children}
    </main>
  </div>
  
  <BottomNav className="md:hidden" />
</div>
```

### Responsive Card Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
```

### Mobile-Optimized Form

```tsx
<form className="space-y-6">
  {/* Stack all fields on mobile */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <MobileInput
      type="text"
      label="Project Name"
      placeholder="Deck Construction"
    />
    <MobileInput
      type="text"
      inputMode="numeric"
      label="ZIP Code"
      placeholder="90210"
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <MobileInput
      type="number"
      inputMode="decimal"
      label="Length"
      placeholder="12"
    />
    <MobileInput
      type="number"
      inputMode="decimal"
      label="Width"
      placeholder="16"
    />
    <MobileInput
      type="number"
      inputMode="decimal"
      label="Height"
      placeholder="2"
    />
  </div>

  <Button type="submit" className="w-full md:w-auto h-12">
    Create Project
  </Button>
</form>
```

### Swipeable List

```tsx
{items.map(item => (
  <SwipeableCard
    key={item.id}
    onDelete={() => handleDelete(item.id)}
    onArchive={() => handleArchive(item.id)}
  >
    <div className="p-4">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-text-secondary">{item.description}</p>
    </div>
  </SwipeableCard>
))}
```

## 🎯 Testing Devices

### Recommended Test Devices:
1. **iPhone SE** (375×667) - Smallest common mobile
2. **iPhone 13 Pro** (390×844) - Common size
3. **iPad** (768×1024) - Tablet, both orientations
4. **Samsung Galaxy S21** (360×800) - Android
5. **Desktop** (1920×1080) - Standard desktop

### Browser DevTools:
- Chrome DevTools → Device Mode
- Safari → Responsive Design Mode
- Firefox → Responsive Design Mode

### Test Checklist:
- [ ] Touch targets are easily tappable
- [ ] Text is readable without zoom
- [ ] Forms work with mobile keyboards
- [ ] Swipe gestures respond naturally
- [ ] Loading states appear for async operations
- [ ] Error states are clear
- [ ] Works in both portrait and landscape
- [ ] No horizontal scrolling (except tables)

---

**Made mobile-first!** ⚡

For questions or issues, check the component examples in `components/ui/` or contact the dev team.

