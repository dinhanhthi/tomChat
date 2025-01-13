'use client'

import { useChat } from 'ai/react'
import { Ghost } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { addMessage, getChat, getMessages, updateHasNoTagProp, updateTagsProp } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import AppInputMsg from './app-input-msg'
import XChatBrand from './brand'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
import LoadingBar from './loading-bar'
import MessagePreview from './message-preview'
import { Button } from './ui/button'

export default function PageChat({ chatId, className }: { chatId: string; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [hash, setHash] = useState('')

  useEffect(() => {
    const _hash = window.location.hash.substring(1)
    if (_hash) {
      setHash(_hash)
    }
  }, [])

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [hash])

  const handleDevFunction = async () => {
    // xtoast.info('Dev function is running now!')
    xtoast.info('Dev function is disabled!')

    // await updateMissingArchivedChats()
    // await updateMissingPinnedChats()
    // await updateTagsProp()
    // await updateHasNoTagProp()
  }

  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const { messages, setMessages, input, setInput, handleSubmit, isLoading, stop } = useChat({
    onFinish: async (message, options) => {
      await addMessage(chatId, {
        ...message,
        serviceId: message.id,
        id: uuidv4(),
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
    <>
      <div className={cn('relative flex h-full flex-col', className)}>
        <LoadingBar isLoading={isPageLoading} />
        <div ref={messagesContainerRef} className="x-flex-1 overflow-y-auto">
          <Container className="h-full">
            {!isPageLoading && (
              <div className={cn('flex h-full w-full scroll-mb-[250px] flex-col gap-8 px-4 pb-14 pt-8', className)}>
                {messages
                  .filter(msg => !!msg.content)
                  .map((msg, i) => (
                    <MessagePreview key={msg.id ?? i} message={msg} isLoading={isLoading} />
                  ))}
                {!messages.length && (
                  <div className="x-flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                    <XChatBrand
                      size={32}
                      className="select-none gap-2 grayscale"
                      textClassName="text-2xl font-bold opacity-80"
                      wrap={true}
                    />
                  </div>
                )}

                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="is-typing text-sm italic text-muted-foreground">I'm thinking, please wait</div>
                )}

                <div ref={messagesEndRef} className="h-8 min-h-8 min-w-8 shrink-0"></div>
              </div>
            )}
          </Container>
          <ScrollToBottomButton className="absolute bottom-[150px] right-1/2" targetRef={messagesContainerRef} />
        </div>
        <AppInputMsg
          chatId={chatId}
          className="pb-4"
          useChatParams={{ input, setInput, handleSubmit, setMessages, messages, isLoading, stop }}
        />
      </div>
      {!!process.env.NEXT_PUBLIC_DEV_MODE && (
        <Button
          variant="outline"
          size="iconBig"
          className="fixed bottom-4 right-4 rounded-full"
          onClick={handleDevFunction}
          tooltip="Dev function"
        >
          <Ghost size={24} />
        </Button>
      )}
    </>
  )
}
