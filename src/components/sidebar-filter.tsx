import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Archive, ListFilter, SquareMousePointer, Tag, Tags } from 'lucide-react'
import { SidebarFilter } from '../hooks/useFilterSettings'

interface FilterButtonProps {
  settings: SidebarFilter
  onSettingsChange: (settings: Partial<SidebarFilter>) => void
  isChanged?: boolean
}

export default function FilterButton({ settings, onSettingsChange, isChanged }: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" inSidebar variant="ghost" size="iconBig">
          <ListFilter />
          {isChanged && <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-primary"></div>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1" align="start">
        <div className="space-y-0">
          {/* Show archived */}
          <div className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="archived" className="flex flex-row items-center gap-2">
              <Archive className="h-4 w-4 opacity-70" />
              Show only archived chats
            </Label>
            <Switch
              id="archived"
              checked={settings.onlyArchived}
              onCheckedChange={checked => onSettingsChange({ onlyArchived: checked })}
            />
          </div>

          {/* Show also archived chats */}
          <div className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="also-archived" className="flex flex-row items-center gap-2">
              <Archive className="h-4 w-4 opacity-70" />
              Show also archived chats
            </Label>
            <Switch
              id="also-archived"
              checked={settings.alsoArchived}
              onCheckedChange={checked => onSettingsChange({ alsoArchived: checked })}
            />
          </div>

          {/* Show by tags */}
          <div className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="tags" className="flex flex-row items-center gap-2">
              <Tag className="h-4 w-4 opacity-70" />
              Show chats by tags
            </Label>
            <Switch
              id="tags"
              checked={settings.showByTags}
              onCheckedChange={checked => onSettingsChange({ showByTags: checked })}
            />
          </div>

          {/* Show tag indicators */}
          <div className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="tag-indicators" className="flex flex-row items-center gap-2">
              <Tags className="h-4 w-4 opacity-70" />
              Show tag indicators
            </Label>
            <Switch
              id="tag-indicators"
              checked={settings.showTagIndicators}
              onCheckedChange={checked => onSettingsChange({ showTagIndicators: checked })}
            />
          </div>

          {/* Multiple selection */}
          <div className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="multi-select" className="flex flex-row items-center gap-2">
              <SquareMousePointer className="h-4 w-4 opacity-70" />
              Select multiple chats
            </Label>
            <Switch
              id="multi-select"
              checked={settings.multipleSelection}
              onCheckedChange={checked => onSettingsChange({ multipleSelection: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
