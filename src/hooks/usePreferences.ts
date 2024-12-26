import { useEffect, useState } from 'react'

interface UserPreferences {
  starredChatIds: string[]
  archivedChatIds: string[]
  theme?: string
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userPreferences')
    return stored ? JSON.parse(stored) : { starredChatIds: [], archivedChatIds: [] }
  })

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }, [preferences])

  const toggleStar = (chatId: string) => {
    setPreferences(prev => {
      const starred = prev.starredChatIds
      const newStarred = starred.includes(chatId)
        ? starred.filter(id => id !== chatId)
        : [...starred, chatId]
      return { ...prev, starredChatIds: newStarred }
    })
  }

  const toggleArchive = (chatId: string) => {
    setPreferences(prev => {
      const archived = prev.archivedChatIds
      const newArchived = archived.includes(chatId)
        ? archived.filter(id => id !== chatId)
        : [...archived, chatId]
      return { ...prev, archivedChatIds: newArchived }
    })
  }

  return {
    preferences,
    toggleStar,
    toggleArchive,
    isStarred: (id: string) => preferences.starredChatIds.includes(id),
    isArchived: (id: string) => preferences.archivedChatIds.includes(id)
  }
}
