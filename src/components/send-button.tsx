import { AudioLines, Send } from 'lucide-react'
import { memo } from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

function PureSendButton({ submitForm, input }: { submitForm: () => void; input: string }) {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        submitForm()
      }}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary hover:text-white'
      )}
      variant="ghost"
      size="iconBig"
      tooltip={input !== '' ? 'Send message' : 'Use voice mode'}
    >
      {input !== '' && <Send className="mt-1 -rotate-45" />}
      {input == '' && <AudioLines />}
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false
  return true
})

export default SendButton
