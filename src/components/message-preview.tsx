import { Copy, RefreshCw, Volume2 } from 'lucide-react'
import Image from 'next/image'
import RemarkMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import LogoOpenAI from '../../public/img/services/openai.svg'
import { Message } from '../interface'
import { cn, processMarkdownString } from '../lib/utils'
import { Pre } from './markdown-blocks'
import { Button } from './ui/button'

interface MessagePreviewProps {
  className?: string
  message: Message
}

export default function MessagePreview(props: MessagePreviewProps) {
  const { message, className } = props

  return (
    <article
      className={cn(
        'flex flex-row items-start gap-4 md:gap-5 lg:gap-6',
        {
          'ml-auto p-4 bg-gray-100 rounded-2xl': message.user
        },
        className
      )}
    >
      {!message.user && (
        <div className="rounded-full p-2 border border-slate-300 flex items-center justify-center">
          <Image src={LogoOpenAI} alt="OpenAI" width={20} height={20} className="shrink-0 !m-0" />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        <RemarkMarkdown
          className={cn('text-sm x-prose [&>*]:last:mb-0', {
            '[&>*]:first:mt-2': !message.user,
            '[&>*]:first:mt-0': message.user
          })}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            pre: Pre
          }}
        >
          {processMarkdownString(message.text)}
        </RemarkMarkdown>
        {!message.user && (
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
