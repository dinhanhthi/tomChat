import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ChatStore {
  chatId: string
  setChatId: (id: string) => void
}

const useStore = create<ChatStore>()(
  persist(
    set => ({
      chatId: uuidv4(),
      setChatId: (id: string) => set({ chatId: id })
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

export const useChatStore = () => {
  const pathname = usePathname()
  const store = useStore()

  // Protect against hydration errors
  const isClient = typeof window !== 'undefined'
  if (!isClient) return store

  useEffect(() => {
    if (pathname === '/') {
      store.setChatId(uuidv4())
    } else if (/^\/chat\/[^\/]+$/.test(pathname)) {
      const chatId = pathname.split('/').pop()!
      store.setChatId(chatId)
    } else {
      store.setChatId('')
    }
  }, [pathname])

  return store
}
