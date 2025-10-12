# Error Handling & Loading States Guide

This guide explains how to use QuickQuote AI's comprehensive error handling and loading state system.

## 📦 Components

### 1. LoadingSpinner
DEWALT-themed animated loading spinner.

```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Basic usage
<LoadingSpinner />

// With text
<LoadingSpinner text="Loading projects..." />

// Different sizes
<LoadingSpinner size="sm" />  // Small
<LoadingSpinner size="md" />  // Medium (default)
<LoadingSpinner size="lg" />  // Large

// Full-screen overlay
<LoadingSpinner fullScreen text="Generating PDF..." />
```

### 2. LoadingButton
Button with built-in loading state.

```tsx
import { LoadingButton } from '@/components/ui/LoadingButton'

function MyForm() {
  const [loading, setLoading] = useState(false)
  
  return (
    <LoadingButton 
      loading={loading}
      loadingText="Saving..."
      onClick={handleSave}
    >
      Save Changes
    </LoadingButton>
  )
}
```

### 3. ErrorBoundary
React error boundary that catches JavaScript errors anywhere in the component tree.

```tsx
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Wrap your app or specific sections
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// Using HOC
import { withErrorBoundary } from '@/components/ui/ErrorBoundary'

export default withErrorBoundary(MyComponent)
```

### 4. Toast Notifications
Already exists! Shows success, error, warning, and info messages.

```tsx
import { ToastContainer, Toast } from '@/components/ui/toast'

function MyComponent() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])
  }
  
  return (
    <>
      <ToastContainer toasts={toasts} onClose={(id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }} />
      
      <button onClick={() => showToast('success', 'Saved successfully!')}>
        Save
      </button>
    </>
  )
}
```

### 5. EmptyState
Beautiful empty state component for when there's no data.

```tsx
import { EmptyState } from '@/components/ui/EmptyState'
import { FolderKanban, Plus } from 'lucide-react'

<EmptyState
  icon={FolderKanban}
  title="No projects yet"
  description="Create your first project to get started with QuickQuote AI"
  actionLabel="Create Project"
  onAction={() => router.push('/projects/new')}
  secondaryActionLabel="Learn More"
  onSecondaryAction={() => window.open('/docs')}
/>
```

### 6. OfflineBanner
Automatic banner that appears when user goes offline.

```tsx
// Already integrated in root layout!
// Shows automatically when network connection is lost
// Dismisses when connection is restored
```

## 🛠️ Utility Functions

### Error Handling Utilities

```typescript
import {
  handleAuthError,
  handleAIError,
  handleNetworkError,
  handleDatabaseError,
  handleValidationError,
  handleGenericError,
  getErrorMessage,
  isRetryableError,
} from '@/lib/utils/errorHandling'

// Usage examples:

// 1. Authentication errors
try {
  await signIn(credentials)
} catch (error) {
  const friendlyError = handleAuthError(error)
  setErrorMessage(friendlyError.message)
  if (friendlyError.suggestion) {
    setSuggestion(friendlyError.suggestion)
  }
}

// 2. AI/OpenAI errors
try {
  const response = await fetch('/api/ai')
} catch (error) {
  const friendlyError = handleAIError(error)
  // Shows: "Our AI assistant is experiencing high demand right now."
  // Instead of: "Rate limit exceeded: 429"
}

// 3. Database errors
try {
  await deleteProject(id)
} catch (error) {
  const friendlyError = handleDatabaseError(error)
  // Shows: "This item is linked to other data and cannot be deleted."
  // Instead of: "Foreign key constraint violation: 23503"
}

// 4. Validation errors
const error = handleValidationError('Email', 'email')
// Returns: "Please enter a valid email address"

// 5. Generic errors (auto-detects error type)
try {
  await someOperation()
} catch (error) {
  const friendlyError = handleGenericError(error)
  alert(friendlyError.message)
  
  if (friendlyError.canRetry) {
    showRetryButton()
  }
}

// 6. Simple error message
try {
  await someOperation()
} catch (error) {
  const message = getErrorMessage(error)
  toast.error(message)
}

// 7. Check if error is retryable
try {
  await someOperation()
} catch (error) {
  if (isRetryableError(error)) {
    // Show retry button
  } else {
    // Show contact support
  }
}
```

## 📋 Common Patterns

### Form Submission with Loading & Error Handling

```tsx
function MyForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await saveData(formData)
      toast.success('Saved successfully!')
      router.push('/success')
    } catch (err) {
      const friendlyError = handleGenericError(err)
      setError(friendlyError.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-status-error/10 border border-status-error rounded-lg">
          <p className="text-sm text-status-error">{error}</p>
        </div>
      )}
      
      <LoadingButton loading={loading} loadingText="Saving...">
        Save
      </LoadingButton>
    </form>
  )
}
```

### Data Fetching with Loading & Empty States

```tsx
function MyList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await fetchItems()
      if (data) {
        setItems(data)
      } else if (error) {
        const friendlyError = handleDatabaseError(error)
        setError(friendlyError.message)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <LoadingSpinner text="Loading..." />
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-status-error mb-4">{error}</p>
        <Button onClick={loadData}>Try Again</Button>
      </div>
    )
  }
  
  if (items.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No items yet"
        description="Get started by creating your first item"
        actionLabel="Create Item"
        onAction={() => router.push('/new')}
      />
    )
  }
  
  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  )
}
```

### Async Operation with Feedback

```tsx
async function handleDelete(id: string) {
  if (!confirm('Are you sure?')) return
  
  const toastId = toast.info('Deleting...')
  
  try {
    await deleteItem(id)
    toast.success('Deleted successfully!', { id: toastId })
    await refresh()
  } catch (error) {
    const friendlyError = handleDatabaseError(error)
    toast.error(friendlyError.message, { id: toastId })
    
    if (friendlyError.canRetry) {
      // Show retry button
    }
  }
}
```

## 🎨 Best Practices

### 1. Always Show Progress
```tsx
// ❌ Bad - User doesn't know what's happening
<Button onClick={handleSave}>Save</Button>

// ✅ Good - Clear feedback
<LoadingButton loading={saving} loadingText="Saving...">
  Save
</LoadingButton>
```

### 2. Use Friendly Error Messages
```tsx
// ❌ Bad - Technical jargon
catch (error) {
  alert(error.message) // "FOREIGN_KEY_VIOLATION: 23503"
}

// ✅ Good - User-friendly
catch (error) {
  const friendlyError = handleDatabaseError(error)
  alert(friendlyError.message) // "This item is linked to other data..."
}
```

### 3. Provide Context & Solutions
```tsx
// ❌ Bad - No context
<EmptyState title="No data" />

// ✅ Good - Context + Action
<EmptyState
  title="No projects yet"
  description="Create your first project to start building estimates"
  actionLabel="Create Project"
  onAction={createProject}
/>
```

### 4. Handle Edge Cases
```tsx
// ✅ Cover all states
if (loading) return <LoadingSpinner />
if (error) return <ErrorDisplay error={error} onRetry={retry} />
if (!data) return <EmptyState />
return <DataDisplay data={data} />
```

## 🚀 Integration Checklist

When adding a new feature, make sure to:

- [ ] Add loading spinner for async operations >0.5s
- [ ] Show error messages with friendly text
- [ ] Provide empty states with clear CTAs
- [ ] Disable buttons during loading
- [ ] Give success feedback after operations
- [ ] Handle network/offline errors
- [ ] Add retry options for retriable errors
- [ ] Test error scenarios

## 📝 Translation Keys

Add these keys to `en.json` and `es.json`:

```json
{
  "loading": {
    "saving": "Saving...",
    "deleting": "Deleting...",
    "loading": "Loading...",
    "generating": "Generating...",
    "fetching": "Fetching prices..."
  },
  "errors": {
    "generic": "Something went wrong",
    "tryAgain": "Please try again",
    "contactSupport": "Contact support if this continues"
  },
  "emptyStates": {
    "noData": "No data available",
    "createFirst": "Create your first item to get started"
  }
}
```

## 🎯 Examples in Codebase

Check these files for real examples:
- `components/auth/LoginForm.tsx` - Form with loading & error handling
- `app/(dashboard)/projects/page.tsx` - List with loading, empty state, errors
- `components/ui/*` - All UI components

---

**Remember**: Good error handling makes users feel confident and in control. Always prioritize clear communication over technical accuracy!

