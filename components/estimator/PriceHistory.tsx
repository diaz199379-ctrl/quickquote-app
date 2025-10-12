/**
 * Price History Component
 * Shows price trends over time with charts
 */

'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { PriceAggregator } from '@/lib/pricing/priceAggregator'

interface PriceHistoryProps {
  materialName: string
  currentPrice: number
  zipCode: string
  userId: string
}

export default function PriceHistory({ materialName, currentPrice, zipCode, userId }: PriceHistoryProps) {
  const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30)
  const [historyData, setHistoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [priceChange, setPriceChange] = useState<{ amount: number; percentage: number } | null>(null)

  useEffect(() => {
    loadPriceHistory()
  }, [materialName, timeRange])

  const loadPriceHistory = async () => {
    setLoading(true)
    try {
      const aggregator = new PriceAggregator(userId, zipCode)
      const history = await aggregator.getPriceHistory(materialName, timeRange)

      // Format data for chart
      const chartData = history.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.price,
        source: item.source
      }))

      setHistoryData(chartData)

      // Calculate price change
      if (history.length > 0) {
        const oldestPrice = history[0].price
        const change = currentPrice - oldestPrice
        const percentage = (change / oldestPrice) * 100

        setPriceChange({
          amount: change,
          percentage: percentage
        })
      }
    } catch (error) {
      console.error('Failed to load price history:', error)
    } finally {
      setLoading(false)
    }
  }

  const averagePrice = historyData.length > 0
    ? historyData.reduce((sum, item) => sum + item.price, 0) / historyData.length
    : 0

  const priceAlert = priceChange && Math.abs(priceChange.percentage) > 10

  return (
    <Card className="bg-background-secondary border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-text-primary">Price History</CardTitle>
            <p className="text-sm text-text-tertiary mt-1">{materialName}</p>
          </div>

          {/* Time Range Toggle */}
          <div className="flex gap-1 bg-background-tertiary rounded-lg p-1">
            {[30, 60, 90].map((days) => (
              <Button
                key={days}
                onClick={() => setTimeRange(days as 30 | 60 | 90)}
                variant="ghost"
                size="sm"
                className={cn(
                  'px-3 py-1 text-xs',
                  timeRange === days && 'bg-dewalt-yellow text-dewalt-black hover:bg-dewalt-yellow'
                )}
              >
                {days}d
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-text-tertiary">Loading price history...</div>
          </div>
        ) : historyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-tertiary">No price history available</p>
              <p className="text-xs text-text-tertiary mt-1">Data will appear as prices are tracked</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Price Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-background-tertiary rounded-lg">
                <div className="text-xs text-text-tertiary">Current</div>
                <div className="text-lg font-bold text-text-primary">
                  ${currentPrice.toFixed(2)}
                </div>
              </div>

              <div className="p-3 bg-background-tertiary rounded-lg">
                <div className="text-xs text-text-tertiary">Average</div>
                <div className="text-lg font-bold text-text-primary">
                  ${averagePrice.toFixed(2)}
                </div>
              </div>

              <div className="p-3 bg-background-tertiary rounded-lg">
                <div className="text-xs text-text-tertiary">Change</div>
                <div className={cn(
                  'text-lg font-bold flex items-center gap-1',
                  priceChange && priceChange.amount > 0 ? 'text-orange-500' : 'text-green-500'
                )}>
                  {priceChange && priceChange.amount > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {priceChange ? `${priceChange.percentage > 0 ? '+' : ''}${priceChange.percentage.toFixed(1)}%` : '-'}
                </div>
              </div>
            </div>

            {/* Price Alert */}
            {priceAlert && (
              <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-text-secondary">
                  <strong className="text-orange-500">Price Alert:</strong> This material's price has changed by more than 10% in the last {timeRange} days.
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#888', fontSize: 11 }}
                    stroke="#444"
                  />
                  <YAxis 
                    tick={{ fill: '#888', fontSize: 11 }}
                    stroke="#444"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#FFC107" 
                    strokeWidth={2}
                    dot={{ fill: '#FFC107', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

