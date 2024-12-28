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
      className="flex items-center hover:bg-principal hover:text-white h-8 w-8 justify-center text-white bg-principal rounded-full [&_svg]:size-[15px] relative"
      variant="ghost"
      size="iconBig"
    >
      <Square className="fill-white z-20" />
      <div className="animate-ping absolute z-10 w-2/3 h-2/3 bg-principal rounded-full"></div>
    </Button>
  )
}

const StopButton = memo(PureStopButton)

export default StopButton
