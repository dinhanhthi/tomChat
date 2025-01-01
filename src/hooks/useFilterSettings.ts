import { useEffect, useState } from 'react'

const FILTER_SETTINGS_KEY = 'chat-filter-settings'

export interface FilterSettings {
  showArchived: boolean
}

export const useFilterSettings = () => {
  const [settings, setSettings] = useState<FilterSettings>({
    showArchived: false
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
