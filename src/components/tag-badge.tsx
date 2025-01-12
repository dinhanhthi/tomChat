import { X } from 'lucide-react'
import { getTagStringColor, getTagTextColor } from '../lib/utils'
import { Badge } from './ui/badge'

interface TagBadgeProps {
  name: string
  color: string
  onRemove?: () => void
  className?: string
}

export function TagBadge({ name, color, onRemove, className }: TagBadgeProps) {
  const textColor = getTagTextColor(color)

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 font-normal ${className}`}
      style={{
        backgroundColor: color,
        color: textColor,
        border: 'none'
      }}
    >
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: getTagStringColor(color) }}></div>
      {name}
      {onRemove && <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={onRemove} />}
    </Badge>
  )
}
