'use client'

import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { useChats } from '../hooks/useChats'
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
  const { isOpen, setIsOpen } = useDialogStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const { chats } = useChats(query)

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="!top-24 !rounded-[3rem] !p-0 shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:min-w-[680px] md:max-w-[680px]"
        overlayClassName="bg-black/30"
        hideCloseBtn={true}
      >
        <DialogTitle className="hidden">Hidden Title</DialogTitle>
        <DialogDescription className="hidden">Hidden Description</DialogDescription>
        <div className="flex h-full flex-col">
          <div className="ml-6 mr-4 flex max-h-[64px] min-h-[64px] items-center justify-between">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
