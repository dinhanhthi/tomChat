import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Search, Settings } from 'lucide-react'
import Image from 'next/image'
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
      <SidebarContent className='h-full'>
        <SidebarGroup className="divide-y p-0 h-full">
          <div className="flex flex-row items-center px-3 py-2 gap-4">
            <Image src={Logo} alt="xChat" width={23} height={23} className='shrink-0' />
            <div className="group-data-[collapsible=icon]:opacity-0 flex-1 flex flex-col">
              <div className='font-semibold text-sky-600 text-lg'>xChat</div>
              <div className='text-xs text-slate-400 font-mono'>v0.0.0</div>
            </div>
          </div>

          <SidebarGroupContent className="p-2 items-center justify-center min-h-0 flex-1">
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
