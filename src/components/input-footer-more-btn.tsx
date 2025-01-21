'use client'

import { Eraser, Library, ListFilter } from 'lucide-react'
import { useState } from 'react'
import { AppsIcon } from '../icons/AppsIcon'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface InputFooterMoreBtnProps {
  onClearContext: () => void
  onPromptCollection: () => void
  onApps: () => void
  showPromptCollection: boolean
  showApps: boolean
}

export function InputFooterMoreBtn({
  onClearContext,
  onPromptCollection,
  onApps,
  showPromptCollection,
  showApps
}: InputFooterMoreBtnProps) {
  const [open, setOpen] = useState(false)

  const FooterButton = ({ icon: Icon, onClick, tooltip, active }: any) => {
    return (
      <Button
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onClick(e)
          setOpen(false)
        }}
        className={cn(
          'w-full justify-start gap-2 rounded-lg px-2 text-sm font-normal transition-all duration-300 [&_svg]:size-[20px]'
        )}
        variant="ghost"
      >
        <Icon />
        {tooltip}
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg text-gray-600 transition-all duration-300 hover:bg-[#d8d8d8b3] hover:text-gray-800 hover:shadow-sm [&_svg]:size-[20px]"
        >
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 font-normal">
        <div className="flex flex-col gap-1">
          <FooterButton icon={AppsIcon} onClick={onApps} tooltip="Apps" active={showApps} />
          <FooterButton icon={Eraser} onClick={onClearContext} tooltip="Clear context" />
          <FooterButton
            icon={Library}
            onClick={onPromptCollection}
            tooltip="Prompt collection"
            active={showPromptCollection}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
