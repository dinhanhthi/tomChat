import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

const OverflowTooltip = ({
  text,
  className,
  position,
  delayDuration = 1,
  textHighlight
}: {
  text: string
  className?: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
  textHighlight?: string // used for search results
}) => {
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
      <div ref={textRef} className="w-full pr-6">
        {!textHighlight && <div className="truncate">{text}</div>}
        {textHighlight && <div className="truncate" dangerouslySetInnerHTML={{ __html: textHighlight }} />}
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={textRef} className={cn(className)}>
            {!textHighlight && <div className="w-full truncate">{text}</div>}
            {textHighlight && <div className="w-full truncate" dangerouslySetInnerHTML={{ __html: textHighlight }} />}
          </div>
        </TooltipTrigger>
        <TooltipContent side={position}>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default OverflowTooltip
