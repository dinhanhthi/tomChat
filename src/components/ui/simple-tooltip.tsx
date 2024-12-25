import { cn } from '../../lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export default function SimpleTooltip(props: { text: string; children: React.ReactNode; hidden?: boolean }) {
  return (
    <TooltipProvider delayDuration={1}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent className={cn({ hidden: props.hidden })}>{props.text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
