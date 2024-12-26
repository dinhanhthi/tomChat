import { Message } from 'ai'
import { Copy, RefreshCw, Volume2 } from 'lucide-react'
import Image from 'next/image'
import RemarkMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import LogoOpenAI from '../../public/img/services/openai.svg'
import { cn, processMarkdownString } from '../lib/utils'
import { Pre } from './markdown-blocks'
import { Button } from './ui/button'

interface MessagePreviewProps {
  className?: string
  message: Message
}

export default function MessagePreview(props: MessagePreviewProps) {
  const { message, className } = props
  const isUser = message.role === 'user'

  return (
    <article
      className={cn(
        'flex flex-row items-start gap-4 md:gap-5 lg:gap-6 w-full',
        {
          'ml-auto p-4 bg-gray-100 rounded-2xl max-w-[70%]': isUser
        },
        className
      )}
    >
      {!isUser && (
        <div className="rounded-full p-2 border border-slate-300 flex items-center justify-center shrink-0">
          <Image src={LogoOpenAI} alt="OpenAI" width={20} height={20} className="shrink-0 !m-0" />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <RemarkMarkdown
          className={cn('x-prose text-[0.95rem]')}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            pre: Pre
          }}
        >
          {processMarkdownString(message.content)}
        </RemarkMarkdown>
        {!isUser && (
          <div className="flex flex-row items-center ml-auto text-muted-foreground">
            <Button variant="ghost" size="icon" tooltip="Read aloud" tooltipPosition="bottom">
              <Volume2 />
            </Button>
            <Button variant="ghost" size="icon" tooltip="Copy" tooltipPosition="bottom">
              <Copy />
            </Button>
            <Button variant="ghost" size="icon" tooltip="Try again" tooltipPosition="bottom">
              <RefreshCw />
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}
