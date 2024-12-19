'use client'

import { Globe, Paperclip, Send } from 'lucide-react'
import { cn } from '../lib/utils'
import Container from './container'
import { Button } from './ui/button'
import { useRef, useState } from 'react'

export default function AppInputMsg(props: { className?: string }) {
  const { className } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  return (
    <Container className={cn(className)}>
      <div className="flex flex-col p-2 bg-gray-100 rounded-3xl">
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
          <Button variant="ghost" size="iconBig">
            <Send />
          </Button>
        </div>
      </div>
    </Container>
  )
}
