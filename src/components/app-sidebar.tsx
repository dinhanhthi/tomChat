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
import { Chat } from '../interface'
import { getMonthYearString } from '../lib/utils'
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
  const { settings, updateSettings } = useFilterSettings()
  const { chats } = useChats('', settings)

  useEffect(() => {
    if (chats) {
      setIsLoading(false)
    }
  }, [chats])

  const pinnedChats = chats?.filter(conv => conv.pinned) || []
  const unpinnedChats = chats?.filter(conv => !conv.pinned) || []
  const filteredChats = groupChatsByDates(unpinnedChats)

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
            {/* {!!chats?.length && (
              <SidebarGroupChats label={settings.showArchived ? 'Archived Chats' : 'Recent Chats'} chats={chats} />
            )} */}

            {!!pinnedChats.length && <SidebarGroupChats label="Pinned Chats" chats={pinnedChats} />}

            {Array.from(filteredChats).map(
              ([key, chts]) =>
                chts.length > 0 && <SidebarGroupChats key={key} label={getLabel(key)} chats={chts} />
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

/**
 * Group chats by dates into: today, yesterday, past 3 days, past 7 days, past 30 days, months in current year,
 * and years before current year
 */
function groupChatsByDates(chats: Chat[] = []): Map<string, Chat[]> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const currentYear = now.getFullYear()

  // Initialize time-based groups
  const yesterday = new Date(today)
  const prev3days = new Date(today)
  const prev7days = new Date(today)
  const prev30days = new Date(today)

  yesterday.setDate(today.getDate() - 1)
  prev3days.setDate(today.getDate() - 3)
  prev7days.setDate(today.getDate() - 7)
  prev30days.setDate(today.getDate() - 30)

  const groups = new Map<string, Chat[]>()

  groups.set(
    'today',
    chats.filter(conv => new Date(conv.updatedAt) >= today)
  )
  groups.set(
    'yesterday',
    chats.filter(conv => new Date(conv.updatedAt) >= yesterday && new Date(conv.updatedAt) < today)
  )
  groups.set(
    'prev3days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev3days && new Date(conv.updatedAt) < yesterday)
  )
  groups.set(
    'prev7days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev7days && new Date(conv.updatedAt) < prev3days)
  )
  groups.set(
    'prev30days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev30days && new Date(conv.updatedAt) < prev7days)
  )

  // Group by months for current year
  chats.forEach(conv => {
    const date = new Date(conv.updatedAt)
    if (date.getFullYear() === currentYear && date < prev30days) {
      const key = getMonthYearString(date)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)?.push(conv)
    }
  })

  // Group by years for older chats
  chats.forEach(conv => {
    const date = new Date(conv.updatedAt)
    if (date.getFullYear() < currentYear) {
      const key = date.getFullYear().toString()
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)?.push(conv)
    }
  })

  return groups
}
