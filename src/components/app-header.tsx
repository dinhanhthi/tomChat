'use client'

import { Edit, MessageSquareShare, Pencil, Search, SlidersHorizontal } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { Chat } from '../interface'
import { updateChatMeta } from '../lib/chats'
import { getOperatingSystem } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import { RenameDialog } from './dialog-rename'
import { EmojiPickerButton } from './emoji-picker-button'
import OverflowTooltip from './overflow-tooltip'
import { useSearchDialogStore } from './search-dialog-wrapper'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { UserMenu } from './user-menu'

export default function AppHeader() {
  const router = useRouter()
  const { setIsOpen } = useSearchDialogStore()
  const { id } = useParams()
  const { activeId } = useChatStore()
  const chatId = id || activeId
  const { chat } = useChatClient(chatId as string)
  const chatTitle = chat?.title

  const [emojiOpen, setEmojiOpen] = useState(false)

  const [renameChat, setRenameChat] = useState<Chat | null>(null)
  const handleRename = async (newTitle: string) => {
    if (!renameChat) return
    await updateChatMeta(renameChat.id, 'title', newTitle)
    xtoast.success('Chat renamed successfully!')
  }

  const handleEmojiSelect = async (emoji: any) => {
    if (!chat) return
    await updateChatMeta(chat.id, 'icon', emoji.native)
    setEmojiOpen(false)
  }

  const handleIconChangeBtnClicked = (e: React.MouseEvent, _chat: Chat) => {
    e.stopPropagation()
    e.preventDefault()
    setEmojiOpen(!emojiOpen)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen])

  const isMac = getOperatingSystem() === 'mac'

  return (
    <>
      <header className="flex h-14 w-full shrink-0 flex-row items-center justify-between border-b border-slate-200 pl-2 pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="x-flex-1 group flex items-center gap-2">
          <div className="flex items-center">
            <SidebarTrigger
              tooltip={`Toggle sidebar (${isMac ? '⌘' : 'Ctrl'}+B)`}
              tooltipPosition="bottom"
              className="group-data-[collapsible=icon]:opacity-0"
            />
            <Button
              onClick={() => {
                router.push('/')
                router.refresh()
              }}
              variant="ghost"
              size="iconBig"
              tooltip="New chat"
              tooltipPosition="bottom"
            >
              <Edit />
            </Button>
          </div>
          {chatTitle && (
            <>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="x-flex-1 flex items-center gap-2 truncate pl-1 pr-4 text-[1.05rem]">
                {chat?.icon && (
                  <EmojiPickerButton
                    size="lg"
                    popupOpen={emojiOpen}
                    onPopupOpenChange={setEmojiOpen}
                    currentIcon={chat.icon}
                    onEmojiSelect={handleEmojiSelect}
                    handleBtnClick={e => handleIconChangeBtnClicked(e, chat)}
                    tooltip="Change Icon"
                    tooltipPosition="bottom"
                  />
                )}
                <OverflowTooltip text={chatTitle} position="bottom" delayDuration={1}></OverflowTooltip>
                <Button
                  className="hidden group-hover:inline-flex"
                  variant="ghost"
                  size="icon"
                  tooltip="Rename"
                  tooltipPosition="bottom"
                  onClick={() => setRenameChat(chat)}
                >
                  <Pencil />
                </Button>
              </div>
            </>
          )}
          {!chatTitle && <div className="x-flex-1 text-center font-medium text-gray-700">Add a new chat</div>}
        </div>
        <div className="flex flex-row items-center gap-1">
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            size="iconBig"
            tooltip={`Search chat (${isMac ? '⌘' : 'Ctrl'}+K)`}
            tooltipPosition="bottom"
          >
            <Search />
          </Button>
          <Button variant="ghost" size="iconBig" tooltip="Share this chat" tooltipPosition="bottom">
            <MessageSquareShare />
          </Button>
          <Button variant="ghost" size="iconBig" tooltip="Configs" tooltipPosition="bottom">
            <SlidersHorizontal />
          </Button>
          <UserMenu />
        </div>
      </header>
      <RenameDialog
        open={!!renameChat}
        onOpenChange={open => !open && setRenameChat(null)}
        title={renameChat?.title || ''}
        onRename={handleRename}
      />
    </>
  )
}
