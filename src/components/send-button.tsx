import { Send } from 'lucide-react'
import { memo } from 'react'
import { Button } from './ui/button'

function PureSendButton({ submitForm, input }: { submitForm: () => void; input: string }) {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        submitForm()
      }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary hover:text-white [&_svg]:size-[15px]"
      variant="ghost"
      size="iconBig"
      disabled={input === ''}
    >
      <Send className="mt-1 -rotate-45" />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false
  return true
})

export default SendButton
