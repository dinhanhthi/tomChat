import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Archive, ListFilter } from 'lucide-react'
import { SidebarFilter } from '../hooks/useFilterSettings'

interface FilterButtonProps {
  settings: SidebarFilter
  onSettingsChange: (settings: Partial<SidebarFilter>) => void
}

export default function FilterButton({ settings, onSettingsChange }: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconBig">
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="space-y-0">
          <div className="flex items-center justify-between rounded-md p-2 hover:bg-secondary">
            <Label htmlFor="archived" className="flex flex-row items-center gap-2">
              <Archive className="h-4 w-4 opacity-70" />
              Archived chats
            </Label>
            <Switch
              id="archived"
              checked={settings.showArchived}
              onCheckedChange={checked => onSettingsChange({ showArchived: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
