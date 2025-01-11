import { X } from 'lucide-react'
import { getTagTextColor } from '../lib/utils'
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
      className={`flex items-center gap-1 font-normal ${className}`} // Added font-normal
      style={{
        backgroundColor: color,
        color: textColor,
        border: 'none'
      }}
    >
      {name}
      {onRemove && <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={onRemove} />}
    </Badge>
  )
}
