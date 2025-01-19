import { UseChatHelpers } from 'ai/react/dist'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Heart, RefreshCw, Volume2 } from 'lucide-react'
import Image from 'next/image'
import RemarkMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import LogoOpenAI from '../../public/img/services/openai.svg'
import { useFavoriteMessages } from '../hooks/useFavoriteMessages'
import { exMessage } from '../interface'
import { cn, processMarkdownString } from '../lib/utils'
import { Pre } from './markdown-blocks'
import { Button } from './ui/button'

interface MessagePreviewProps {
  className?: string
  message: exMessage
  isLoading: UseChatHelpers['isLoading']
  isLast?: boolean
}

export default function MessagePreview(props: MessagePreviewProps) {
  const { message, className, isLoading, isLast } = props
  const isUser = message.role === 'user'
  const { isFavoriteMessage, toggleFavoriteMessage } = useFavoriteMessages()

  const toggleFavorite = async () => {
    toggleFavoriteMessage(message.id)
  }

  return (
    <AnimatePresence>
      <motion.article
        id={message.id}
        className={cn(
          'flex w-full scroll-mt-[20px] flex-row items-start gap-4 md:gap-5 lg:gap-6',
          {
            'ml-auto max-w-[70%] rounded-2xl bg-gray-100 p-4': isUser
          },
          className
        )}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {!isUser && (
          <div className="flex shrink-0 items-center justify-center rounded-full border border-slate-300 p-2">
            <Image src={LogoOpenAI} alt="OpenAI" width={20} height={20} className="!m-0 shrink-0" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <RemarkMarkdown
            className={cn('x-prose text-[0.97rem]', {
              'first:mt-2': !isUser
            })}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
            components={{
              pre: Pre
            }}
          >
            {processMarkdownString(message.content)}
          </RemarkMarkdown>
          {!isUser && (
            <div
              className={cn('ml-auto flex flex-row items-center text-muted-foreground', {
                invisible: isLoading && isLast
              })}
            >
              <Button
                onClick={toggleFavorite}
                variant="ghost"
                size="icon"
                tooltip="Add to favorite"
                tooltipPosition="bottom"
              >
                <Heart className={cn({ 'fill-slate-700': isFavoriteMessage(message.id) })} />
              </Button>
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
      </motion.article>
    </AnimatePresence>
  )
}
