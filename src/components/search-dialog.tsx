'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Command } from 'cmdk'
import { debounce } from 'lodash'
import { Archive, MessageCircle, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useChats } from '../hooks/useChats'
import { useSearchChats } from '../hooks/useSearchChats'
import { MODAL_RADIUS, N_WELCOME_SEARCH_RESULTS } from '../lib/constants'
import { cn, groupChatsByDates } from '../lib/utils'
import { SPECIAL_HISTORY_LABELS } from './app-sidebar'
import OverflowTooltip from './overflow-tooltip'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'

interface SearchDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchContentProps {
  onOpenChange: (open: boolean) => void
}

// This component only renders when dialog is open
const SearchContent = ({ onOpenChange }: SearchContentProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [queryToSearch, setQueryToSearch] = useState(query)
  const { searchChats } = useSearchChats(queryToSearch)
  const { chats: recentChats } = useChats({ limit: N_WELCOME_SEARCH_RESULTS })
  const groupedChats = groupChatsByDates(queryToSearch === '' ? recentChats : searchChats)

  const getLabel = (key: string) => {
    return SPECIAL_HISTORY_LABELS[key] || key
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const debounceSearch = useCallback(
    debounce(value => triggerSearch(value), 500),
    [query]
  )

  function triggerSearch(value: string) {
    setQueryToSearch(value)
  }

  const handleItemClick = (chatId: string) => {
    onOpenChange(false)
    router.push(`/chat/${chatId}`)
  }

  return (
    <Command className="flex h-full flex-col divide-y divide-slate-200 overflow-hidden" shouldFilter={false} loop>
      <div className="ml-6 mr-4 flex max-h-14 min-h-14 items-center justify-between border-none">
        <Command.Input
          ref={inputRef}
          className="placeholder:text-token-text-tertiary w-full border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0"
          placeholder="Search chats..."
          value={query}
          onValueChange={value => {
            setQuery(value)
            debounceSearch(value)
          }}
        />
        <Button
          onClick={() => onOpenChange(false)}
          variant="ghost"
          size="iconBig"
          className="group rounded-full"
          tooltip="Close search (ESC)"
        >
          <X className="text-slate-800 opacity-50 group-hover:opacity-100" />
        </Button>
      </div>
      <Command.List className="min-h-0 flex-1 overflow-y-auto">
        <Command.Empty className="px-4 py-2 text-sm text-slate-500">No chat found!</Command.Empty>
        {Array.from(groupedChats).map(
          ([key, chats]) =>
            chats.length > 0 && (
              <Command.Group key={key} heading={getLabel(key)} className="p-2 text-xs">
                {chats.map(chat => (
                  <Command.Item
                    key={chat.id}
                    value={chat.id}
                    className="group mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                    onSelect={() => handleItemClick(chat.id)}
                    onClick={() => handleItemClick(chat.id)}
                  >
                    {chat.icon ? <span>{chat.icon}</span> : <MessageCircle className="h-4 w-4" />}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <OverflowTooltip
                        className="select-none"
                        text={chat.title}
                        position="top"
                        delayDuration={700}
                        textHighlight={chat.searchResult?.highlightedTitle}
                      ></OverflowTooltip>
                      {chat.searchResult?.highlightedContent && (
                        <div
                          className="line-clamp-1 overflow-hidden text-xs text-slate-500"
                          dangerouslySetInnerHTML={{ __html: chat.searchResult.highlightedContent }}
                        ></div>
                      )}
                    </div>
                    {chat.updatedAt && (
                      <div className="hidden text-xs text-slate-500 group-hover:block group-data-[selected=true]:block">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                    {chat.archived === 'true' && <Archive className="h-4 w-4 text-gray-500" />}
                  </Command.Item>
                ))}
              </Command.Group>
            )
        )}
      </Command.List>
    </Command>
  )
}

export default function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            'h-[min(80svh,440px)] max-w-[80%] overflow-hidden border-none !p-0 shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:min-w-[680px] md:max-w-[680px]',
            MODAL_RADIUS
          )}
          hideCloseBtn={true}
        >
          <VisuallyHidden.Root>
            <DialogTitle>Search Chats</DialogTitle>
            <DialogDescription>Search through your chat history</DialogDescription>
          </VisuallyHidden.Root>
          {isOpen && <SearchContent onOpenChange={onOpenChange} />}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
