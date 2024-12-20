'use client'

import { useScrollToBottom } from '../hooks/use-scroll-to-bottom'
import { Message } from '../interface'
import { cn } from '../lib/utils'
import MessagePreview from './message-preview'

export default function Messages(props: { messages: Message[]; className?: string }) {
  const [messagesContainerRef, _messagesEndRef] = useScrollToBottom<HTMLDivElement>()
  return (
    <div ref={messagesContainerRef} className={cn('h-full overflow-y-auto px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', props.className)}>
      {props.messages.map((msg, i) => (
        <MessagePreview key={i} message={msg} />
      ))}
    </div>
  )
}
