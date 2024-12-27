'use client'

import { UseChatHelpers } from 'ai/react/dist'
import { Globe, Paperclip, Send } from 'lucide-react'
import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { v4 as uuidv4 } from 'uuid'
import { generateTitleFromUserMessage } from '../app/actions'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { addMessage, createChat } from '../lib/chats'
import { cn } from '../lib/utils'
import Container from './container'
import { Button } from './ui/button'

export default function AppInputMsg(props: {
  chatId: string
  className?: string
  useChatParams: {
    input: UseChatHelpers['input']
    setInput: UseChatHelpers['setInput']
    handleSubmit: UseChatHelpers['handleSubmit']
    setMessages: UseChatHelpers['setMessages']
    messages: UseChatHelpers['messages']
  }
}) {
  const { chatId, className, useChatParams } = props
  const { setActiveId } = useChatStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { chat } = useChatClient(chatId)

  const handleClientInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (useChatParams) useChatParams.setInput(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleClientSubmit()
    }
  }

  const handleClientSubmit = async () => {
    window.history.replaceState({}, '', `/chat/${chatId}`)
    setActiveId(chatId)

    if (!chat) {
      const title = await generateTitleFromUserMessage(useChatParams.input)
      await createChat(title, chatId)
    }

    await addMessage(chatId, {
      id: uuidv4(),
      role: 'user',
      content: useChatParams.input,
      createdAt: new Date(),
      chatId
    })

    if (useChatParams) {
      useChatParams.handleSubmit()
    }
  }

  return (
    <Container className={cn('flex flex-row gap-4 md:gap-5 lg:gap-6 pt-4', className)}>
      {/* Fake div to use the gap, this is the same as in messages' container, copied from ChatGPT. */}
      <div></div>
      <div className="flex-1 flex flex-col items-center gap-2">
        <form onSubmit={handleClientSubmit} className="flex flex-col bg-gray-100 rounded-3xl w-full overflow-hidden">
          <TextareaAutosize
            rows={1}
            autoComplete="off"
            tabIndex={0}
            autoCorrect="off"
            ref={textareaRef}
            value={useChatParams.input}
            onChange={handleClientInputChange}
            className="bg-transparent resize-none focus-visible:outline-none p-2 pl-4 pt-4 min-h-6 max-h-[calc(25dvh)] overflow-auto"
            placeholder="Ask something..."
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex flex-row justify-between gap-4 items-center p-2 pt-0">
            <div className="flex flex-row items-center">
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="hover:bg-gray-200 [&_svg]:size-[22px] rounded-xl rounded-bl-2xl"
                variant="ghost"
                size="iconBig"
                tooltip="Attach files"
                tooltipPosition="left"
              >
                <Paperclip />
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="hover:bg-gray-200 [&_svg]:size-[22px] rounded-xl"
                variant="ghost"
                size="iconBig"
                tooltip="Search the web"
                tooltipPosition="right"
              >
                <Globe />
              </Button>
            </div>
            <Button
              className="hover:bg-transparent hover:text-sky-500 [&_svg]:size-[22px] rounded-xl"
              type="submit"
              variant="ghost"
              size="iconBig"
            >
              <Send />
            </Button>
          </div>
        </form>
        <div className="text-[0.7rem] text-muted-foreground">Usage of this chat: $0.5, tokens: 100.</div>
      </div>
    </Container>
  )
}
