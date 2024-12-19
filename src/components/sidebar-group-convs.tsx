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
import { Folder, Forward, MoreHorizontal, Trash2 } from 'lucide-react'
import { SidebarConversation } from '../interface'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

export default function SidebarGroupConvs(props: {
  label: string
  conversations: SidebarConversation[]
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
      <SidebarMenu>
        {props.conversations.map((conversation, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton className='group-data-[collapsible=icon]:opacity-0' asChild>
              <a href="#">
                <span>{conversation.icon}</span>
                <span>{conversation.content}</span>
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
        {props.conversations.length > 10 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>more</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
