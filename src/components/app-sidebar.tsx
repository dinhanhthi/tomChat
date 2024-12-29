'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { BadgeInfo, BookOpenText, Bug, Lightbulb, ScrollText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useChats } from '../hooks/useChats'
import { useUserPreferences } from '../hooks/usePreferences'
import { groupChatsByDates } from '../lib/utils'
import XChatBrand from './brand'
import FilterButton from './sidebar-filter'
import SidebarGroupChats, { SidebarGroupChatsSkeleton } from './sidebar-group-chats'
import { Button } from './ui/button'

const SPECIAL_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  prev3days: 'Previous 3 days',
  prev7days: 'Previous 7 days',
  prev30days: 'Previous 30 days'
}

export default function AppSidebar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { togglePin, toggleArchive, isPinned, isArchived, updateSidebarFilterSettings, settings } = useUserPreferences()

  const backToHome = () => {
    router.push('/')
  }

  const { chats } = useChats()
  const filteredChats = groupChatsByDates(chats)

  useEffect(() => {
    if (chats) {
      setIsLoading(false)
    }
  }, [chats])

  const getLabel = (key: string) => {
    return SPECIAL_LABELS[key] || key
  }

  return (
    <Sidebar className="x-min-hw-0" collapsible="offcanvas">
      <SidebarHeader className="justify-betweens flex h-14 flex-row gap-2">
        <div className="flex flex-1 flex-row items-center gap-2 px-2">
          <button onClick={backToHome}>
            <XChatBrand size={24} className="gap-1.5" wrap={false} colored={true} />
          </button>
          <div className="rounded-lg border border-slate-300 px-2 font-mono text-[0.6rem] text-slate-600">v0.0.0</div>
        </div>
        <FilterButton />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {!isLoading && (
          <>
            {Array.from(filteredChats).map(
              ([key, chats]) => chats.length > 0 && <SidebarGroupChats key={key} label={getLabel(key)} chats={chats} />
            )}

            {!chats?.length && (
              <div className="flex h-full items-center justify-center px-6 text-slate-400">No chat saved!</div>
            )}
          </>
        )}
        {isLoading && (
          <div className="flex h-full flex-col gap-4">
            <SidebarGroupChatsSkeleton />
            <SidebarGroupChatsSkeleton />
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
