import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CommandEmpty } from 'cmdk'
import { useEffect, useState } from 'react'
import { useTagStore } from '../hooks/useTagStore'
import { Chat } from '../interface'
import { updateChatMeta } from '../lib/chats'
import { generatePastelColor, getTagStringColor } from '../lib/utils'
import { TagBadge } from './tag-badge'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

interface TagsDialogProps {
  chat: Chat | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TagsDialog({ chat, open, onOpenChange }: TagsDialogProps) {
  const [chatTags, setChatTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const { tags: availableTags, addTags } = useTagStore()

  useEffect(() => {
    if (chat && open) {
      // Parse tags from JSON string or use empty array if undefined/invalid
      try {
        const parsedTags = chat.tags ? JSON.parse(chat.tags as unknown as string) : []
        setChatTags(Array.isArray(parsedTags) ? parsedTags : [])
      } catch (e) {
        console.warn('Failed to parse chat tags:', e)
        setChatTags([])
      }
    }
  }, [chat, open])

  const handleSave = async () => {
    if (!chat) return

    // Save new tags to localStorage
    const newTags = chatTags.filter(tag => !availableTags.some(t => t.name === tag))
    if (newTags.length > 0) {
      addTags(newTags)
    }

    // Update chat tags
    await updateChatMeta(chat.id, 'tags', JSON.stringify(chatTags))
    onOpenChange(false)
  }

  const normalizeString = (str: string) => str.toLowerCase().trim()

  const showCreateOption =
    inputValue &&
    !availableTags.some(tag => normalizeString(tag.name) === normalizeString(inputValue)) &&
    !chatTags.some(tag => normalizeString(tag) === normalizeString(inputValue))

  const handleSelectTag = (tag: string) => {
    if (!chatTags.some(t => normalizeString(t) === normalizeString(tag))) {
      setChatTags([...chatTags, tag.trim()])
    }
    setInputValue('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setChatTags(tags => tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' &&
      inputValue &&
      !chatTags.some(tag => normalizeString(tag) === normalizeString(inputValue))
    ) {
      setChatTags([...chatTags, inputValue.trim()])
      setInputValue('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" hideCloseBtn={true}>
        <DialogHeader>
          <DialogTitle>Assign tags to chat</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Chat: <span className="font-medium text-foreground">{chat?.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {chatTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chatTags.map(tag => {
                const tagData = availableTags.find(t => t.name === tag)
                return (
                  <TagBadge
                    key={tag}
                    name={tag}
                    color={tagData?.color || generatePastelColor()}
                    onRemove={() => handleRemoveTag(tag)}
                  />
                )
              })}
            </div>
          )}

          <Command className="rounded-lg border border-slate-200 shadow-sm">
            <CommandInput
              placeholder="Type to search or create new tag..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>
                {/*
                    There is an error when we type space, the real create new tag item disappears and empty section shows up instead. this div is a fake only shown when a space is typed.
                  */}
                <div className="p-1 text-foreground">
                  <div className="group">
                    <div
                      onSelect={() => handleSelectTag(inputValue)}
                      className="relative flex cursor-default select-none items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                      data-selected="true"
                      data-value={inputValue}
                      aria-selected="true"
                    >
                      <span className="whitespace-nowrap">Create new tag:</span>{' '}
                      <span className="ml-1 font-medium">{inputValue}</span>
                    </div>
                  </div>
                </div>
              </CommandEmpty>

              {showCreateOption && (
                <CommandGroup>
                  <CommandItem
                    value={inputValue}
                    onSelect={() => handleSelectTag(inputValue)}
                    className="items-start text-sm"
                  >
                    <span className="whitespace-nowrap">Create new tag:</span>{' '}
                    <span className="ml-1 font-medium">{inputValue}</span>
                  </CommandItem>
                </CommandGroup>
              )}

              {availableTags.length > 0 && (
                <CommandGroup heading="Available Tags">
                  {availableTags
                    .filter(
                      tag =>
                        normalizeString(tag.name).includes(normalizeString(inputValue)) &&
                        !chatTags.some(chatTag => normalizeString(chatTag) === normalizeString(tag.name))
                    )
                    .sort()
                    .map(tag => (
                      <CommandItem
                        key={tag.name}
                        onSelect={() => handleSelectTag(tag.name)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: getTagStringColor(tag.color) }}
                        />
                        <span>{tag.name}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          <div className="flex justify-end gap-3 pt-2">
            <Button className="rounded-3xl" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="rounded-3xl" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
