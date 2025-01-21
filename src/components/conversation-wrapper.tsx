import { exMessage } from '../interface'
import { cn } from '../lib/utils'
import Container from './container'
import MessagePreview from './message-preview'

type ConversationWrapperProps = {
  messages?: exMessage[]
  className?: string
  smallText?: boolean
}

export default function ConversationWrapper(props: ConversationWrapperProps) {
  const { messages, className, smallText } = props
  return (
    <div className='flex w-full h-full overflow-auto'>
      <Container className={cn('flex flex-col gap-6', className)}>
        {messages
          ?.filter(msg => !!msg.content)
          .map((msg, i) => (
            <MessagePreview
              key={msg.id ?? i}
              message={msg}
              smallText={smallText}
              // isLoading={isLoading}
              isLast={i === messages.filter(msg => !!msg.content).length - 1}
            />
          ))}
      </Container>
    </div>
  )
}
