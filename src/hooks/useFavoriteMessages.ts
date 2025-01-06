import { useEffect, useState } from 'react'

const FAVORITE_MESSAGES_KEY = 'chat-favorite-messages'

export const useFavoriteMessages = () => {
  const [favoriteMessageIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITE_MESSAGES_KEY)
    if (stored) {
      setFavoriteIds(JSON.parse(stored))
    }
  }, [])

  const toggleFavoriteMessage = (messageId: string) => {
    const updated = favoriteMessageIds.includes(messageId)
      ? favoriteMessageIds.filter(id => id !== messageId)
      : [...favoriteMessageIds, messageId]

    setFavoriteIds(updated)
    localStorage.setItem(FAVORITE_MESSAGES_KEY, JSON.stringify(updated))
  }

  const isFavoriteMessage = (messageId: string) => favoriteMessageIds.includes(messageId)

  return { favoriteMessageIds, toggleFavoriteMessage, isFavoriteMessage }
}
