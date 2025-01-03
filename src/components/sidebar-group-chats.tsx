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
  Settings2,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useChatStore } from '../hooks/useChatStore'
import { Chat } from '../interface'
import { removeChat, toggleChatStatus } from '../lib/chats'
import { xtoast } from '../lib/xtoast'
import { useAlertDialog } from './dialog-confirm'
import OverflowTooltip from './overflow-tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export default function SidebarGroupChats(props: { label: string; chats?: Chat[] }) {
  const { label, chats = [] } = props
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

  const handleTogglePin = async (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation()
    await toggleChatStatus(chat.id, 'pinned', chat.pinned === 'true' ? 'false' : 'true')
  }

  const handleToggleArchive = async (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation()
    await toggleChatStatus(chat.id, 'archived', chat.archived === 'true' ? 'false' : 'true')
  }

  return (
    <>
      {chats.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 z-20 bg-sidebar text-sidebar-primary">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {chats.map((chat, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={chat.id === chatId}
                  className="hover:!bg-sidebar-hover data-[active=true]:bg-gray-200 text-sm group-data-[collapsible=icon]:opacity-0"
                  asChild
                >
                  <Link href={`/chat/${chat.id}`}>
                    {chat.icon && <span>{chat.icon}</span>}
                    {!chat.icon && <MessageCircle />}
                    <OverflowTooltip
                      className="select-none"
                      text={chat.title}
                      position="right"
                      delayDuration={700}
                    ></OverflowTooltip>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover tooltip="Options" className="bg-sidebar-hover z-20">
                      <Settings2 />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  {chat.pinned === 'true' && chat.archived !== 'true' && (
                    <Pin className="absolute right-1 top-2 z-10 h-4 w-4 group-focus-within/menu-item:opacity-0 group-hover/menu-item:opacity-0 peer-data-[state=open]:opacity-0" />
                  )}
                  {chat.archived === 'true' && (
                    <Archive className="absolute right-1 top-2 z-10 h-4 w-4 group-focus-within/menu-item:opacity-0 group-hover/menu-item:opacity-0 peer-data-[state=open]:opacity-0" />
                  )}
                  <DropdownMenuContent
                    className="w-fit rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                    onCloseAutoFocus={e => e.preventDefault()}
                  >
                    <DropdownMenuItem>
                      <MessageSquareShare className="text-muted-foreground" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={e => handleTogglePin(e, chat)}>
                      {chat.pinned === 'true' && (
                        <>
                          <PinOff className="text-muted-foreground" />
                          <span>Unpin</span>
                        </>
                      )}
                      {(chat.pinned === 'false' || !chat.pinned) && (
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
                    <DropdownMenuItem onClick={e => handleToggleArchive(e, chat)}>
                      {chat.archived === 'true' && (
                        <>
                          <ArchiveX className="text-muted-foreground" />
                          <span>Unarchived</span>
                        </>
                      )}
                      {chat.archived !== 'true' && (
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

export function SidebarGroupChatsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <Skeleton className="h-3 w-1/4 rounded-xl bg-slate-200" />
      <div className="flex w-full flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-row items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
            <Skeleton className="h-4 w-full rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
