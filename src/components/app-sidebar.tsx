'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { BadgeInfo, BookOpenText, Bug, Github, Lightbulb, LoaderCircle, ScrollText } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from '../../public/logo.svg'
import { useChats } from '../hooks/useChats'
import { filterChats } from '../lib/utils'
import SidebarGroupChats from './sidebar-group-chats'
import { Button } from './ui/button'

const SPECIAL_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  prev3days: 'Previous 3 days',
  prev7days: 'Previous 7 days',
  prev30days: 'Previous 30 days'
}

export function AppSidebar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const backToHome = () => {
    router.push('/')
  }

  const { chats } = useChats()
  const filteredChats = filterChats(chats)

  useEffect(() => {
    if (chats) {
      setIsLoading(false)
    }
  }, [chats])

  const getLabel = (key: string) => {
    return SPECIAL_LABELS[key] || key
  }

  return (
    <Sidebar className='x-min-hw-0' collapsible="offcanvas">
      <SidebarHeader className="flex h-14 flex-row gap-2 justify-betweens">
        <div className="flex items-center flex-row gap-2 flex-1">
          <button onClick={backToHome} className="flex flex-row whitespace-nowrap flex-nowrap items-center">
            <div className="p-2 rounded-lg">
              <Image src={Logo} alt="xChat" width={20} height={20} className="shrink-0" />
            </div>
            <div className="text-sidebar-primary text-sm font-medium">xChat</div>
          </button>
          <div className="text-[0.6rem] text-slate-600 font-mono border border-slate-300 rounded-lg px-2">v0.0.0</div>
        </div>
        <Button variant="ghost" size="iconBig" tooltip="Source code" tooltipPosition="bottom">
          <Github />
        </Button>
      </SidebarHeader>

      <SidebarSeparator />

      {/* <SearchForm className="pb-2" /> */}

      <SidebarContent>
        {!isLoading && (
          <>
            {Array.from(filteredChats).map(
              ([key, chats]) => chats.length > 0 && <SidebarGroupChats key={key} label={getLabel(key)} chats={chats} />
            )}

            {!chats?.length && (
              <div className="flex items-center justify-center text-slate-400 h-full px-6">No chat saved!</div>
            )}
          </>
        )}
        {isLoading && (
          <div className="flex items-center justify-center h-full animate-pulse">
            <LoaderCircle className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        )}
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
