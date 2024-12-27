'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import {
  Archive,
  ArchiveX,
  MessageCircle,
  MessageSquareShare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useChatStore } from '../hooks/useChatStore'
import { useUserPreferences } from '../hooks/usePreferences'
import { Chat } from '../interface'
import { removeChat } from '../lib/chats'
import { xtoast } from '../lib/xtoast'
import { useAlertDialog } from './dialog-confirm'
import OverflowTooltip from './overflow-tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export default function SidebarGroupChats(props: { label: string; chats?: Chat[] }) {
  const { label, chats = [] } = props
  const { togglePin, toggleArchive, isPinned, isArchived } = useUserPreferences()
  const { isMobile } = useSidebar()
  const { showAlert } = useAlertDialog()
  const router = useRouter()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId

  const handleRemoveChat = (chat: Chat) => async () => {
    showAlert({
      title: 'Delete Chat',
      description: `Are you sure you want to delete **${chat.title}**?`,
      confirmText: 'Delete',
      confirmClassName: 'bg-danger hover:bg-danger-hover text-white',
      onConfirm: async () => {
        await removeChat(chat.id)
        router.push('/')
        xtoast.info(`Chat **${chat.title}** has been deleted!`)
      }
    })
  }

  return (
    <>
      {chats.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 bg-sidebar z-20 text-sidebar-primary">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {chats.map((chat, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={chat.id === chatId}
                  className="group-data-[collapsible=icon]:opacity-0 text-sm hover:bg-[#e9e9e9] data-[active=true]:bg-[#e9e9e9]"
                  asChild
                >
                  <Link href={`/chat/${chat.id}`}>
                    {chat.icon && <span>{chat.icon}</span>}
                    {!chat.icon && <MessageCircle />}
                    <OverflowTooltip className="select-none" text={chat.title}></OverflowTooltip>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover tooltip="Options">
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-fit rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <MessageSquareShare className="text-muted-foreground" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePin(chat.id)}>
                      {isPinned(chat.id) && (
                        <>
                          <PinOff className="text-muted-foreground" />
                          <span>Unpin</span>
                        </>
                      )}
                      {!isPinned(chat.id) && (
                        <>
                          <Pin className="h-5 w-5 text-muted-foreground" />
                          <span>Pin</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleArchive(chat.id)}>
                      {isArchived(chat.id) && (
                        <>
                          <ArchiveX className="text-muted-foreground" />
                          <span>Unarchived</span>
                        </>
                      )}
                      {!isArchived(chat.id) && (
                        <>
                          <Archive className="text-muted-foreground" />
                          <span>Archive</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={handleRemoveChat(chat)} className="text-danger hover:!text-danger">
                      <Trash2 />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            {chats.length > 10 && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>more</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
}
