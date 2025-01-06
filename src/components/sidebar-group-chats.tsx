'use client'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
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
import { useState } from 'react'
import { useChatStore } from '../hooks/useChatStore'
import { Chat } from '../interface'
import { removeChat, toggleChatStatus, updateChatMeta } from '../lib/chats'
import { xtoast } from '../lib/xtoast'
import { useAlertDialog } from './dialog-confirm'
import { RenameDialog } from './dialog-rename'
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
  const [renameChat, setRenameChat] = useState<Chat | null>(null)

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

  const handleRename = async (newTitle: string) => {
    if (!renameChat) return
    await updateChatMeta(renameChat.id, 'title', newTitle)
    xtoast.success('Chat renamed successfully!')
  }

  const renderDropdownContent = (chat: Chat) => (
    <>
      <DropdownMenuItem>{shareComponent(chat)}</DropdownMenuItem>
      {chat.pinned && ['true', 'false'].includes(chat.pinned) && (
        <DropdownMenuItem onClick={e => handleTogglePin(e, chat)}>{pinComponent(chat)}</DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => setRenameChat(chat)}>{renameComponent(chat)}</DropdownMenuItem>
      {chat.archived && ['true', 'false'].includes(chat.archived) && (
        <DropdownMenuItem onClick={e => handleToggleArchive(e, chat)}>{archiveComponent(chat)}</DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={handleRemoveChat(chat)} className="text-danger hover:!text-danger">
        {deleteComponent(chat)}
      </DropdownMenuItem>
    </>
  )

  const deleteComponent = (chat: Chat) => (
    <>
      <Trash2 className="mr-2" />
      <span>Delete</span>
    </>
  )

  const renderContextContent = (chat: Chat) => (
    <>
      <ContextMenuItem>{shareComponent(chat)}</ContextMenuItem>
      {chat.pinned && ['true', 'false'].includes(chat.pinned) && (
        <ContextMenuItem onClick={e => handleTogglePin(e, chat)}>{pinComponent(chat)}</ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => setRenameChat(chat)}>{renameComponent(chat)}</ContextMenuItem>
      {chat.archived && ['true', 'false'].includes(chat.archived) && (
        <ContextMenuItem onClick={e => handleToggleArchive(e, chat)}>{archiveComponent(chat)}</ContextMenuItem>
      )}
      <ContextMenuItem onClick={handleRemoveChat(chat)} className="text-danger hover:!text-danger">
        {deleteComponent(chat)}
      </ContextMenuItem>
    </>
  )

  return (
    <>
      {chats.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 z-20 bg-sidebar text-sidebar-primary">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {chats.map((chat, index) => (
              <SidebarMenuItem key={index}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <SidebarMenuButton
                      isActive={chat.id === chatId}
                      className="hover:!bg-sidebar-hover group-hover/menu-item:!bg-sidebar-hover text-sm data-[active=true]:bg-gray-200 group-data-[collapsible=icon]:opacity-0"
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
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-fit rounded-lg p-1" onCloseAutoFocus={e => e.preventDefault()}>
                    {renderContextContent(chat)}
                  </ContextMenuContent>
                </ContextMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover className="z-20 bg-white">
                      <Settings2 />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  {chat.pinned === 'true' && chat.archived !== 'true' && (
                    <Pin className="absolute right-1.5 top-2 z-10 h-4 w-4 group-focus-within/menu-item:opacity-0 group-hover/menu-item:opacity-0 peer-data-[state=open]:opacity-0" />
                  )}
                  {chat.archived === 'true' && (
                    <Archive className="absolute right-1.5 top-2 z-10 h-4 w-4 group-focus-within/menu-item:opacity-0 group-hover/menu-item:opacity-0 peer-data-[state=open]:opacity-0" />
                  )}
                  <DropdownMenuContent
                    className="w-fit rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                    onCloseAutoFocus={e => e.preventDefault()}
                  >
                    {renderDropdownContent(chat)}
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
      <RenameDialog
        open={!!renameChat}
        onOpenChange={open => !open && setRenameChat(null)}
        title={renameChat?.title || ''}
        onRename={handleRename}
      />
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

const pinComponent = (chat: Chat) => {
  return (
    <>
      {chat.pinned === 'true' ? (
        <>
          <PinOff className="mr-1 text-muted-foreground" />
          <span>Unpin</span>
        </>
      ) : (
        <>
          <Pin className="mr-1 text-muted-foreground" />
          <span>Pin</span>
        </>
      )}
    </>
  )
}

const shareComponent = (chat: Chat) => {
  return (
    <>
      <MessageSquareShare className="mr-1 text-muted-foreground" />
      <span>Share</span>
    </>
  )
}

const renameComponent = (chat: Chat) => {
  return (
    <>
      <Pencil className="mr-1 text-muted-foreground" />
      <span>Rename</span>
    </>
  )
}

const archiveComponent = (chat: Chat) => {
  return (
    <>
      {chat.archived === 'true' ? (
        <>
          <ArchiveX className="mr-1 text-muted-foreground" />
          <span>Unarchive</span>
        </>
      ) : (
        <>
          <Archive className="mr-1 text-muted-foreground" />
          <span>Archive</span>
        </>
      )}
    </>
  )
}
