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
  const [isPageLoading, setIsPageLoading] = useState(true)

  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    isLoading,
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
            setIsPageLoading(false)
            xtoast.error('Chat not found!')
            router.push('/')
            router.refresh()
            setMessages([])
          }
          const messages = await getMessages(chatId)
          setMessages(messages)
          setIsPageLoading(false)
        } else {
          setIsPageLoading(false)
        }
      } catch (error) {
        xtoast.error('There is an unknown error when loading the chat you want!')
        setIsPageLoading(false)
        router.push('/')
        router.refresh()
        setMessages([])
      }
    }

    checkChat()
  }, [router, chatId])

  // Fix: Clear messages when navigating to the home page (we need this because sometimes it doesn't clear the messages)
  useEffect(() => {
    if (pathname === '/') {
      setMessages([])
    }
  }, [pathname])

  return (
    <div className={cn('relative h-full flex flex-col', className)}>
      <LoadingBar isLoading={isPageLoading} />
      <div ref={messagesContainerRef} className="overflow-y-auto x-flex-1">
        <Container className="h-full">
          {!isPageLoading && (
            <div className={cn('h-full w-full px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', className)}>
              {messages
                .filter(msg => !!msg.content)
                .map((msg, i) => (
                  <MessagePreview key={msg.id ?? i} message={msg} isLoading={isLoading} />
                ))}
              {!messages.length && (
                <div className="flex flex-col items-center gap-4 x-flex-1 justify-center opacity-30">
                  <XChatBrand
                    size={32}
                    className="grayscale select-none gap-2"
                    textClassName="text-2xl font-bold opacity-80"
                    wrap={true}
                  />
                </div>
              )}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
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
        useChatParams={{ input, setInput, handleSubmit, setMessages, messages, isLoading, stop }}
      />
    </div>
  )
}
