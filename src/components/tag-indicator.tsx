import { getLighterColor } from '../lib/utils'

export default function TagIndicator({ tagColor }: { tagColor?: string }) {
  return (
    <div
      className="h-2 w-4 shrink-0 rounded-full border drop-shadow-md"
      style={{
        backgroundColor: getLighterColor(tagColor, 0.35),
        borderColor: getLighterColor(tagColor, 0.2)
      }}
    ></div>
  )
}
