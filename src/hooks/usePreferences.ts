import { useEffect, useState } from 'react'

interface UserPreferences {
  pinnedChatIds: string[]
  archivedChatIds: string[]
  theme?: string
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userPreferences')
    return stored ? JSON.parse(stored) : { pinnedChatIds: [], archivedChatIds: [] }
  })

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }, [preferences])

  const togglePin = (chatId: string) => {
    setPreferences(prev => {
      const pinned = prev.pinnedChatIds
      const newPinned = pinned.includes(chatId) ? pinned.filter(id => id !== chatId) : [...pinned, chatId]
      return { ...prev, pinnedChatIds: newPinned }
    })
  }

  const toggleArchive = (chatId: string) => {
    setPreferences(prev => {
      const archived = prev.archivedChatIds
      const newArchived = archived.includes(chatId) ? archived.filter(id => id !== chatId) : [...archived, chatId]
      return { ...prev, archivedChatIds: newArchived }
    })
  }

  return {
    preferences,
    togglePin,
    toggleArchive,
    isPinned: (id: string) => preferences.pinnedChatIds?.includes(id),
    isArchived: (id: string) => preferences.archivedChatIds?.includes(id)
  }
}
