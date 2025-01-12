import { X } from 'lucide-react'
import { getLighterColor } from '../lib/utils'
import { Badge } from './ui/badge'

interface TagBadgeProps {
  name: string
  color: string
  onRemove?: () => void
  className?: string
}

export function TagBadge({ name, color, onRemove, className }: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 border-[0.5px] font-normal ${className}`}
      style={{
        backgroundColor: getLighterColor(color),
        color,
        borderColor: getLighterColor(color)
      }}
    >
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }}></div>
      {name}
      {onRemove && <X className="h-3 w-3 cursor-pointer hover:opacity-80" onClick={onRemove} />}
    </Badge>
  )
}
