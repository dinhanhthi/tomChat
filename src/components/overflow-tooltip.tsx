import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

const OverflowTooltip = ({ text, className }: { text: string, className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowed(textRef.current.scrollWidth > textRef.current.clientWidth)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text])

  if (!isOverflowed) {
    return (
      <div ref={textRef} className="truncate">
        {text}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={textRef} className={cn('truncate', className)}>
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default OverflowTooltip
