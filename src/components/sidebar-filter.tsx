import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Archive, Clock2, ListFilter, Pin } from 'lucide-react'
import { useUserPreferences } from '../hooks/usePreferences'

export interface SidebarFilterSettings {
  showPinned: boolean
  showArchived: boolean
  sortByCreatedDate: boolean
}

export const defaultSidebarFilter: SidebarFilterSettings = {
  showPinned: false,
  showArchived: false,
  sortByCreatedDate: false
}

export default function FilterButton() {
  const { settings, updateSidebarFilterSettings } = useUserPreferences()
  const { showPinned, showArchived, sortByCreatedDate } = settings.sidebarFilterSettings

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
              checked={showPinned}
              onCheckedChange={checked => updateSidebarFilterSettings({ showPinned: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="archived" className="flex flex-row items-center gap-2">
              <Archive className="h-4 w-4 opacity-70" />
              Show archived chats
            </Label>
            <Switch
              id="archived"
              checked={showArchived}
              onCheckedChange={checked => updateSidebarFilterSettings({ showArchived: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="sortByCreatedDate" className="flex flex-row items-center gap-2">
              <Clock2 className="h-4 w-4 opacity-70" />
              Sort by created date
            </Label>
            <Switch
              id="sortByCreatedDate"
              checked={sortByCreatedDate}
              onCheckedChange={checked => updateSidebarFilterSettings({ sortByCreatedDate: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
