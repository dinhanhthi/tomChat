import { Button } from '@/components/ui/button'
import { CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface TagItemProps {
  name: string
  color: string
  isSelected: boolean
  colorPickerOpen: boolean
  onSelect: () => void
  onColorChange: (color: string, isTemporary?: boolean) => void // Updated type
  onPopoverOpenChange: (open: boolean) => void
  onTagSelect: () => void
}

export function TagItem({
  name,
  color,
  isSelected,
  colorPickerOpen,
  onSelect,
  onColorChange,
  onPopoverOpenChange,
  onTagSelect
}: TagItemProps) {
  const [tempColor, setTempColor] = useState(color)
  const [originalColor, setOriginalColor] = useState(color)

  const handleColorPreview = (newColor: string) => {
    setTempColor(newColor)
    onColorChange(newColor, true) // Pass true to indicate this is a temporary change
  }

  const handleAcceptColor = () => {
    onColorChange(tempColor, false) // Pass false to indicate this is a permanent change
    onPopoverOpenChange(false)
  }

  const handleCancel = () => {
    setTempColor(originalColor)
    onColorChange(originalColor, false)
    onPopoverOpenChange(false)
  }

  const handlePopoverTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
  }

  const handlePopoverOpenChange = (open: boolean) => {
    if (open) {
      setOriginalColor(color)
      setTempColor(color)
    } else {
      handleCancel()
    }
    onPopoverOpenChange(open)
  }

  return (
    <CommandItem
      onSelect={e => {
        if (!colorPickerOpen) {
          onTagSelect()
        }
      }}
      className="group relative flex items-center gap-2"
    >
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tempColor }} />
      <span>{name}</span>
      <Popover open={colorPickerOpen && isSelected} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="invisible absolute right-2 h-6 w-6 group-hover:visible"
            onMouseDown={e => e.preventDefault()}
            onClick={handlePopoverTriggerClick}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex w-auto flex-col gap-3 p-3"
          onMouseDown={e => e.preventDefault()}
          onClick={e => e.stopPropagation()}
        >
          <HexColorPicker color={tempColor} onChange={handleColorPreview} />
          <div className="mt-1 flex justify-between gap-4">
            <Button className="h-7 rounded-2xl px-3 text-xs" variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="h-7 rounded-2xl px-4 text-xs" size="sm" onClick={handleAcceptColor}>
              OK
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </CommandItem>
  )
}
