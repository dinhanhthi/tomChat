import { Button } from '@/components/ui/button'
import { CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useAlertDialog } from './dialog-confirm'

interface TagItemProps {
  name: string
  color: string
  isSelected: boolean
  colorPickerOpen: boolean
  onSelect: () => void
  onColorChange: (color: string, isTemporary: boolean, isConfirmed?: boolean) => void
  onPopoverOpenChange: (open: boolean) => void
  onTagSelect: () => void
  onRemove?: () => void
  showRemove?: boolean
}

export function TagItem({
  name,
  color,
  isSelected,
  colorPickerOpen,
  onSelect,
  onColorChange,
  onPopoverOpenChange,
  onTagSelect,
  onRemove,
  showRemove
}: TagItemProps) {
  const { showAlert } = useAlertDialog()
  const [tempColor, setTempColor] = useState(color)
  const [originalColor, setOriginalColor] = useState(color)
  const [confirmedColor, setConfirmedColor] = useState(color)

  useEffect(() => {
    // Update colors when parent color changes
    setTempColor(color)
    setOriginalColor(color)
    setConfirmedColor(color)
  }, [color])

  const handleColorPreview = (newColor: string) => {
    setTempColor(newColor)
    onColorChange(newColor, true, false)
  }

  const handleAcceptColor = () => {
    setConfirmedColor(tempColor)
    onColorChange(tempColor, false, true)
    onPopoverOpenChange(false)
  }

  const handleCancel = () => {
    setTempColor(originalColor)
    setConfirmedColor(originalColor)
    onColorChange(originalColor, false, false)
    onPopoverOpenChange(false)
  }

  const handlePopoverTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (colorPickerOpen && isSelected) {
      onPopoverOpenChange(false)
    } else {
      onSelect()
    }
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showAlert({
      title: 'Remove Tag',
      description: `Are you sure you want to remove the tag **${name}**? This will remove it from all chats.`,
      confirmText: 'Remove',
      confirmClassName: 'bg-destructive hover:bg-destructive/90',
      onConfirm: onRemove
    })
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
      <div className="absolute right-2 flex items-center gap-1">
        {showRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="invisible h-6 w-6 group-hover:visible"
            onMouseDown={e => e.preventDefault()}
            onClick={handleRemoveClick}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
        <Popover open={colorPickerOpen && isSelected} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="invisible h-6 w-6 group-hover:visible"
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
      </div>
    </CommandItem>
  )
}
