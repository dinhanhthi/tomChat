'use client'

import { UseChatHelpers } from 'ai/react/dist'
import { Globe, Paperclip } from 'lucide-react'
import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { v4 as uuidv4 } from 'uuid'
import { generateTitleFromUserMessage } from '../app/actions'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { TokenIcon } from '../icons/TokenIcon'
import { addMessage, createChat } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import Container from './container'
import SendButton from './send-button'
import StopButton from './stop-button'
import { Button } from './ui/button'
import SimpleTooltip from './ui/simple-tooltip'

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

  return (
    <Container className={cn('flex flex-row gap-4 pt-4 md:gap-5 lg:gap-6', className)}>
      {/* Fake div to use the gap, this is the same as in messages' container, copied from ChatGPT. */}
      <div className="w-0"></div>
      <div className="x-flex-1 flex flex-col items-center gap-2">
        <form
          onSubmit={handleClientSubmit}
          className="x-flex-1 flex w-full flex-col overflow-hidden rounded-3xl border-gray-200 bg-gray-100"
        >
          <TextareaAutosize
            rows={1}
            autoComplete="off"
            tabIndex={0}
            autoCorrect="off"
            ref={textareaRef}
            value={useChatParams.input}
            onChange={handleClientInputChange}
            className="max-h-[calc(25dvh)] min-h-6 resize-none overflow-auto bg-transparent p-2 pl-4 pt-4 focus-visible:outline-none"
            placeholder="Ask something..."
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex flex-row items-center justify-between gap-4 p-2 pr-3 pt-0">
            <div className="flex flex-row items-center">
              {/* Attach */}
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="rounded-xl rounded-bl-2xl hover:bg-gray-200 [&_svg]:size-[22px]"
                variant="ghost"
                size="iconBig"
                tooltip="Attach files"
                tooltipPosition="left"
              >
                <Paperclip />
              </Button>
              {/* Web Search */}
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="rounded-xl hover:bg-gray-200 [&_svg]:size-[22px]"
                variant="ghost"
                size="iconBig"
                tooltip="Search the web"
                tooltipPosition="right"
              >
                <Globe />
              </Button>
            </div>
            <div className="flex h-full flex-row items-end pb-1">
              <SimpleTooltip text="Usage of this chat">
                <div className="flex h-fit select-none flex-row divide-x divide-slate-300 rounded-md border-gray-300 px-2 text-xs text-gray-400">
                  <div className="flex flex-row flex-nowrap items-center gap-0.5 whitespace-nowrap pr-1.5">
                    <TokenIcon className="h-4 w-4" />
                    <span>1.2K</span>
                  </div>

                  <div className="pl-1.5">$15.00</div>
                </div>
              </SimpleTooltip>
            </div>
            {useChatParams.isLoading && (
              <StopButton stop={useChatParams.stop} setMessages={useChatParams.setMessages} />
            )}
            {!useChatParams.isLoading && <SendButton submitForm={handleClientSubmit} input={useChatParams.input} />}
          </div>
        </form>
        {/* <div className="select-none text-[0.7rem] text-muted-foreground">Usage of this chat: $0.5, tokens: 100.</div> */}
        <div className="select-none text-xs text-muted-foreground">
          AI can make mistakes. Double check important info.
        </div>
      </div>
    </Container>
  )
}
