import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { BadgeInfo, BookOpenText, Bug, Github, Lightbulb, ScrollText } from 'lucide-react'
import Image from 'next/image'
import Logo from '../../public/logo.svg'
import { SearchForm } from './search-form'
import SidebarGroupConvs from './sidebar-group-convs'
import { Button } from './ui/button'

const conversations = [
  { icon: '🐷', content: 'Create Bar Chart with some example very long line' },
  { icon: '🐵', content: 'Create Line Chart with some example very long line' },
  { icon: '🐶', content: 'Create Pie Chart with some example very long line' },
  { icon: '🐱', content: 'Create Doughnut Chart with some example very long line' },
  { icon: '🐭', content: 'Create Radar Chart with some example very long line' },
  { icon: '🐹', content: 'Create Polar Area Chart with some example very long line' },
  { icon: '🐰', content: 'Create Bubble Chart with some example very long line' },
  { icon: '🐷', content: 'Create Bar Chart with some example very long line' },
  { icon: '🐵', content: 'Create Line Chart with some example very long line' },
  { icon: '🐶', content: 'Create Pie Chart with some example very long line' },
  { icon: '🐱', content: 'Create Doughnut Chart with some example very long line' },
  { icon: '🐭', content: 'Create Radar Chart with some example very long line' },
  { icon: '🐹', content: 'Create Polar Area Chart with some example very long line' },
  { icon: '🐰', content: 'Create Bubble Chart with some example very long line' },
  { icon: '🐷', content: 'Create Bar Chart with some example very long line' },
  { icon: '🐵', content: 'Create Line Chart with some example very long line' },
  { icon: '🐶', content: 'Create Pie Chart with some example very long line' },
  { icon: '🐱', content: 'Create Doughnut Chart with some example very long line' },
  { icon: '🐭', content: 'Create Radar Chart with some example very long line' },
  { icon: '🐹', content: 'Create Polar Area Chart with some example very long line' },
  { icon: '🐰', content: 'Create Bubble Chart with some example very long line' }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-row gap-2 justify-betweens">
        <div className="flex items-center flex-row gap-2 flex-1">
          <div className="flex flex-row whitespace-nowrap flex-nowrap items-center">
            <div className="p-2 rounded-lg">
              <Image src={Logo} alt="xChat" width={20} height={20} className="shrink-0" />
            </div>
            <div className="text-slate-600 text-sm font-medium">xChat</div>
          </div>
          <div className="text-[0.6rem] text-slate-600 font-mono border border-slate-300 rounded-lg px-2">v0.0.0</div>
        </div>
        <Button variant="ghost" size="iconBig" tooltip="Source code" tooltipPosition="bottom">
          <Github />
        </Button>
      </SidebarHeader>

      <SearchForm className="pb-2" />

      <SidebarContent>
        <SidebarGroupConvs label="Today" conversations={conversations.slice(0, 4)}></SidebarGroupConvs>
        <SidebarGroupConvs label="Previous 30 days" conversations={conversations}></SidebarGroupConvs>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="flex flex-row items-center justify-evenly">
        <Button variant="ghost" size="iconBig" tooltip="About" tooltipPosition="bottom">
          <BadgeInfo />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Documentation" tooltipPosition="bottom">
          <BookOpenText />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Changelog" tooltipPosition="bottom">
          <ScrollText />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Bug report" tooltipPosition="bottom">
          <Bug />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Feature request" tooltipPosition="bottom">
          <Lightbulb />
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
