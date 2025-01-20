'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TagData } from '../hooks/useTagStore'
import { NO_TAG } from '../lib/constants'
import TagIndicator from './tag-indicator'
import { SIDEBAR_WIDTH } from './ui/sidebar'

export function TagSelector({
  tags,
  selectedTagName,
  setSelectedTagName,
  className
}: {
  tags: TagData[]
  selectedTagName: string
  setSelectedTagName: (tag: string) => void
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  const editedTags = [{ name: NO_TAG, color: '#666666' }, ...tags.sort((a, b) => a.name.localeCompare(b.name))]
  const selectedTag = editedTags.find(tag => tag.name === selectedTagName)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-8 w-full justify-between px-2 text-xs', className)}
        >
          <div className="flex flex-1 items-center gap-1.5">
            {selectedTag && <TagIndicator tagColor={selectedTag?.color} />}
            {selectedTag ? selectedTag.name : 'Select tag...'}
          </div>
          <ChevronsUpDown className="h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH
          } as React.CSSProperties
        }
        className="w-[calc(var(--sidebar-width)-20px)] p-0"
      >
        <Command>
          <CommandInput className="h-8" placeholder="Search tag..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {editedTags.map(tag => (
                <CommandItem
                  className="flex items-center gap-2"
                  key={tag.name}
                  value={tag.name}
                  onSelect={currentname => {
                    setSelectedTagName(currentname === selectedTagName ? '' : currentname)
                    setOpen(false)
                  }}
                >
                  <TagIndicator tagColor={tag.color} />
                  {tag.name}
                  <Check className={cn('ml-auto', selectedTagName === tag.name ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
