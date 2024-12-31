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
import { useFilterSettings } from '../hooks/useFilterSettings'
import { useUserPreferences } from '../hooks/usePreferences'
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
  const { isArchived, isPinned } = useUserPreferences()
  const { settings, updateSettings } = useFilterSettings()
  const { chats } = useChats()

  const filteredChats = (chats || []).filter(chat => {
    if (settings.showPinned) return isPinned(chat.id)
    if (settings.showArchived) return isArchived(chat.id)
    return !isArchived(chat.id) // Default view: non-archived chats
  })

  const sortedChats = settings.sortByCreatedDate
    ? [...filteredChats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : filteredChats

  useEffect(() => {
    if (chats) {
      setIsLoading(false)
    }
  }, [chats])

  const getLabel = (key: string) => {
    return SPECIAL_LABELS[key] || key
  }

  const backToHome = () => {
    router.push('/')
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
        <FilterButton settings={settings} onSettingsChange={updateSettings} />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {!isLoading && (
          <>
            {!!sortedChats.length && <SidebarGroupChats label="Filtered Chats" chats={sortedChats} />}
            {/* {chats?.length && !isFilterEnabled && (
              <>
                {processedChats instanceof Map &&
                  Array.from(processedChats).map(
                    ([key, chats]) =>
                      chats.length > 0 && (
                        <SidebarGroupChats 
                          key={`${key}-${JSON.stringify(filterSettings)}`} 
                          label={getLabel(key)} 
                          chats={chats} 
                        />
                      )
                  )}
              </>
            )} */}
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
