import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BRAND_NAME } from '../lib/constants'
import { useChatClient } from './useChatClient'
import { useChatIdStore } from './useChatIdStore'

interface PageTitle {
  title: string
  icon?: string | LucideIcon // Can be emoji string or Lucide icon component
  isEmoji?: boolean // Helper to determine icon type
}

export function usePageTitle(): PageTitle {
  const pathname = usePathname()
  const { chatId } = useChatIdStore()
  const { chat } = useChatClient(chatId as string)

  useEffect(() => {
    if (pathname === '/admin') {
      document.title = `Admin configs | ${BRAND_NAME}`
    } else if (pathname === '/') {
      document.title = `Create a new chat | ${BRAND_NAME}`
    } else if (pathname.startsWith('/chat/') && chat) {
      document.title = `${chat.title} | ${BRAND_NAME}`
    }
  }, [pathname, chat])

  // if (pathname === '/admin') {
  //   return {
  //     title: 'Admin configs',
  //     icon: Settings,
  //     isEmoji: false
  //   }
  // }

  if (pathname === '/') {
    return { title: 'Create a new chat' }
  }

  if (pathname.startsWith('/chat/') && chat) {
    return {
      title: chat.title,
      icon: chat.icon,
      isEmoji: true
    }
  }

  return { title: '' }
}
