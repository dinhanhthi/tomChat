import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Search, Settings } from 'lucide-react'
import { Button } from './ui/button'
import Logo from '../../public/logo.svg'

const items = [
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className='divide-y p-0'>
          <div className="flex flex-row items-center px-2">
            <Button variant="ghost" asChild>
              <SidebarTrigger />
            </Button>
            <div className='pl-2 group-data-[collapsible=icon]:opacity-0 font-semibold text-sky-600 flex-1'>xChat</div>
          </div>
          <SidebarGroupContent className='p-2'>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
