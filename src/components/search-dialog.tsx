'use client'

import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { useChats } from '../hooks/useChats'
import { groupChatsByDates } from '../lib/utils'
import { SPECIAL_HISTORY_LABELS } from './app-sidebar'
import SearchGroupChat from './search-group-chat'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'

interface DialogStore {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useDialogStore = create<DialogStore>(set => ({
  isOpen: false,
  setIsOpen: open => set({ isOpen: open })
}))

export default function SearchDialog() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useDialogStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  // const { chats } = useChats({ searchQuery: query, limit: query === '' ? 5 : undefined })
  const { chats } = useChats({ searchQuery: query })
  const groupedChats = groupChatsByDates(chats)

  const getLabel = (key: string) => {
    return SPECIAL_HISTORY_LABELS[key] || key
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    // debounceSearch(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Add keyboard shortcut cmd/ctrl + k to open the search dialog
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-[80%] !rounded-xl !p-0 shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:min-w-[680px] md:max-w-[680px]"
        overlayClassName="bg-black/30"
        hideCloseBtn={true}
      >
        <DialogTitle className="hidden">Hidden Title</DialogTitle>
        <DialogDescription className="hidden">Hidden Description</DialogDescription>
        <div className="flex max-h-[80svh] flex-col divide-y divide-slate-200">
          <div className="ml-6 mr-4 flex max-h-14 min-h-14 items-center justify-between">
            <input
              ref={inputRef}
              className="placeholder:text-token-text-tertiary w-full border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Search chats..."
              value={query}
              onChange={e => handleOnchangeInput(e)}
              onKeyDown={e => handleKeyDown(e)}
            />
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="iconBig" className="group rounded-full">
              <X className="text-slate-800 opacity-50 group-hover:opacity-100" />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4 pt-6">
            {Array.from(groupedChats).map(
              ([key, chts]) => chts.length > 0 && <SearchGroupChat key={key} label={getLabel(key)} chats={chts} />
            )}
            {!chats?.length && <div className="px-2 pb-2 text-sm text-slate-500">No chat found!</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
