import Image from 'next/image'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import LogoOpenAI from '../../public/img/services/openai.svg'
import { Message } from '../interface'
import { cn } from '../lib/utils'

export default function MessagePreview(props: { className?: string; message: Message }) {
  const { message: msg, className } = props
  return (
    <article
      className={cn(
        'flex flex-row items-start gap-4 md:gap-5 lg:gap-6',
        {
          'ml-auto p-4 bg-gray-100 rounded-2xl': msg.user
        },
        className
      )}
    >
      {!msg.user && (
        <div className="rounded-full p-2 border border-slate-300 flex items-center justify-center">
          <Image src={LogoOpenAI} alt="OpenAI" width={20} height={20} className="shrink-0 !m-0" />
        </div>
      )}
      <div>
        <Markdown className={cn('text-sm x-prose [&>*]:first:mt-0')} rehypePlugins={[rehypeHighlight, remarkGfm]}>
          {msg.text}
        </Markdown>
      </div>
    </article>
  )
}
