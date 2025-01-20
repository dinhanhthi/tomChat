import { UseChatHelpers } from 'ai/react/dist'
import { Square } from 'lucide-react'
import { memo } from 'react'
import { sanitizeUIMessages } from '../lib/utils'
import { Button } from './ui/button'

function PureStopButton({
  stop,
  setMessages
}: {
  stop: UseChatHelpers['stop']
  setMessages: UseChatHelpers['setMessages']
}) {
  return (
    <Button
      onClick={event => {
        event.preventDefault()
        stop()
        setMessages(messages => sanitizeUIMessages(messages))
      }}
      className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary hover:text-white [&_svg]:size-[15px]"
      variant="ghost"
      size="iconBig"
    >
      <Square className="z-20 fill-white" />
      <div className="absolute z-10 h-2/3 w-2/3 animate-ping rounded-full bg-primary"></div>
    </Button>
  )
}

const StopButton = memo(PureStopButton)

export default StopButton
