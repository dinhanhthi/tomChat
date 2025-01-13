import { Settings } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useChatClient } from './useChatClient'
import { useChatStore } from './useChatStore'

interface PageTitle {
  title: string
  icon?: string | LucideIcon  // Can be emoji string or Lucide icon component
  isEmoji?: boolean          // Helper to determine icon type
}

export function usePageTitle(): PageTitle {
  const pathname = usePathname()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId
  const { chat } = useChatClient(chatId as string)

  if (pathname === '/admin') {
    return { 
      title: 'Admin configs',
      icon: Settings,
      isEmoji: false
    }
  }

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
