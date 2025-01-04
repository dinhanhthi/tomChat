import { Archive, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Chat } from '../interface'
import OverflowTooltip from './overflow-tooltip'

export default function SearchGroupChat({ label, chats = [] }: { label: string; chats?: Chat[] }) {
  return (
    <>
      {chats.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="px-3 text-xs font-medium text-black">{label}</div>
          <div className="flex flex-col gap-0.5">
            {chats.map(chat => (
              <Link
                className="group flex w-full flex-row items-center gap-3 rounded-md p-2 px-3 text-sm hover:bg-slate-100"
                key={chat.id}
                href={`/chat/${chat.id}`}
              >
                {chat.icon && <span>{chat.icon}</span>}
                {!chat.icon && <MessageCircle className="h-4 w-4" />}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <OverflowTooltip
                    className="select-none"
                    text={chat.title}
                    position="top"
                    delayDuration={700}
                    textHighlight={chat.searchResult?.highlightedTitle}
                  ></OverflowTooltip>
                  {chat.searchResult?.highlightedContent && (
                    <div
                      className="line-clamp-1 overflow-hidden text-xs text-slate-500"
                      dangerouslySetInnerHTML={{ __html: chat.searchResult.highlightedContent }}
                    ></div>
                  )}
                </div>
                {chat.updatedAt && (
                  <div className="hidden text-xs text-slate-500 group-hover:block">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                )}
                {chat.archived === 'true' && <Archive className="h-4 w-4 text-gray-500" />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
