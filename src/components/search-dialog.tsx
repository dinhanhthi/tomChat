'use client'

import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { useConversations } from '../hooks/useConversations'

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
  const { conversations } = useConversations(query)

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:min-w-[680px] md:max-w-[680px] !rounded-2xl !p-0"
        overlayClassName="bg-transparent"
        hideCloseBtn={true}
      >
        <DialogTitle className="hidden">Hidden Title</DialogTitle>
        <DialogDescription className="hidden">Hidden Description</DialogDescription>
        <div className="h-full flex flex-col">
          <div className="ml-6 mr-4 flex max-h-[64px] min-h-[64px] items-center justify-between">
            <input
              ref={inputRef}
              className="w-full border-none bg-transparent placeholder:text-token-text-tertiary focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Search chats..."
              value={query}
              onChange={e => handleOnchangeInput(e)}
              onKeyDown={e => handleKeyDown(e)}
            />
            <Button variant="ghost" size="icon" className='rounded-full group'>
              <X className="h-4 w-4 opacity-50 group-hover:opacity-100 text-slate-800" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
