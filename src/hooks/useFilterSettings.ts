import { useEffect, useState } from 'react'

const FILTER_SETTINGS_KEY = 'chat-filter-settings'

export interface FilterSettings {
  showPinned: boolean
  showArchived: boolean
  sortByCreatedDate: boolean
}

export const useFilterSettings = () => {
  const [settings, setSettings] = useState<FilterSettings>({
    showPinned: false,
    showArchived: false,
    sortByCreatedDate: true
  })

  useEffect(() => {
    const stored = localStorage.getItem(FILTER_SETTINGS_KEY)
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const updateSettings = (newSettings: Partial<FilterSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem(FILTER_SETTINGS_KEY, JSON.stringify(updated))
  }

  return { settings, updateSettings }
}
