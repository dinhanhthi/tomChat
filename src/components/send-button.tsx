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
      className="flex items-center hover:bg-principal hover:text-white h-8 w-8 justify-center text-white bg-principal rounded-full [&_svg]:size-[15px]"
      variant="ghost"
      size="iconBig"
      disabled={input === ''}
    >
      <Send className="-rotate-45 mt-1" />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false
  return true
})

export default SendButton
