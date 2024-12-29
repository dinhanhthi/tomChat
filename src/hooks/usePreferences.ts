'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const stored = localStorage.getItem('userSettings')
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('userSettings', JSON.stringify(updated))
  }

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

  const updateSidebarFilterSettings = (filters: Partial<SidebarFilterSettings>) => {
    updateSettings({
      sidebarFilterSettings: { ...settings.sidebarFilterSettings, ...filters }
    })
  }

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
