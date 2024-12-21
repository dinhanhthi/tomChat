'use client'

import { useScrollToBottom } from '../hooks/use-scroll-to-bottom'
import { Message } from '../interface'
import { cn } from '../lib/utils'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import MessagePreview from './message-preview'

export default function Messages(props: { messages: Message[]; className?: string }) {
  const [messagesContainerRef, _messagesEndRef] = useScrollToBottom<HTMLDivElement>()
  return (
    <div ref={messagesContainerRef} className="overflow-y-auto h-full w-full">
      <Container>
        <div className={cn('h-full px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', props.className)}>
          {props.messages.map((msg, i) => (
            <MessagePreview key={i} message={msg} />
          ))}
        </div>
      </Container>
      <ScrollToBottomButton className='absolute bottom-0 right-1/2' targetRef={messagesContainerRef} />
    </div>
  )
}
