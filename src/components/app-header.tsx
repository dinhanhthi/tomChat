'use client'

import { CircleUserRound, Edit, MessageSquareShare, Search, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDialogStore } from './search-dialog'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

export default function AppHeader() {
  const router = useRouter()
  const { setIsOpen } = useDialogStore()

  function handleNewClicked() {
    router.push('/')
    router.refresh()
  }

  return (
    <header className="flex flex-row justify-between items-center pl-2 pr-4 h-14 shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <SidebarTrigger
            tooltip="Toggle sidebar (⌘+B)"
            tooltipPosition="bottom"
            className="group-data-[collapsible=icon]:opacity-0"
          />
          <Button onClick={handleNewClicked} variant="ghost" size="iconBig" tooltip="New chat" tooltipPosition="bottom">
            <Edit />
          </Button>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">Some useful title</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="iconBig"
          tooltip="Search chat (⌘+K)"
          tooltipPosition="bottom"
        >
          <Search />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Share this chat" tooltipPosition="bottom">
          <MessageSquareShare />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Configs" tooltipPosition="bottom">
          <SlidersHorizontal />
        </Button>
        <Button variant="ghost" size="iconBig" tooltip="Profile" tooltipPosition="bottom">
          <CircleUserRound />
        </Button>
      </div>
    </header>
  )
}
