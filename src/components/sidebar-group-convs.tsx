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
import { Folder, Forward, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import { SearchableConversation } from '../hooks/useConversations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Conversation } from '../interface'

export default function SidebarGroupConvs(props: { label: string; conversations?: Conversation[] }) {
  const { label, conversations = [] } = props
  const { isMobile } = useSidebar()
  return (
    <>
      {conversations.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="sticky top-0 bg-sidebar z-20">{label}</SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {conversations.map((conversation, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton className="group-data-[collapsible=icon]:opacity-0 text-sm" asChild>
                  <a href="#">
                    {conversation.icon && (
                      <span>{conversation.icon}</span>
                    )}
                    {!conversation.icon && (
                      <MessageCircle />
                    )}
                    <span>{conversation.title}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
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
