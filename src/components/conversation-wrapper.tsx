import { useEffect, useRef } from 'react'
import { exMessage } from '../interface'
import { cn } from '../lib/utils'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import MessagePreview from './message-preview'

type ConversationWrapperProps = {
  messages?: exMessage[]
  className?: string
  smallText?: boolean
}

export default function ConversationWrapper(props: ConversationWrapperProps) {
  const { messages, className, smallText } = props
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  useEffect(() => {
    scrollToBottom(false)
  }, [messages])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <div ref={messagesContainerRef} className={cn('flex h-full w-full overflow-auto')}>
        <Container className={cn('flex flex-col gap-8')}>
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
          <div ref={messagesEndRef} className="h-4 min-h-4 min-w-8 shrink-0"></div>
        </Container>
      </div>
      <ScrollToBottomButton targetRef={messagesContainerRef} className="absolute -bottom-4 right-1/2" />
    </div>
  )
}
