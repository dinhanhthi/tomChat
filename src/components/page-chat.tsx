'use client'

import { useChat } from 'ai/react'
import { LoaderCircle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useScrollToBottom } from '../hooks/useScrollToBottom'
import { exMessage } from '../interface'
import { addMessage, getConversation, getMessages } from '../lib/utils/conversations'
import { cn } from '../lib/utils/helpers'
import AppInputMsg from './app-input-msg'
import ScrollToBottomButton from './btn-scroll-to-bottom'
import Container from './container'
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
    const checkConversation = async () => {
      try {
        if (pathname === `/chat/${chatId}`) {
          const conversation = await getConversation(chatId)
          if (!conversation) {
            setIsLoading(false)
            toast('Conversation not found!')
            router.push('/')
            router.refresh()
          }
          const messages = await getMessages(chatId)
          /* ###Thi */ console.log(`👉👉👉 initialMessages: `, messages)
          setMessages(messages)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        toast('There is an unknown error when loading the conversation you want!')
        setIsLoading(false)
        router.push('/')
        router.refresh()
      }
    }

    checkConversation()

    // /* ###Thi */ console.log(`👉👉👉 conversation: `, conversation)
    // /* ###Thi */ console.log(`👉👉👉 initialMessages: `, initialMessages)
    // if (chatId && !conversation && pathname === `/chat/${chatId}`) {
    //   /* ###Thi */ console.log(`👉👉👉 not found conv`);
    //   toast('Conversation not found!')
    //   router.push('/')
    // }
  }, [router, chatId])

  // const { messages: initialMessages } = useMessages(id as string)

  return (
    <div className={cn('relative h-full flex flex-col', className)}>
      <div ref={messagesContainerRef} className="overflow-y-auto h-full w-full">
        <Container className="h-full">
          {!isLoading && (
            <div className={cn('h-full px-4 pt-8 pb-14 gap-8 flex flex-col scroll-mb-[250px]', className)}>
              {messages.map((msg, i) => (
                <MessagePreview key={msg.id ?? i} message={msg} />
              ))}
              <div className='min-h-8 shrink-0'></div>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center h-full animate-pulse">
              <LoaderCircle className="w-8 h-8 text-slate-400 animate-spin" />
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
