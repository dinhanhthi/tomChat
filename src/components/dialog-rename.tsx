'use client'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onRename: (newTitle: string) => Promise<void>
}

export function RenameDialog({ open, onOpenChange, title, onRename }: RenameDialogProps) {
  const [newTitle, setNewTitle] = useState(title)
  const [isLoading, setIsLoading] = useState(false)

  const handleRename = async () => {
    if (newTitle.trim() === '' || newTitle === title) return
    setIsLoading(true)
    await onRename(newTitle.trim())
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseBtn={true} className="flex flex-col gap-4 px-6 py-4">
        <DialogHeader className="gap-2">
          <VisuallyHidden.Root>
            <DialogTitle>Rename Chat</DialogTitle>
          </VisuallyHidden.Root>
          <DialogDescription className="text-foreground">
            Current title: <span className="font-medium">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          className="mb-2 rounded-none border-x-0 border-t-0 px-2 pb-0 !text-base"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Enter new title"
          onKeyDown={e => e.key === 'Enter' && handleRename()}
        />
        <DialogFooter className="flex gap-2">
          <Button className="rounded-3xl" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="rounded-3xl"
            onClick={handleRename}
            disabled={isLoading || newTitle.trim() === '' || newTitle === title}
          >
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
