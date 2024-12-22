'use client'

import { UseChatHelpers } from 'ai/react/dist'
import { Globe, Paperclip, Send } from 'lucide-react'
import { useRef } from 'react'
import { cn } from '../lib/utils'
import Container from './container'
import { Button } from './ui/button'

export default function AppInputMsg(props: {
  className?: string
  input: UseChatHelpers['input']
  handleInputChange: UseChatHelpers['handleInputChange']
  handleSubmit: UseChatHelpers['handleSubmit']
}) {
  const { className, input, handleInputChange, handleSubmit } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event)
    adjustHeight()
  }

  return (
    <Container className={cn('flex flex-row gap-4 md:gap-5 lg:gap-6 pt-2', className)}>
      {/* Fake div to use the gap, this is the same as in messages' container, copied from ChatGPT. */}
      <div></div>
      <div className="flex-1 flex flex-col items-center gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col p-2 bg-gray-100 rounded-3xl w-full">
          <textarea
            rows={1}
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            className="bg-transparent resize-none focus-visible:outline-none p-2 min-h-6 max-h-[calc(25dvh)] overflow-auto"
            placeholder="Ask something..."
            autoFocus
          />
          <div className="flex flex-row justify-between gap-4 items-center">
            <div className="flex flex-row items-center">
              <Button variant="ghost" size="iconBig" tooltip="Attach files" tooltipPosition="left">
                <Paperclip />
              </Button>
              <Button variant="ghost" size="iconBig" tooltip="Search the web" tooltipPosition="right">
                <Globe />
              </Button>
            </div>
            <Button type='submit' variant="ghost" size="iconBig">
              <Send />
            </Button>
          </div>
        </form>
        <div className="text-[0.7rem] text-muted-foreground">Usage of this chat: $0.5, tokens: 100.</div>
      </div>
    </Container>
  )
}
