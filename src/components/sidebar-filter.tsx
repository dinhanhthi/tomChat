import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Archive, Clock2, ListFilter, Pin } from 'lucide-react'
import React from 'react'

export interface SidebarFilterProps {
  showPinned: boolean
  showArchived: boolean
  sortByCreatedDate: boolean
}

interface FilterButtonProps {
  onFilterChange: (filters: SidebarFilterProps) => void
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFilterChange }) => {
  const [showPinned, setShowPinned] = React.useState(false)
  const [showArchived, setShowArchived] = React.useState(false)
  const [sortByCreatedDate, setSortByCreatedDate] = React.useState(false)

  const handleFilterChange = (key: string, value: boolean) => {
    const newFilters = {
      showPinned,
      showArchived,
      sortByCreatedDate,
      [key]: value
    }

    switch (key) {
      case 'showPinned':
        setShowPinned(value)
        break
      case 'showArchived':
        setShowArchived(value)
        break
      case 'sortByCreatedDate':
        setSortByCreatedDate(value)
        break
    }

    onFilterChange(newFilters)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconBig">
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        <div className="space-y-0">
          <div className="flex items-center justify-between hover:bg-secondary p-2 rounded-md">
            <Label htmlFor="pinned" className='flex items-center flex-row gap-2'>
              <Pin className='w-4 h-4 opacity-70' />
              Show pinned chats
            </Label>
            <Switch
              id="pinned"
              checked={showPinned}
              onCheckedChange={checked => handleFilterChange('showPinned', checked)}
            />
          </div>

          <div className="flex items-center justify-between hover:bg-secondary p-2 rounded-md">
            <Label htmlFor="archived" className='flex items-center flex-row gap-2'>
              <Archive className='w-4 h-4 opacity-70' />
              Show archived chats
            </Label>
            <Switch
              id="archived"
              checked={showArchived}
              onCheckedChange={checked => handleFilterChange('showArchived', checked)}
            />
          </div>

          <div className="flex items-center justify-between hover:bg-secondary p-2 rounded-md">
            <Label htmlFor="sortByCreatedDate" className='flex items-center flex-row gap-2'>
              <Clock2 className='w-4 h-4 opacity-70' />
              Sort by created date
            </Label>
            <Switch
              id="sortByCreatedDate"
              checked={sortByCreatedDate}
              onCheckedChange={checked => handleFilterChange('sortByCreatedDate', checked)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterButton
