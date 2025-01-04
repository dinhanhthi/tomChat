'use client'

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
      <DialogContent hideCloseBtn={true} className='!rounded-3xl p-6 gap-6 flex flex-col'>
        <DialogHeader className='gap-2'>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription>Current title: <span className='font-medium'>{title}</span></DialogDescription>
        </DialogHeader>
        <Input
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
