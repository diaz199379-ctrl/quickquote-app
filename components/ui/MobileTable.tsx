'use client'

import { useState } from 'react'
import { Card } from './card'
import { Button } from './button'
import { Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface MobileTableColumn<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  mobileHidden?: boolean
}

interface MobileTableProps<T> {
  data: T[]
  columns: MobileTableColumn<T>[]
  onRowClick?: (item: T) => void
  keyExtractor: (item: T) => string
  emptyMessage?: string
  defaultViewMode?: 'table' | 'card'
  allowViewToggle?: boolean
}

/**
 * Mobile-optimized table that switches between table and card view
 */
export function MobileTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  keyExtractor,
  emptyMessage = 'No data available',
  defaultViewMode = 'card',
  allowViewToggle = true,
}: MobileTableProps<T>) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>(defaultViewMode)

  // Auto-switch to card view on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const activeViewMode = isMobile ? 'card' : viewMode

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Toggle - Hidden on mobile */}
      {allowViewToggle && !isMobile && (
        <div className="flex justify-end gap-2">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="hidden md:flex"
          >
            <List className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === 'card' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('card')}
            className="hidden md:flex"
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Cards
          </Button>
        </div>
      )}

      {/* Table View - Desktop */}
      {activeViewMode === 'table' && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-border rounded-lg">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-background-secondary">
                  <tr>
                    {columns.filter(col => !col.mobileHidden || !isMobile).map((column) => (
                      <th
                        key={String(column.key)}
                        className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {data.map((item) => (
                    <tr
                      key={keyExtractor(item)}
                      onClick={() => onRowClick?.(item)}
                      className={cn(
                        'transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-background-secondary/50 active:bg-background-secondary'
                      )}
                    >
                      {columns.filter(col => !col.mobileHidden || !isMobile).map((column) => (
                        <td
                          key={String(column.key)}
                          className="px-4 py-3 text-sm text-text-primary whitespace-nowrap"
                        >
                          {column.render
                            ? column.render(item)
                            : item[column.key as keyof T]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Card View - Mobile */}
      {activeViewMode === 'card' && (
        <div className="grid grid-cols-1 gap-3">
          {data.map((item) => (
            <Card
              key={keyExtractor(item)}
              className={cn(
                'p-4 transition-all',
                onRowClick && 'cursor-pointer active:scale-[0.98] hover:shadow-md'
              )}
              onClick={() => onRowClick?.(item)}
            >
              <div className="space-y-3">
                {columns.map((column) => {
                  const value = column.render
                    ? column.render(item)
                    : item[column.key as keyof T]

                  return (
                    <div key={String(column.key)} className="flex justify-between items-start gap-4">
                      <span className="text-sm font-medium text-text-secondary min-w-[100px]">
                        {column.label}
                      </span>
                      <span className="text-sm text-text-primary text-right flex-1">
                        {value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

