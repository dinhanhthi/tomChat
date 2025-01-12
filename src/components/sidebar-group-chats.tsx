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
  MessageSquareShare,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Settings2,
  Tag,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useChatStore } from '../hooks/useChatStore'
import { SidebarFilter } from '../hooks/useFilterSettings'
import { TagData } from '../hooks/useTagStore'
import { Chat } from '../interface'
import { removeChat, toggleChatStatus, updateChatMeta } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import { useAlertDialog } from './dialog-confirm'
import { RenameDialog } from './dialog-rename'
import { TagsDialog } from './dialog-tags'
import { EmojiPickerButton } from './emoji-picker-button'
import OverflowTooltip from './overflow-tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function SidebarGroupChats(props: {
  label: string
  chats?: Chat[]
  settings?: SidebarFilter
  availableTags?: TagData[]
}) {
  const { label, chats = [], settings, availableTags } = props
  const { isMobile } = useSidebar()
  const { showAlert } = useAlertDialog()
  const router = useRouter()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId
  const [renameChat, setRenameChat] = useState<Chat | null>(null)
  const [emojiPickerChat, setEmojiPickerChat] = useState<Chat | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<Chat | null>(null)
  const [tagsChat, setTagsChat] = useState<Chat | null>(null)

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
      <DropdownMenuItem>{shareComponent()}</DropdownMenuItem>
      {chat.pinned && ['true', 'false'].includes(chat.pinned) && (
        <DropdownMenuItem onClick={e => handleTogglePin(e, chat)}>{pinComponent(chat)}</DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => setRenameChat(chat)}>{renameComponent()}</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTagsChat(chat)}>{tagsComponent()}</DropdownMenuItem>
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
      <ContextMenuItem>{shareComponent()}</ContextMenuItem>
      {chat.pinned && ['true', 'false'].includes(chat.pinned) && (
        <ContextMenuItem onClick={e => handleTogglePin(e, chat)}>{pinComponent(chat)}</ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => setRenameChat(chat)}>{renameComponent()}</ContextMenuItem>
      <ContextMenuItem onClick={() => setTagsChat(chat)}>{tagsComponent()}</ContextMenuItem>
      {chat.archived && ['true', 'false'].includes(chat.archived) && (
        <ContextMenuItem onClick={e => handleToggleArchive(e, chat)}>{archiveComponent(chat)}</ContextMenuItem>
      )}
      <ContextMenuItem onClick={handleRemoveChat(chat)} className="text-danger hover:!text-danger">
        {deleteComponent(chat)}
      </ContextMenuItem>
    </>
  )

  const handleIconChangeBtnClicked = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation()
    e.preventDefault()
    setEmojiPickerChat(chat)
  }

  const handleEmojiSelect = async (emoji: any) => {
    if (!emojiPickerChat) return
    await updateChatMeta(emojiPickerChat.id, 'icon', emoji.native)
    setEmojiPickerChat(null)
  }

  return (
    <>
      {chats.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 z-20 bg-sidebar text-sidebar-primary">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {chats.map((chat, index) => {
              const chatTags: string[] = chat.tags ?? []
              return (
                <SidebarMenuItem key={index}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <SidebarMenuButton
                        isActive={chat.id === chatId}
                        className={cn(
                          'px-1 text-sm hover:!bg-sidebar-hover group-hover/menu-item:!bg-sidebar-hover data-[active=true]:bg-gray-200 group-data-[collapsible=icon]:opacity-0',
                          {
                            '!bg-sidebar-hover': emojiPickerChat?.id === chat.id || dropdownOpen?.id === chat.id
                          }
                        )}
                        asChild
                      >
                        <Link className="flex h-fit flex-row !items-start" href={`/chat/${chat.id}`}>
                          <EmojiPickerButton
                            popupOpen={emojiPickerChat?.id === chat.id}
                            onPopupOpenChange={() => setEmojiPickerChat(null)}
                            currentIcon={chat.icon}
                            onEmojiSelect={handleEmojiSelect}
                            handleBtnClick={e => handleIconChangeBtnClicked(e, chat)}
                            tooltip="Change Icon"
                          />
                          <div className="flex min-w-0 flex-1 flex-col gap-1 leading-4">
                            <OverflowTooltip
                              className="select-none"
                              text={chat.title}
                              position="right"
                              delayDuration={700}
                            />
                            {settings?.showTagIndicators && chatTags && chatTags?.length > 0 && (
                              <div className="flex w-full flex-row items-center gap-1.5 overflow-hidden hover:overflow-auto [&::-webkit-scrollbar]:hidden">
                                {[...chatTags]
                                  .sort((a, b) => a.localeCompare(b))
                                  .map(tag => {
                                    const tagData = availableTags?.find(t => t.name === tag)
                                    return (
                                      <TooltipProvider key={tag} delayDuration={1}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div
                                              className="h-2 w-3 shrink-0 rounded-full"
                                              style={{
                                                backgroundColor: tagData?.color
                                              }}
                                            ></div>
                                          </TooltipTrigger>
                                          <TooltipContent className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap">
                                            <Tag className="h-3 w-3" />
                                            <span>{tag}</span>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )
                                  })}
                              </div>
                            )}
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-fit rounded-lg p-1" onCloseAutoFocus={e => e.preventDefault()}>
                      {renderContextContent(chat)}
                    </ContextMenuContent>
                  </ContextMenu>
                  <DropdownMenu
                    open={dropdownOpen?.id === chat.id}
                    onOpenChange={() => setDropdownOpen(open => (open ? null : chat))}
                  >
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover className={cn('top-1 z-20 h-6 w-6 bg-white hover:!bg-white')}>
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
              )
            })}
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
      <TagsDialog chat={tagsChat} open={!!tagsChat} onOpenChange={open => !open && setTagsChat(null)} />
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

const shareComponent = () => {
  return (
    <>
      <MessageSquareShare className="mr-1 text-muted-foreground" />
      <span>Share</span>
    </>
  )
}

const renameComponent = () => {
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

const tagsComponent = () => {
  return (
    <>
      <Tag className="mr-1 text-muted-foreground" />
      <span>Tags</span>
    </>
  )
}
