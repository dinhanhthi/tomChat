'use client'

import { CircleUserRound, Edit, MessageSquareShare, Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { TokenIcon } from '../icons/TokenIcon'
import OverflowTooltip from './overflow-tooltip'
import { useDialogStore } from './search-dialog'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import SimpleTooltip from './ui/simple-tooltip'

export default function AppHeader() {
  const router = useRouter()
  const { setIsOpen } = useDialogStore()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId
  const { chat } = useChatClient(chatId as string)
  const chatTitle = chat?.title

  return (
    <header className="flex h-14 w-full shrink-0 flex-row items-center justify-between border-b border-slate-200 pl-2 pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="x-flex-1 flex items-center gap-2">
        <div className="flex items-center">
          <SidebarTrigger
            tooltip="Toggle sidebar (⌘+B)"
            tooltipPosition="bottom"
            className="group-data-[collapsible=icon]:opacity-0"
          />
          <Button
            onClick={() => {
              router.push('/')
              router.refresh()
            }}
            variant="ghost"
            size="iconBig"
            tooltip="New chat"
            tooltipPosition="bottom"
          >
            <Edit />
          </Button>
        </div>
        {chatTitle && (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="x-flex-1 truncate pr-4 text-[1.05rem]">
              <OverflowTooltip text={chatTitle} position="bottom" delayDuration={1}></OverflowTooltip>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <SimpleTooltip text="Usage of this chat">
          <div className="flex select-none flex-row divide-x divide-slate-300 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs">
            <div className="flex flex-row flex-nowrap items-center gap-0.5 whitespace-nowrap pr-1.5 text-gray-600">
              <TokenIcon className="h-4 w-4" />
              <span>1.2K</span>
            </div>

            <div className="pl-1.5 text-primary">$15.00</div>
          </div>
        </SimpleTooltip>
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
        {/* <Button variant="ghost" size="iconBig" tooltip="Configs" tooltipPosition="bottom">
          <SlidersHorizontal />
        </Button> */}
        <Button variant="ghost" size="iconBig" tooltip="Profile" tooltipPosition="bottom">
          <CircleUserRound />
        </Button>
      </div>
    </header>
  )
}
