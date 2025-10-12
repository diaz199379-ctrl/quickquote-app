'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SettingsSection from '@/components/settings/SettingsSection'
import { ToastContainer, Toast as ToastType } from '@/components/ui/toast'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Settings as SettingsIcon,
  LogOut,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SettingsTab, CustomMaterialPrice } from '@/types/settings'
import { useI18n } from '@/lib/i18n/context'
import { resetOnboarding } from '@/lib/utils/onboarding'

export default function SettingsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [toasts, setToasts] = useState<ToastType[]>([])
  
  // Profile state
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profile, setProfile] = useState({
    email: 'john@example.com', // Read-only from auth
    company_name: '',
    phone: '',
    address: '',
    zip_code: '',
  })

  // Defaults state
  const [isSavingDefaults, setIsSavingDefaults] = useState(false)
  const [defaults, setDefaults] = useState({
    default_markup_percentage: 20,
    default_labor_rate: 65,
    default_waste_factor: 15,
    preferred_lumber_brand: 'Home Depot PT Lumber',
    preferred_composite_brand: 'Trex',
    preferred_fastener_brand: 'GRK Fasteners',
    preferred_concrete_brand: 'Quikrete',
  })

  // Pricing state
  const [customPrices, setCustomPrices] = useState<CustomMaterialPrice[]>([
    {
      id: '1',
      user_id: 'demo',
      material_name: '2x6 PT Lumber (8ft)',
      category: 'Lumber',
      unit: 'each',
      price: 12.50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  const [useCustomPricing, setUseCustomPricing] = useState(false)

  // Account state
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email_estimates: true,
    email_tips: true,
    email_updates: true,
    email_marketing: false,
  })
  const [language, setLanguage] = useState<'en' | 'es'>('en')

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'defaults', label: t('settings.tabs.defaults'), icon: SettingsIcon },
    { id: 'pricing', label: t('settings.tabs.pricing'), icon: DollarSign },
    { id: 'billing', label: t('settings.tabs.billing'), icon: CreditCard },
    { id: 'account', label: t('settings.tabs.account'), icon: Shield },
  ]

  const showToast = (type: ToastType['type'], message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSavingProfile(false)
    showToast('success', t('settings.messages.profileSaved'))
  }

  const handleSaveDefaults = async () => {
    setIsSavingDefaults(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSavingDefaults(false)
    showToast('success', t('settings.messages.defaultsSaved'))
  }

  const handleAddCustomPrice = () => {
    const newPrice: CustomMaterialPrice = {
      id: Date.now().toString(),
      user_id: 'demo',
      material_name: t('settings.newMaterial', { fallback: 'New Material' }),
      category: t('settings.custom', { fallback: 'Custom' }),
      unit: 'each',
      price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setCustomPrices((prev) => [newPrice, ...prev])
    showToast('success', t('settings.messages.priceAdded', { fallback: 'Custom price added!' }))
  }

  const handleDeleteCustomPrice = (id: string) => {
    if (confirm(t('settings.deleteConfirm', { fallback: 'Delete this custom price?' }))) {
      setCustomPrices((prev) => prev.filter((p) => p.id !== id))
      showToast('success', t('settings.messages.priceDeleted', { fallback: 'Custom price deleted!' }))
    }
  }

  const handleChangePassword = async () => {
    setIsSavingPassword(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSavingPassword(false)
    showToast('success', t('settings.messages.passwordUpdated'))
  }

  const handleDeleteAccount = () => {
    if (
      confirm(t('settings.deleteAccountConfirm'))
    ) {
      showToast('error', t('settings.messages.accountDeletionDemo', { fallback: 'Account deletion is not implemented in demo mode' }))
    }
  }

  const handleLogout = () => {
    if (confirm(t('settings.logoutConfirm', { fallback: 'Are you sure you want to log out?' }))) {
      window.location.href = '/login'
    }
  }

  const handleRestartOnboarding = () => {
    if (confirm(t('settings.restartOnboardingConfirm', { fallback: 'Restart the onboarding tutorial? This will show you the welcome screen and setup wizard again.' }))) {
      resetOnboarding()
      showToast('success', t('settings.messages.onboardingReset', { fallback: 'Onboarding reset! Refresh the page to see it again.' }))
      // Refresh the page after a short delay to show the onboarding
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('settings.title')}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <Card className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                    activeTab === tab.id
                      ? 'bg-dewalt-yellow text-dewalt-black shadow-sm'
                      : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="leading-none">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <SettingsSection
              title={t('settings.profileInfo')}
              description={t('settings.subtitle')}
              onSave={handleSaveProfile}
              isSaving={isSavingProfile}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('settings.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-background-tertiary cursor-not-allowed"
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {t('auth.emailReadOnly', { fallback: 'Email cannot be changed' })}
                  </p>
                </div>

                <div>
                  <Label htmlFor="company_name">{t('settings.companyName')}</Label>
                  <Input
                    id="company_name"
                    placeholder={t('settings.companyName')}
                    value={profile.company_name}
                    onChange={(e) =>
                      setProfile({ ...profile, company_name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('settings.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="address">{t('settings.address')}</Label>
                  <Input
                    id="address"
                    placeholder={t('settings.address')}
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">
                    {t('settings.zipCode')} <span className="text-dewalt-yellow">*</span>
                  </Label>
                  <Input
                    id="zip_code"
                    placeholder="90210"
                    value={profile.zip_code}
                    onChange={(e) =>
                      setProfile({ ...profile, zip_code: e.target.value })
                    }
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {t('settings.zipCodeHelp', { fallback: 'Used for accurate local pricing' })}
                  </p>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Defaults Tab */}
          {activeTab === 'defaults' && (
            <SettingsSection
              title={t('settings.estimatorDefaults')}
              description={t('settings.defaultsDescription', { fallback: 'Set default values for all new estimates' })}
              onSave={handleSaveDefaults}
              isSaving={isSavingDefaults}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="markup">{t('settings.defaultMarkup')}</Label>
                    <Input
                      id="markup"
                      type="number"
                      min="0"
                      max="100"
                      value={defaults.default_markup_percentage}
                      onChange={(e) =>
                        setDefaults({
                          ...defaults,
                          default_markup_percentage: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="labor_rate">{t('settings.defaultLaborRate')}</Label>
                    <Input
                      id="labor_rate"
                      type="number"
                      min="0"
                      value={defaults.default_labor_rate}
                      onChange={(e) =>
                        setDefaults({
                          ...defaults,
                          default_labor_rate: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="waste_factor">{t('settings.defaultWasteFactor')}</Label>
                  <Input
                    id="waste_factor"
                    type="number"
                    min="0"
                    max="50"
                    value={defaults.default_waste_factor}
                    onChange={(e) =>
                      setDefaults({
                        ...defaults,
                        default_waste_factor: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-text-tertiary mt-1">
                    {t('settings.wasteFactorHelp', { fallback: 'Typical range: 10-20% depending on complexity' })}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    {t('settings.preferredBrands')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="lumber_brand">{t('settings.lumber')}</Label>
                      <Input
                        id="lumber_brand"
                        placeholder="e.g., Home Depot PT Lumber"
                        value={defaults.preferred_lumber_brand}
                        onChange={(e) =>
                          setDefaults({
                            ...defaults,
                            preferred_lumber_brand: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="composite_brand">{t('settings.composite')}</Label>
                      <Input
                        id="composite_brand"
                        placeholder="e.g., Trex, TimberTech"
                        value={defaults.preferred_composite_brand}
                        onChange={(e) =>
                          setDefaults({
                            ...defaults,
                            preferred_composite_brand: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="fastener_brand">{t('settings.fasteners')}</Label>
                      <Input
                        id="fastener_brand"
                        placeholder="e.g., GRK, Simpson Strong-Tie"
                        value={defaults.preferred_fastener_brand}
                        onChange={(e) =>
                          setDefaults({
                            ...defaults,
                            preferred_fastener_brand: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="concrete_brand">{t('settings.concrete')}</Label>
                      <Input
                        id="concrete_brand"
                        placeholder="e.g., Quikrete, Sakrete"
                        value={defaults.preferred_concrete_brand}
                        onChange={(e) =>
                          setDefaults({
                            ...defaults,
                            preferred_concrete_brand: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <SettingsSection
              title={t('settings.customPricingTitle')}
              description={t('settings.customPricingDescription')}
              showSaveButton={false}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-secondary">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {t('settings.useCustomPricingLabel')}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {t('settings.useCustomPricingDescription')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomPricing}
                      onChange={(e) => setUseCustomPricing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dewalt-yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dewalt-yellow"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {t('settings.yourCustomPrices')}
                  </h3>
                  <Button size="sm" onClick={handleAddCustomPrice}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('settings.addMaterial')}
                  </Button>
                </div>

                {customPrices.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <DollarSign className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                    <p className="text-sm text-text-secondary mb-4">
                      {t('settings.noCustomPrices')}
                    </p>
                    <Button size="sm" onClick={handleAddCustomPrice}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('settings.addFirstMaterial')}
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-background-secondary">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">
                              {t('settings.material')}
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">
                              {t('settings.category')}
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">
                              {t('settings.unit')}
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">
                              {t('settings.price')}
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">
                              {t('settings.actions')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {customPrices.map((price, index) => (
                            <tr
                              key={price.id}
                              className={cn(
                                'border-t border-border',
                                index % 2 === 0 ? 'bg-white' : 'bg-background-secondary/30'
                              )}
                            >
                              <td className="px-4 py-3 text-sm text-text-primary font-medium">
                                {price.material_name}
                              </td>
                              <td className="px-4 py-3 text-sm text-text-secondary">
                                {price.category}
                              </td>
                              <td className="px-4 py-3 text-sm text-text-secondary">
                                {price.unit}
                              </td>
                              <td className="px-4 py-3 text-sm text-text-primary text-right font-semibold">
                                ${price.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCustomPrice(price.id)}
                                    className="h-8 w-8 p-0 text-status-error hover:text-status-error hover:bg-status-error/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-border">
                      {customPrices.map((price) => (
                        <div key={price.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-text-primary">
                                {price.material_name}
                              </p>
                              <p className="text-sm text-text-tertiary">{price.category}</p>
                            </div>
                            <p className="text-lg font-bold text-text-primary">
                              ${price.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border-light">
                            <span className="text-xs text-text-secondary">
                              {t('settings.per')} {price.unit}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomPrice(price.id)}
                                className="h-8 w-8 p-0 text-status-error hover:text-status-error hover:bg-status-error/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SettingsSection>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <SettingsSection
              title={t('settings.billingTitle')}
              description={t('settings.billingDescription')}
              showSaveButton={false}
            >
              <div className="p-12 text-center border border-dashed border-border rounded-lg">
                <CreditCard className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('settings.billingComingSoon')}
                </h3>
                <p className="text-sm text-text-secondary">
                  {t('settings.billingComingSoonDescription')}
                </p>
              </div>
            </SettingsSection>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Change Password */}
              <SettingsSection
                title={t('settings.changePassword')}
                description={t('settings.changePasswordDescription', { fallback: 'Update your account password' })}
                onSave={handleChangePassword}
                isSaving={isSavingPassword}
                saveButtonText={t('settings.updatePassword')}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current_password">{t('settings.currentPassword')}</Label>
                    <Input id="current_password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new_password">{t('settings.newPassword')}</Label>
                    <Input id="new_password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm_password">{t('settings.confirmPassword')}</Label>
                    <Input id="confirm_password" type="password" />
                  </div>
                </div>
              </SettingsSection>

              {/* Notifications */}
              <SettingsSection
                title={t('settings.emailPreferences')}
                description={t('settings.emailPreferencesDescription', { fallback: 'Choose what emails you want to receive' })}
                showSaveButton={false}
              >
                <div className="space-y-3">
                  {[
                    {
                      key: 'email_estimates',
                      label: t('settings.estimateUpdates'),
                      description: t('settings.estimateUpdatesDescription'),
                    },
                    {
                      key: 'email_tips',
                      label: t('settings.tipsAndTutorials'),
                      description: t('settings.tipsDescription'),
                    },
                    {
                      key: 'email_updates',
                      label: t('settings.productUpdates'),
                      description: t('settings.productUpdatesDescription'),
                    },
                    {
                      key: 'email_marketing',
                      label: t('settings.marketingEmails'),
                      description: t('settings.marketingDescription'),
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        })
                      }
                      className="flex items-center justify-between p-4 rounded-xl border-2 transition-all select-none active:scale-[0.98] text-left w-full"
                      style={{
                        borderColor: notifications[item.key as keyof typeof notifications]
                          ? '#FFCD00'
                          : '#E5E7EB',
                        backgroundColor: notifications[item.key as keyof typeof notifications]
                          ? '#FFFBEB'
                          : '#FAFAFA',
                      }}
                    >
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-text-primary mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-tertiary">{item.description}</p>
                      </div>
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0',
                          notifications[item.key as keyof typeof notifications]
                            ? 'bg-dewalt-yellow scale-100'
                            : 'bg-background-tertiary scale-90 opacity-50'
                        )}
                      >
                        {notifications[item.key as keyof typeof notifications] && (
                          <svg
                            className="w-7 h-7 text-dewalt-black"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </SettingsSection>

              {/* Language */}
              <SettingsSection
                title={t('settings.languageTitle')}
                description={t('settings.languageDescription')}
                showSaveButton={false}
              >
                <div>
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </SettingsSection>

              {/* Help & Tutorial */}
              <SettingsSection
                title={t('settings.helpTutorial', { fallback: 'Help & Tutorial' })}
                description={t('settings.helpTutorialDescription', { fallback: 'Get help or restart the onboarding tutorial' })}
                showSaveButton={false}
              >
                <Button
                  variant="secondary"
                  onClick={handleRestartOnboarding}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('settings.restartOnboarding', { fallback: 'Restart Onboarding' })}
                </Button>
              </SettingsSection>

              {/* Danger Zone */}
              <SettingsSection
                title={t('settings.dangerZone')}
                description={t('settings.dangerZoneDescription')}
                showSaveButton={false}
              >
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('settings.logout')}
                  </Button>

                  <div className="p-4 border-2 border-status-error/20 bg-status-error/5 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-text-primary text-sm">
                          {t('settings.deleteAccount')}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1">
                          {t('settings.deleteAccountWarning')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleDeleteAccount}
                      className="w-full sm:w-auto bg-status-error text-white hover:bg-status-error/90"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('settings.deleteAccount')}
                    </Button>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
