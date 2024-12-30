'use client'

import { useEffect, useState, useCallback } from 'react'
import { defaultSidebarFilter, SidebarFilterSettings } from '../components/sidebar-filter'

interface UserSettings {
  pinnedChatIds: string[]
  archivedChatIds: string[]
  sidebarFilterSettings: SidebarFilterSettings
  theme?: string
}

const defaultSettings: UserSettings = {
  pinnedChatIds: [],
  archivedChatIds: [],
  sidebarFilterSettings: defaultSidebarFilter,
  theme: 'light'
}

export function useUserPreferences() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  const loadSettings = useCallback(() => {
    const stored = localStorage.getItem('userSettings')
    if (stored) {
      const parsedSettings = JSON.parse(stored)
      setSettings(parsedSettings)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(current => {
      const updated = { ...current, ...newSettings }
      localStorage.setItem('userSettings', JSON.stringify(updated))
      return updated
    })
  }, [])

  const togglePin = (chatId: string) => {
    const newPinnedIds = settings.pinnedChatIds.includes(chatId)
      ? settings.pinnedChatIds.filter(id => id !== chatId)
      : [...settings.pinnedChatIds, chatId]
    updateSettings({ pinnedChatIds: newPinnedIds })
  }

  const toggleArchive = (chatId: string) => {
    const newArchivedIds = settings.archivedChatIds.includes(chatId)
      ? settings.archivedChatIds.filter(id => id !== chatId)
      : [...settings.archivedChatIds, chatId]
    updateSettings({ archivedChatIds: newArchivedIds })
  }

  const updateSidebarFilterSettings = useCallback((filters: Partial<SidebarFilterSettings>) => {
    updateSettings({
      sidebarFilterSettings: { ...settings.sidebarFilterSettings, ...filters }
    })
  }, [settings.sidebarFilterSettings, updateSettings])

  const sidebarFilterSettings = settings.sidebarFilterSettings

  return {
    settings,
    togglePin,
    toggleArchive,
    isPinned: (id: string) => settings.pinnedChatIds?.includes(id),
    isArchived: (id: string) => settings.archivedChatIds?.includes(id),
    sidebarFilterSettings,
    updateSidebarFilterSettings
  }
}
