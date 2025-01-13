import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

const FILTER_SETTINGS_KEY = 'chat-filter-settings'

export interface SidebarFilter {
  onlyArchived?: boolean
  alsoArchived?: boolean
  showByTags?: boolean
  multipleSelection?: boolean
  showTagIndicators?: boolean
}

const defaultSettings: SidebarFilter = {
  onlyArchived: false,
  alsoArchived: false,
  showByTags: false,
  multipleSelection: false,
  showTagIndicators: false
}

export const useFilterSettings = () => {
  const [settings, setSettings] = useState<SidebarFilter>(defaultSettings)

  useEffect(() => {
    const stored = localStorage.getItem(FILTER_SETTINGS_KEY)
    if (stored) {
      try {
        const parsedSettings: SidebarFilter = JSON.parse(stored)
        // Only pick properties defined in SidebarFilter interface
        const filteredSettings: SidebarFilter = {
          onlyArchived: parsedSettings.onlyArchived ?? defaultSettings.onlyArchived,
          alsoArchived: parsedSettings.alsoArchived ?? defaultSettings.alsoArchived,
          showByTags: parsedSettings.showByTags ?? defaultSettings.showByTags,
          multipleSelection: parsedSettings.multipleSelection ?? defaultSettings.multipleSelection,
          showTagIndicators: parsedSettings.showTagIndicators ?? defaultSettings.showTagIndicators
        }
        setSettings(filteredSettings)
      } catch (e) {
        console.error('Error parsing stored settings:', e)
        setSettings(defaultSettings)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<SidebarFilter>) => {
    const updated = { ...settings, ...newSettings }

    if (newSettings.showByTags) {
      updated.onlyArchived = false
    }

    if (newSettings.onlyArchived) {
      updated.showByTags = false
    }

    const filteredUpdate: SidebarFilter = {
      onlyArchived: updated.onlyArchived,
      alsoArchived: updated.alsoArchived,
      showByTags: updated.showByTags,
      multipleSelection: updated.multipleSelection,
      showTagIndicators: updated.showTagIndicators
    }
    setSettings(filteredUpdate)
    localStorage.setItem(FILTER_SETTINGS_KEY, JSON.stringify(filteredUpdate))
  }

  const isChanged = useMemo(() => !isEqual(settings, defaultSettings), [settings])

  return { settings, updateSettings, isChanged }
}
