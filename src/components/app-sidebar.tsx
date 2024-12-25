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
import { useConversations } from '../hooks/useConversations'
import { filterConversations } from '../lib/utils'
import SidebarGroupConvs from './sidebar-group-convs'
import { Button } from './ui/button'

export function AppSidebar() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const backToHome = () => {
    router.push('/')
  }

  const { conversations } = useConversations()
  const filteredChats = filterConversations(conversations)

  useEffect(() => {
    if (conversations) {
      setIsLoading(false)
    }
  }, [conversations])

  return (
    <Sidebar collapsible="offcanvas">
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
            {filteredChats.today.length > 0 && (
              <SidebarGroupConvs label="Today" conversations={filteredChats.today}></SidebarGroupConvs>
            )}
            {filteredChats.yesterday.length > 0 && (
              <SidebarGroupConvs label="Yesterday" conversations={filteredChats.yesterday}></SidebarGroupConvs>
            )}
            {filteredChats.prev3days.length > 0 && (
              <SidebarGroupConvs label="Previous 3 days" conversations={filteredChats.prev3days}></SidebarGroupConvs>
            )}
            {filteredChats.prev7days.length > 0 && (
              <SidebarGroupConvs label="Previous 7 days" conversations={filteredChats.prev7days}></SidebarGroupConvs>
            )}
            {filteredChats.prev30days.length > 0 && (
              <SidebarGroupConvs label="Previous 30 days" conversations={filteredChats.prev30days}></SidebarGroupConvs>
            )}
            {filteredChats.older.length > 0 && (
              <SidebarGroupConvs label="Older" conversations={filteredChats.older}></SidebarGroupConvs>
            )}
            {!conversations?.length && (
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
