'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Utensils, Bath, Calculator, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

interface EstimatorSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export default function EstimatorSelector({ isOpen, onClose }: EstimatorSelectorProps) {
  const { t } = useI18n()

  const estimators = [
    {
      id: 'deck',
      titleKey: 'dashboard.quickActions.deckEstimate',
      descriptionKey: 'dashboard.quickActions.deckDescription',
      icon: Home,
      href: '/estimator/deck',
      available: true
    },
    {
      id: 'kitchen',
      titleKey: 'dashboard.quickActions.kitchenEstimate',
      descriptionKey: 'dashboard.quickActions.kitchenDescription',
      icon: Utensils,
      href: '/estimator/kitchen',
      available: true
    },
    {
      id: 'bathroom',
      titleKey: 'dashboard.quickActions.bathroomEstimate',
      descriptionKey: 'dashboard.quickActions.bathroomDescription',
      icon: Bath,
      href: '/estimator/bathroom',
      available: true
    },
    {
      id: 'custom',
      titleKey: 'navigation.customEstimate',
      descriptionKey: 'estimates.newEstimateDescription',
      icon: Calculator,
      href: '/estimates/new',
      available: true
    }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div 
          className="bg-white w-full md:max-w-2xl md:rounded-2xl shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {t('estimates.newEstimate', { fallback: 'New Estimate' })}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {t('dashboard.quickActions.description', { fallback: 'Choose an estimator type' })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background-secondary transition-colors"
            >
              <X className="w-5 h-5 text-text-tertiary" />
            </button>
          </div>

          {/* Estimator Options */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            {estimators.map((estimator) => {
              const Icon = estimator.icon
              
              if (!estimator.available) {
                return (
                  <div
                    key={estimator.id}
                    className="p-6 rounded-xl border-2 border-border bg-background-secondary cursor-not-allowed opacity-60"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 bg-background-tertiary rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-text-tertiary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">
                          {t(estimator.titleKey)}
                        </h3>
                        <p className="text-sm text-text-tertiary">
                          {t(estimator.descriptionKey)}
                        </p>
                        <span className="inline-block mt-2 text-xs px-3 py-1 bg-dewalt-yellow/20 text-dewalt-yellow rounded-full font-semibold">
                          {t('common.soon', { fallback: 'Coming Soon' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={estimator.id}
                  href={estimator.href}
                  onClick={onClose}
                  className="group p-6 rounded-xl border-2 border-border hover:border-dewalt-yellow bg-white hover:bg-dewalt-yellow/5 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-dewalt-yellow/10 group-hover:bg-dewalt-yellow rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-dewalt-yellow group-hover:text-dewalt-black transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary mb-1 group-hover:text-dewalt-yellow transition-colors">
                        {t(estimator.titleKey)}
                      </h3>
                      <p className="text-sm text-text-tertiary">
                        {t(estimator.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-background-secondary/50">
            <p className="text-xs text-text-tertiary text-center">
              💡 {t('dashboard.gettingStarted.description', { fallback: 'More estimator types coming soon!' })}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

