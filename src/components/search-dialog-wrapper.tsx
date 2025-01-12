'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import dynamic from 'next/dynamic'
import { create } from 'zustand'

interface SearchDialogStore {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useSearchDialogStore = create<SearchDialogStore>(set => ({
  isOpen: false,
  setIsOpen: open => set({ isOpen: open })
}))

const SearchDialog = dynamic(() => import('./search-dialog'), {
  ssr: false,
  loading: () => null
})

export default function SearchDialogWrapper() {
  const { isOpen, setIsOpen } = useSearchDialogStore()

  return (
    <TooltipProvider>
      <SearchDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </TooltipProvider>
  )
}
