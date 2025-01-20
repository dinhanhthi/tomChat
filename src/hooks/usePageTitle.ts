import { LucideIcon, Settings } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useChatClient } from './useChatClient'
import { useChatIdStore } from './useChatIdStore'
import { BRAND_NAME } from '../lib/constants'

interface PageTitle {
  title: string
  icon?: string | LucideIcon // Can be emoji string or Lucide icon component
  isEmoji?: boolean // Helper to determine icon type
}

export function usePageTitle(): PageTitle {
  const pathname = usePathname()
  const { id } = useParams()
  const { chatId } = useChatIdStore()
  const { chat } = useChatClient(chatId as string)

  if (pathname === '/admin') {
    document.title = `Admin configs | ${BRAND_NAME}`
    return {
      title: 'Admin configs',
      icon: Settings,
      isEmoji: false
    }
  }

  if (pathname === '/') {
    document.title = `Create a new chat | ${BRAND_NAME}`
    return { title: 'Create a new chat' }
  }

  if (pathname.startsWith('/chat/') && chat) {
    document.title = `${chat.title} | ${BRAND_NAME}`
    return {
      title: chat.title,
      icon: chat.icon,
      isEmoji: true
    }
  }

  return { title: '' }
}
