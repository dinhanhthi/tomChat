'use client'

import { Edit } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger, useSidebar } from './ui/sidebar'

export default function AppHeader() {
  const { open } = useSidebar()
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {!open && (
        <>
          <div className="flex items-center">
            <SidebarTrigger className="group-data-[collapsible=icon]:opacity-0" />
            {/* <Button variant="ghost" size="iconBig" tooltip="Search chat (⌘+K)" tooltipPosition="bottom">
              <Search />
            </Button> */}
            <Button variant="ghost" size="iconBig" tooltip="New chat" tooltipPosition="bottom">
              <Edit />
            </Button>
          </div>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}
      <div className="flex items-center gap-2">Some useful title</div>
    </header>
  )
}
