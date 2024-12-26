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
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { useChatStore } from '../hooks/useChatStore'
import { useUserPreferences } from '../hooks/usePreferences'
import { Conversation } from '../interface'
import { removeConversation } from '../lib/conversations'
import { useAlertDialog } from './dialog-confirm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export default function SidebarGroupConvs(props: { label: string; conversations?: Conversation[] }) {
  const { label, conversations = [] } = props
  const { togglePin, toggleArchive, isPinned, isArchived } = useUserPreferences()
  const { isMobile } = useSidebar()
  const { showAlert } = useAlertDialog()
  const router = useRouter()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId

  const removeChat = (conversation: Conversation) => async () => {
    showAlert({
      title: 'Delete Chat',
      description: `Are you sure you want to delete **${conversation.title}**?`,
      confirmText: 'Delete',
      confirmClassName: 'bg-danger hover:bg-danger-hover text-white',
      onConfirm: async () => {
        await removeConversation(conversation.id)
        router.push('/')
        toast(
          <div className="x-prose dark:prose-invert text-sm">
            <ReactMarkdown>{`Chat **${conversation.title}** has been deleted!`}</ReactMarkdown>
          </div>
        )
      }
    })
  }

  return (
    <>
      {conversations.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 bg-sidebar z-20 text-sidebar-primary">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {conversations.map((conversation, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={conversation.id === chatId}
                  className="group-data-[collapsible=icon]:opacity-0 text-sm hover:bg-[#e9e9e9] data-[active=true]:bg-[#e9e9e9]"
                  asChild
                >
                  <Link href={`/chat/${conversation.id}`}>
                    {conversation.icon && <span>{conversation.icon}</span>}
                    {!conversation.icon && <MessageCircle />}
                    <span className="select-none">{conversation.title}</span>
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
                    <DropdownMenuItem onClick={() => togglePin(conversation.id)}>
                      {isPinned(conversation.id) && (
                        <>
                          <PinOff className="text-muted-foreground" />
                          <span>Unpin</span>
                        </>
                      )}
                      {!isPinned(conversation.id) && (
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
                    <DropdownMenuItem onClick={() => toggleArchive(conversation.id)}>
                      {isArchived(conversation.id) && (
                        <>
                          <ArchiveX className="text-muted-foreground" />
                          <span>Unarchived</span>
                        </>
                      )}
                      {!isArchived(conversation.id) && (
                        <>
                          <Archive className="text-muted-foreground" />
                          <span>Archive</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={removeChat(conversation)} className="text-danger hover:!text-danger">
                      <Trash2 />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            {conversations.length > 10 && (
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
