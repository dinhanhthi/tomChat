import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Chat } from '../interface'
import OverflowTooltip from './overflow-tooltip'

export default function SearchGroupChat({ label, chats = [] }: { label: string; chats?: Chat[] }) {
  return (
    <>
      {chats.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="px-2 text-xs font-medium">{label}</div>
          <div className="flex flex-col gap-0.5">
            {chats.map(chat => (
              <Link
                className="flex flex-row items-center gap-2 rounded-md p-2 text-sm hover:bg-slate-100"
                key={chat.id}
                href={`/chat/${chat.id}`}
              >
                {chat.icon && <span>{chat.icon}</span>}
                {!chat.icon && <MessageCircle className="h-4 w-4" />}
                <OverflowTooltip
                  className="select-none"
                  text={chat.title}
                  position="right"
                  delayDuration={700}
                ></OverflowTooltip>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
