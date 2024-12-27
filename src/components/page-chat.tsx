'use client'

import { useChat } from 'ai/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useScrollToBottom } from '../hooks/useScrollToBottom'
import { addMessage, getChat, getMessages } from '../lib/chats'
import { cn } from '../lib/utils'
import AppInputMsg from './app-input-msg'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import LoadingBar from './loading-bar'
import MessagePreview from './message-preview'

export default function PageChat({ chatId, className }: { chatId: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [messagesContainerRef, _messagesEndRef] = useScrollToBottom<HTMLDivElement>()
  const [isLoading, setIsLoading] = useState(true)
  // let initialMessages: exMessage[] = []

  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const { messages, setMessages, input, setInput, handleSubmit } = useChat({
    // initialMessages,
    onFinish: async (message, options) => {
      await addMessage(chatId, {
        ...message,
        chatId,
        usage: {
          promptTokens: options.usage.promptTokens,
          completionTokens: options.usage.completionTokens,
          totalTokens: options.usage.totalTokens
        }
      })
    }
  })

  useEffect(() => {
    const checkChat = async () => {
      try {
        if (pathname === `/chat/${chatId}`) {
          const chat = await getChat(chatId)
          if (!chat) {
            setIsLoading(false)
            toast('Chat not found!')
            router.push('/')
            router.refresh()
          }
          const messages = await getMessages(chatId)
          setMessages(messages)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        toast('There is an unknown error when loading the chat you want!')
        setIsLoading(false)
        router.push('/')
        router.refresh()
      }
    }

    checkChat()
  }, [router, chatId])

  return (
    <div className={cn('relative h-full flex flex-col', className)}>
      <LoadingBar isLoading={isLoading} />
      <div ref={messagesContainerRef} className="overflow-y-auto x-flex-1">
        <Container className="h-full">
          {!isLoading && (
            <div className={cn('h-full w-full px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', className)}>
              {messages.map((msg, i) => (
                <MessagePreview key={msg.id ?? i} message={msg} />
              ))}
              <div className="min-h-8 shrink-0"></div>
            </div>
          )}
        </Container>
        <ScrollToBottomButton className="absolute bottom-[150px] right-1/2" targetRef={messagesContainerRef} />
      </div>
      <AppInputMsg
        chatId={chatId}
        className="pb-2"
        useChatParams={{ input, setInput, handleSubmit, setMessages, messages }}
      />
    </div>
  )
}
