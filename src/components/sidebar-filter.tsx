import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Archive, Clock2, ListFilter, Pin } from 'lucide-react'
import { FilterSettings } from '../hooks/useFilterSettings'

interface FilterButtonProps {
  settings: FilterSettings
  onSettingsChange: (settings: Partial<FilterSettings>) => void
}

export default function FilterButton({ settings, onSettingsChange }: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconBig">
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        <div className="space-y-0">
          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="pinned" className="flex flex-row items-center gap-2">
              <Pin className="h-4 w-4 opacity-70" />
              Show pinned chats
            </Label>
            <Switch
              id="pinned"
              checked={settings.showPinned}
              onCheckedChange={checked => onSettingsChange({ showPinned: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="archived" className="flex flex-row items-center gap-2">
              <Archive className="h-4 w-4 opacity-70" />
              Show archived chats
            </Label>
            <Switch
              id="archived"
              checked={settings.showArchived}
              onCheckedChange={checked => onSettingsChange({ showArchived: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="sortByCreatedDate" className="flex flex-row items-center gap-2">
              <Clock2 className="h-4 w-4 opacity-70" />
              Sort by created date
            </Label>
            <Switch
              id="sortByCreatedDate"
              checked={settings.sortByCreatedDate}
              onCheckedChange={checked => onSettingsChange({ sortByCreatedDate: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
