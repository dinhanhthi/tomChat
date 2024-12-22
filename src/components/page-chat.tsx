'use client'

import { useChat } from 'ai/react'
import { useScrollToBottom } from '../hooks/use-scroll-to-bottom'
import { cn } from '../lib/utils'
import AppInputMsg from './app-input-msg'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import MessagePreview from './message-preview'

export default function PageChat(props: { className?: string }) {
  const [messagesContainerRef, _messagesEndRef] = useScrollToBottom<HTMLDivElement>()

  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <>
      <div className="relative h-full flex flex-col">
        <div ref={messagesContainerRef} className="overflow-y-auto h-full w-full">
          <Container>
            <div className={cn('h-full px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', props.className)}>
              {messages.map((msg, i) => (
                <MessagePreview key={i} message={msg} />
              ))}
            </div>
          </Container>
          <ScrollToBottomButton className="absolute bottom-[130px] right-1/2" targetRef={messagesContainerRef} />
        </div>
        <AppInputMsg className="pb-2" input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </div>
    </>
  )
}
