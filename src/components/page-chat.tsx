'use client'

import { DEFAULT_MODEL_ID, getServiceInfoFromModelId } from '@/lib/models'
import { useChat } from '@ai-sdk/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useChatIdStore } from '../hooks/useChatIdStore'
import { getApiKey } from '../lib/api-helpers'
import { addMessage, getChat, getMessages, updateChatMeta } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import AppInputMsg from './app-input-msg'
import BrandLogoWithText from './brand'
import Container from './container'
import LoadingBar from './loading-bar'
import MessagePreview from './message-preview'

type PageChatProps = {
  className?: string
}

export default function PageChat(props: PageChatProps) {
  const { className } = props
  const router = useRouter()
  const pathname = usePathname()
  const { chatId } = useChatIdStore()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [hash, setHash] = useState('')
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined)
  const [serviceInfo, setServiceInfo] = useState<any>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)

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

  // Model loading priority:
  // 1. Start with undefined (loading state)
  // 2. Check if chat has a model and use it
  // 3. Check if localStorage has a default model and use it if no chat model exists
  // 4. Fall back to DEFAULT_MODEL_ID
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true)

      try {
        // Check if there's a chat with a specific model
        if (chatId) {
          const chat = await getChat(chatId)
          if (chat?.model) {
            setSelectedModelId(chat.model)
            setIsModelLoading(false)
            return // If chat has a model, use it and don't check localStorage
          }
        }

        // If no chat model, check localStorage for default model
        if (typeof window !== 'undefined') {
          const storedModelId = localStorage.getItem('default_model_id')
          if (storedModelId) {
            setSelectedModelId(storedModelId)

            // If we have a chat but no model set, update the chat model
            if (chatId) {
              await updateChatMeta(chatId, 'model', storedModelId).catch(error => {
                console.error('Failed to update chat model from localStorage:', error)
              })
            }

            setIsModelLoading(false)
            return
          }
        }

        // Fall back to DEFAULT_MODEL_ID if no other model is found
        setSelectedModelId(DEFAULT_MODEL_ID)

        // If we have a chat but no model set, update the chat model
        if (chatId) {
          await updateChatMeta(chatId, 'model', DEFAULT_MODEL_ID).catch(error => {
            console.error('Failed to update chat model with default:', error)
          })
        }
      } catch (error) {
        console.error('Error loading model:', error)
        // Fall back to DEFAULT_MODEL_ID in case of error
        setSelectedModelId(DEFAULT_MODEL_ID)
      }

      setIsModelLoading(false)
    }

    loadModel()
  }, [chatId])

  // Update serviceInfo and apiKey whenever selectedModelId changes
  useEffect(() => {
    if (selectedModelId) {
      const info = getServiceInfoFromModelId(selectedModelId)
      setServiceInfo(info)
      if (info) {
        const key = getApiKey(info.key)
        setApiKey(key)
      }
    }
  }, [selectedModelId])

  // Verify API key exists before allowing chat
  useEffect(() => {
    if (selectedModelId && serviceInfo && !apiKey) {
      xtoast.error(`API key for ${serviceInfo.name} is required. Please set it in the Admin page.`, {
        action: {
          label: 'Go to Admin',
          onClick: () => {
            router.push('/admin#api-keys')
          }
        },
        duration: 5000
      })
    }
  }, [selectedModelId, serviceInfo, apiKey, router])

  // Create a wrapper for handleSubmit to check for API key
  const handleSubmitWithApiCheck = (event?: { preventDefault?: () => void }, chatRequestOptions?: any) => {
    if (!apiKey) {
      xtoast.error(`API key for ${serviceInfo?.name || 'this service'} is required. Please set it in the Admin page.`, {
        action: {
          label: 'Go to Admin',
          onClick: () => {
            router.push('/admin#api-keys')
          }
        },
        duration: 5000
      })
      return
    }
    handleSubmit(event, chatRequestOptions)
  }

  // https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat
  const { messages, setMessages, input, setInput, handleSubmit, status, stop } = useChat({
    api: '/api/chat',
    body: {
      apiKey: apiKey || '',
      model: selectedModelId || ''
    },
    headers: {
      'Content-Type': 'application/json'
    },
    onFinish: async (message, options) => {
      await addMessage(chatId, {
        ...message,
        serviceId: message.id,
        id: uuidv4(),
        chatId,
        usage: {
          promptTokens: options.usage?.promptTokens || 0,
          completionTokens: options.usage?.completionTokens || 0,
          totalTokens: options.usage?.totalTokens || 0
        }
      })
    },
    onError: error => {
      xtoast.error(`Error when sending the message: "${error instanceof Error ? error.message : 'Unknown error!'}"`)
    },
    // Add id prop to regenerate the chat client when model or API key changes
    id: `${selectedModelId || ''}-${apiKey || ''}`
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

  // Function to handle model change from AppInputMsg
  const handleModelChange = (modelId: string | ((prevModelId: string) => string)) => {
    // Handle callback pattern if needed
    const newModelId =
      typeof modelId === 'function' && selectedModelId
        ? modelId(selectedModelId)
        : typeof modelId === 'string'
          ? modelId
          : DEFAULT_MODEL_ID

    console.log('Model changed to:', newModelId)

    // Set the selected model in the page component
    setSelectedModelId(newModelId)

    // We only save to localStorage when the user explicitly selects a model in the ModelSelector
    // This is handled in the app-input-msg.tsx file in the handleModelChange function

    // Update the chat model in the database for new chats
    if (chatId && (!messages || messages.length === 0)) {
      updateChatMeta(chatId, 'model', newModelId).catch(error => {
        console.error('Failed to update chat model:', error)
        xtoast.error('Failed to update chat model')
      })
    }
  }

  return (
    <>
      <div className={cn('flex h-full flex-col', className)}>
        <LoadingBar isLoading={isPageLoading} />
        <div ref={messagesContainerRef} className="x-flex-1 overflow-y-auto">
          <Container className="h-full">
            {!isPageLoading && (
              <div className={cn('flex h-full w-full scroll-mb-[250px] flex-col gap-8 px-4 pb-14 pt-8', className)}>
                {messages
                  .filter(msg => !!msg.content)
                  .map((msg, i) => (
                    <MessagePreview
                      key={msg.id ?? i}
                      message={msg}
                      isLoading={status === 'streaming'}
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

                {status === 'streaming' && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="is-typing text-sm italic text-muted-foreground">I'm thinking, please wait</div>
                )}

                <div ref={messagesEndRef} className="h-4 min-h-4 min-w-8 shrink-0"></div>
              </div>
            )}
          </Container>
        </div>

        <AppInputMsg
          className="pb-4"
          useChatParams={{
            input,
            setInput,
            handleSubmit: handleSubmitWithApiCheck,
            setMessages,
            messages,
            status,
            stop
          }}
          selectedModelId={selectedModelId ?? ''}
          setSelectedModelId={handleModelChange}
          isModelLoading={isModelLoading}
        />
      </div>
    </>
  )
}
