'use client'

import { UseChatHelpers } from 'ai/react/dist'
import { Globe, Paperclip, Send, Square } from 'lucide-react'
import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { v4 as uuidv4 } from 'uuid'
import { generateTitleFromUserMessage } from '../app/actions'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { addMessage, createChat } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
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
    isLoading: UseChatHelpers['isLoading']
    stop: UseChatHelpers['stop']
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

    try {
      if (useChatParams) {
        if (!chat) {
          const title = await generateTitleFromUserMessage(useChatParams.input).catch(e => {
            const errMsg = `Error when generating the title for this chat: ${e instanceof Error ? e.message : 'Unknown error!'}. Using a part of the user input instead.`
            xtoast.warning(errMsg)
            return useChatParams.input.slice(0, 50)
          })
          await createChat(title, chatId)
        }

        useChatParams.handleSubmit()

        await addMessage(chatId, {
          id: uuidv4(),
          role: 'user',
          content: useChatParams.input,
          createdAt: new Date(),
          chatId
        })
      }
    } catch (error) {
      xtoast.error(
        `${error instanceof Error ? error.message : 'There is an unknown error when submitting a new message!'}`
      )
    }
  }

  const handleStopMessage = () => {
    if (useChatParams.stop) useChatParams.stop()
  }

  return (
    <Container className={cn('flex flex-row gap-4 md:gap-5 lg:gap-6 pt-4', className)}>
      {/* Fake div to use the gap, this is the same as in messages' container, copied from ChatGPT. */}
      <div className="w-0"></div>
      <div className="flex x-flex-1 flex-col items-center gap-2">
        <form
          onSubmit={handleClientSubmit}
          className="flex x-flex-1 flex-col bg-gray-100 rounded-3xl w-full overflow-hidden"
        >
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
          <div className="flex flex-row justify-between gap-4 items-center p-2 pr-3 pt-0">
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
              onClick={() => (useChatParams.isLoading ? handleStopMessage() : handleClientSubmit())}
              className={cn(
                'flex items-center hover:bg-principal hover:text-white h-8 w-8 justify-center text-white bg-principal rounded-full',
                {
                  '[&_svg]:size-[15px]': useChatParams.isLoading,
                  '[&_svg]:size-[18px]': !useChatParams.isLoading
                }
              )}
              variant="ghost"
              size="iconBig"
            >
              {!useChatParams.isLoading && <Send className="-rotate-45 mt-1" />}
              {useChatParams.isLoading && <Square className="fill-white" />}
            </Button>
          </div>
        </form>
        <div className="text-[0.7rem] text-muted-foreground select-none">Usage of this chat: $0.5, tokens: 100.</div>
      </div>
    </Container>
  )
}
