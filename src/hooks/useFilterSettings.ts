import { useEffect, useState } from 'react'

const FILTER_SETTINGS_KEY = 'chat-filter-settings'

export interface SidebarFilter {
  showArchived?: boolean
  showByTags?: boolean
  multipleSelection?: boolean
}

export const useFilterSettings = () => {
  const [settings, setSettings] = useState<SidebarFilter>({
    showArchived: false, 
    showByTags: false,
    multipleSelection: false
  })

  useEffect(() => {
    const stored = localStorage.getItem(FILTER_SETTINGS_KEY)
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const updateSettings = (newSettings: Partial<SidebarFilter>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem(FILTER_SETTINGS_KEY, JSON.stringify(updated))
  }

  return { settings, updateSettings }
}
