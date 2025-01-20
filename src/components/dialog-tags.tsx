import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CommandEmpty } from 'cmdk'
import { useEffect, useState } from 'react'
import { useTagStore } from '../hooks/useTagStore'
import { Chat } from '../interface'
import { updateChatMeta } from '../lib/chats'
import { cn, generatePastelColor } from '../lib/utils'
import { TagBadge } from './tag-badge'
import { TagItem } from './tag-item'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

interface TagsDialogProps {
  chat: Chat | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TagsDialog({ chat, open, onOpenChange }: TagsDialogProps) {
  const [chatTags, setChatTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [newTagColors, setNewTagColors] = useState<Record<string, string>>({})
  const [tempTagColors, setTempTagColors] = useState<Record<string, string>>({})
  const { tags: availableTags, addTags, updateTagColor, removeTag } = useTagStore()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [confirmedColorChanges, setConfirmedColorChanges] = useState<Record<string, string>>({})

  const handlePopoverOpenChange = (open: boolean) => {
    setColorPickerOpen(open)
    if (!open) {
      setSelectedTag(null)
      setTempTagColors({})
    }
  }

  useEffect(() => {
    if (chat && open) {
      try {
        const parsedTags = chat.tags ?? []
        setChatTags(Array.isArray(parsedTags) ? parsedTags : [])
      } catch (e) {
        console.warn('Failed to parse chat tags:', e)
        setChatTags([])
      }
    }
  }, [chat, open])

  const handleSave = async () => {
    if (!chat) return

    const newTags = chatTags.filter(tag => !availableTags.some(t => t.name === tag))
    if (newTags.length > 0) {
      const newTagsWithColors = newTags.reduce(
        (acc, tag) => ({
          ...acc,
          [tag]: confirmedColorChanges[tag] || newTagColors[tag] || generatePastelColor()
        }),
        {} as Record<string, string>
      )

      addTags(newTags, newTagsWithColors)
    }

    // Save confirmed color changes to tag store
    Object.entries(confirmedColorChanges).forEach(([tagName, color]) => {
      if (availableTags.some(t => t.name === tagName)) {
        updateTagColor(tagName, color)
      }
    })

    await updateChatMeta(chat.id, 'tags', chatTags)
    if (chatTags.length === 0) {
      await updateChatMeta(chat.id, 'hasNoTag', 1)
    } else {
      await updateChatMeta(chat.id, 'hasNoTag', 0)
    }
    setTempTagColors({})
    setConfirmedColorChanges({})
    onOpenChange(false)
  }

  const normalizeString = (str: string) => str.toLowerCase().trim()

  const showCreateOption =
    inputValue &&
    !availableTags.some(tag => normalizeString(tag.name) === normalizeString(inputValue)) &&
    !chatTags.some(tag => normalizeString(tag) === normalizeString(inputValue))

  const handleSelectTag = (tagName: string) => {
    handleCreateNewTag(tagName)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setChatTags(tags => tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      handleCreateNewTag(inputValue)
    }
  }

  const handleCreateNewTag = (tagName: string) => {
    if (!chatTags.some(t => normalizeString(t) === normalizeString(tagName))) {
      const trimmedTag = tagName.trim()
      if (!availableTags.some(t => t.name === trimmedTag) && !newTagColors[trimmedTag]) {
        setNewTagColors(prev => ({
          ...prev,
          [trimmedTag]: generatePastelColor()
        }))
      }
      setChatTags([...chatTags, trimmedTag])
      setInputValue('')
    }
  }

  const handleColorChange = (color: string, isTemporary: boolean = false, isConfirmed: boolean = false) => {
    if (!selectedTag) return

    if (isTemporary) {
      setTempTagColors(prev => ({
        ...prev,
        [selectedTag]: color
      }))
      return
    }

    // Reset temporary colors
    setTempTagColors(prev => {
      const newColors = { ...prev }
      delete newColors[selectedTag]
      return newColors
    })

    if (isConfirmed) {
      // Only update confirmed colors if OK was clicked
      setConfirmedColorChanges(prev => ({
        ...prev,
        [selectedTag]: color
      }))
    }
  }

  // Add dialog cancel handler
  const handleDialogCancel = () => {
    setTempTagColors({})
    setConfirmedColorChanges({})
    onOpenChange(false)
  }

  const handleRemoveFromDatabase = (tagName: string) => {
    removeTag(tagName)
    // Also remove from current chat if it's assigned
    if (chatTags.includes(tagName)) {
      handleRemoveTag(tagName)
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
                const finalColor =
                  tempTagColors[tag] ||
                  confirmedColorChanges[tag] ||
                  tagData?.color ||
                  newTagColors[tag] ||
                  generatePastelColor()
                return <TagBadge key={tag} name={tag} color={finalColor} onRemove={() => handleRemoveTag(tag)} />
              })}
            </div>
          )}

          <Command className="rounded-lg border border-slate-200 shadow-sm">
            <CommandInput
              placeholder="Search or create new tag..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList
              className={cn({
                'border-t': showCreateOption || availableTags.length > 0
              })}
            >
              {showCreateOption && (
                <>
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
                </>
              )}

              {availableTags.length > 0 && (
                <CommandGroup
                  heading={`Available Tags (${
                    availableTags.filter(
                      tag =>
                        normalizeString(tag.name).includes(normalizeString(inputValue)) &&
                        !chatTags.some(chatTag => normalizeString(chatTag) === normalizeString(tag.name))
                    ).length
                  })`}
                >
                  {availableTags
                    .filter(
                      tag =>
                        normalizeString(tag.name).includes(normalizeString(inputValue)) &&
                        !chatTags.some(chatTag => normalizeString(chatTag) === normalizeString(tag.name))
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(tag => {
                      const currentColor = confirmedColorChanges[tag.name] || tag.color
                      return (
                        <TagItem
                          key={tag.name}
                          name={tag.name}
                          color={currentColor}
                          isSelected={selectedTag === tag.name}
                          colorPickerOpen={colorPickerOpen}
                          onSelect={() => {
                            setSelectedTag(tag.name)
                            setColorPickerOpen(true)
                          }}
                          onColorChange={handleColorChange}
                          onPopoverOpenChange={handlePopoverOpenChange}
                          onTagSelect={() => handleSelectTag(tag.name)}
                          showRemove={true}
                          onRemove={() => handleRemoveFromDatabase(tag.name)}
                        />
                      )
                    })}
                </CommandGroup>
              )}

              {chatTags.length > 0 && (
                <CommandGroup heading={`Assigned Tags (${chatTags.length})`}>
                  {chatTags
                    .sort((a, b) => a.localeCompare(b))
                    .map(tag => {
                      const tagData = availableTags.find(t => t.name === tag)
                      const tagColor =
                        confirmedColorChanges[tag] ||
                        (tagData?.color ? tagData.color : newTagColors[tag] || generatePastelColor())

                      return (
                        <TagItem
                          key={tag}
                          name={tag}
                          color={tagColor}
                          isSelected={selectedTag === tag}
                          colorPickerOpen={colorPickerOpen}
                          onSelect={() => {
                            setSelectedTag(tag)
                            setColorPickerOpen(true)
                          }}
                          onColorChange={handleColorChange}
                          onPopoverOpenChange={handlePopoverOpenChange}
                          onTagSelect={() => handleRemoveTag(tag)}
                          showRemove={true}
                          onRemove={() => handleRemoveFromDatabase(tag)}
                        />
                      )
                    })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          <div className="flex justify-end gap-3 pt-2">
            <Button className="rounded-3xl" variant="outline" onClick={handleDialogCancel}>
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
