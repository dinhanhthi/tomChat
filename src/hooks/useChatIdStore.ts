import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ChatStore {
  chatId: string
  conversationId: string
  setChatId: (id: string) => void
  setConversationId: (id: string) => void
}

const useStore = create<ChatStore>()(
  persist(
    set => ({
      chatId: uuidv4(),
      conversationId: uuidv4(),
      setChatId: (id: string) => set({ chatId: id }),
      setConversationId: (id: string) => set({ conversationId: id })
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => {
        // Check if window is defined (client-side)
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return mock storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      })
    }
  )
)

export const useChatIdStore = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const store = useStore()

  // Protect against hydration errors
  const isClient = typeof window !== 'undefined'
  if (!isClient) return store

  useEffect(() => {
    if (pathname === '/') {
      // Generate new IDs for home page
      store.setChatId(uuidv4())
      store.setConversationId(uuidv4())
    } else if (/^\/chat\/[^\/]+/.test(pathname)) {
      // Extract chatId from pathname
      const chatId = pathname.split('/').pop()!
      const conversationId = searchParams.get('convId')

      store.setChatId(chatId)
      if (conversationId) {
        store.setConversationId(conversationId)
      }
    } else {
      // Invalid path, clear both IDs
      store.setChatId('')
      store.setConversationId('')
    }
  }, [pathname])

  return store
}
