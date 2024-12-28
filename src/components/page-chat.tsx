'use client'

import { useChat } from 'ai/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { addMessage, getChat, getMessages } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import AppInputMsg from './app-input-msg'
import XChatBrand from './brand'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import LoadingBar from './loading-bar'
import MessagePreview from './message-preview'

export default function PageChat({ chatId, className }: { chatId: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    isLoading: isAnswering,
    stop
  } = useChat({
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
    },
    onError: error => {
      xtoast.error(`Error when sending the message: **${error instanceof Error ? error.message : 'Unknown error!'}**`)
    }
  })

  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  useEffect(() => {
    scrollToBottom(false)
  }, [messages])

  useEffect(() => {
    const checkChat = async () => {
      try {
        if (pathname === `/chat/${chatId}`) {
          const chat = await getChat(chatId)
          if (!chat) {
            setIsLoading(false)
            xtoast.error('Chat not found!')
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
        xtoast.error('There is an unknown error when loading the chat you want!')
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
              {!messages.length && (
                <div className="flex flex-col items-center gap-4 x-flex-1 justify-center opacity-40">
                  <XChatBrand size="lg" className="grayscale select-none" wrap={true} />
                </div>
              )}

              {isAnswering && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="text-muted-foreground italic text-sm">AI is thinking...</div>
              )}

              <div ref={messagesEndRef} className="min-h-8 h-8 min-w-8 shrink-0"></div>
            </div>
          )}
        </Container>
        <ScrollToBottomButton className="absolute bottom-[150px] right-1/2" targetRef={messagesContainerRef} />
      </div>
      <AppInputMsg
        chatId={chatId}
        className="pb-2"
        useChatParams={{ input, setInput, handleSubmit, setMessages, messages, isLoading: isAnswering, stop }}
      />
    </div>
  )
}
