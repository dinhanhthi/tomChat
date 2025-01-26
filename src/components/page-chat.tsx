'use client'

import { useLiveQuery } from '@electric-sql/pglite-react'
import { useChat } from 'ai/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useChatIdStore } from '../hooks/useChatIdStore'
import { addMessage, getChat, getMessages } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import AppInputMsg from './app-input-msg'
import ConversationWrapper from './conversation-wrapper'
import LoadingBar from './loading-bar'
import { useDbLoading } from './pglite-wrapper'
import {models} from '../db/schema'

type PageChatProps = {
  className?: string
}

export default function PageChat(props: PageChatProps) {
  const { className } = props
  const { isLoading: isDbLoading, db } = useDbLoading()
  const router = useRouter()
  const pathname = usePathname()
  const { chatId } = useChatIdStore()

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [hash, setHash] = useState('')

  // const db = usePGlite()

  // const models = useLiveQuery(
  //   `
  //   SELECT *
  //   FROM models;
  // `,
  //   [isDbLoading]
  // )

  // /* ###Thi */ console.log(`👉👉👉 items: `, models)

  db.select().from(models).then((result: any) => {
    /* ###Thi */ console.log(`👉👉👉 items: `, result)
  })

  // useEffect(() => {
  //   const getModels = async () => {
  //     const allModels = await db.select().from('models')
  //     // if (allModels.length === 0) {
  //     //   console.log('No data found, inserting initial data...')
  //     //   await db.insert('models').values({
  //     //     id: '1',
  //     //     name: 'Model A',
  //     //     service: 'openai',
  //     //     context: 2048
  //     //   })
  //     // }
  //     /* ###Thi */ console.log(`👉👉👉 models: `, allModels)
  //   }

  //   if (!isDbLoading) {
  //     getModels()
  //   }
  // }, [isDbLoading])

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

  // Fake conversations
  const conversations = [
    {
      id: '1',
      messages
    }
    // ,
    // {
    //   id: '2'
    // }
    // ,
    // {
    //   id: '3'
    // }
  ]

  if (isDbLoading) {
    return <LoadingBar isLoading={true} />
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <LoadingBar isLoading={isPageLoading} />
      {/* <div ref={messagesContainerRef} className="x-flex-1 overflow-y-auto">
        <Container className="h-full">
          {!isPageLoading && (
            <div className={cn('flex h-full w-full scroll-mb-[250px] flex-col gap-8 px-4 pb-14 pt-8', className)}>
              {messages
                .filter(msg => !!msg.content)
                .map((msg, i) => (
                  <MessagePreview
                    key={msg.id ?? i}
                    message={msg}
                    isLoading={isLoading}
                    isLast={i === messages.filter(msg => !!msg.content).length - 1}
                  />
                ))}
              {!messages.length && (
                <div className="x-flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                  <BrandLogoWithText
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

              <div ref={messagesEndRef} className="h-4 min-h-4 min-w-8 shrink-0"></div>
            </div>
          )}
        </Container>
      </div> */}

      <div className={cn('flex min-h-0 flex-1 flex-row items-center justify-center divide-x py-6')}>
        {conversations.map(conversation => (
          <ConversationWrapper
            key={conversation.id}
            className="h-full flex-1"
            messages={messages}
            smallText={conversations.length > 2}
          />
        ))}
      </div>

      <AppInputMsg
        className="pb-4"
        useChatParams={{ input, setInput, handleSubmit, setMessages, messages, isLoading, stop }}
      />
    </div>
  )
}
