'use client'

import { Extension } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { UseChatHelpers } from 'ai/react/dist'
import {
  Baseline,
  Bold,
  Braces,
  Code,
  Globe,
  Italic,
  Library,
  List,
  ListOrdered,
  Loader2,
  LucideIcon,
  Paperclip,
  Quote,
  Strikethrough,
  Underline,
  X
} from 'lucide-react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Typography from '@tiptap/extension-typography'
import { generateTitleFromUserMessage } from '../app/actions'
import { useChatClient } from '../hooks/useChatClient'
import { useChatStore } from '../hooks/useChatStore'
import { TokenIcon } from '../icons/TokenIcon'
import { addMessage, createChat } from '../lib/chats'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import '../styles/tiptap.scss'
import Container from './container'
import SendButton from './send-button'
import StopButton from './stop-button'
import { Button } from './ui/button'
import SimpleTooltip from './ui/simple-tooltip'
import styles from '../styles/toolbar.module.css'

const ShiftEnterExtension = Extension.create({
  name: 'shiftEnterHandler',
  addKeyboardShortcuts() {
    return {
      'Shift-Enter': () => {
        if (this.editor.isActive('codeBlock')) {
          const isEmpty = this.editor.state.selection.$head.parent.content.size === 0

          if (isEmpty) {
            return this.editor.commands.exitCode()
          }

          return this.editor.commands.insertContent('\n')
        }

        if (this.editor.isActive('listItem')) {
          const isEmpty = this.editor.state.selection.$head.parent.content.size === 0

          if (isEmpty) {
            this.editor.commands.liftListItem('listItem')
            return true
          }

          this.editor.commands.splitListItem('listItem')
          return true
        }

        // For regular paragraphs and other blocks
        return this.editor.commands.splitBlock()
      }
    }
  }
})

const DynamicEditorContent = dynamic(() => Promise.resolve(EditorContent), {
  ssr: false
})

type PastedImage = {
  id: string
  file: File
  previewUrl: string
  loading?: boolean
}

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
  const [pastedImages, setPastedImages] = useState<PastedImage[]>([])
  const [showInputTools, setShowInputTools] = useState(false)

  const editor = useEditor({
    // https://tiptap.dev/docs/editor/extensions/functionality/starterkit
    extensions: [
      StarterKit.configure({
        codeBlock: {
          exitOnArrowDown: true
        },
        heading: {
          levels: [1, 2, 3]
        }
      }),
      ShiftEnterExtension,
      // CustomListItem,
      Typography,
      Placeholder.configure({
        placeholder: 'Ask something...'
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      })
    ],

    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const image = items.find(item => /image/.test(item.type))

        if (image) {
          event.preventDefault()
          const file = image.getAsFile()
          if (!file) return false

          const id = uuidv4()
          const reader = new FileReader()

          setPastedImages(prev => [
            ...prev,
            {
              id,
              file,
              previewUrl: URL.createObjectURL(file),
              loading: true
            }
          ])

          reader.onload = () => {
            setPastedImages(prev => prev.map(img => (img.id === id ? { ...img, loading: false } : img)))
          }

          reader.readAsDataURL(file)
          return true
        }
        return false
      }
    },

    content: useChatParams.input,
    onUpdate: ({ editor }) => {
      const content = editor.getText()
      useChatParams.setInput(content)
    },
    immediatelyRender: false // SSR
  })

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
        // Handle both text and images here
        const content = useChatParams.input
        const images = pastedImages.map(img => img.file)

        if (!chat) {
          const title = await generateTitleFromUserMessage(content).catch(e => {
            const errMsg = `Error when generating the title for this chat: ${e instanceof Error ? e.message : 'Unknown error!'}. Using a part of the user input instead.`
            xtoast.warning(errMsg)
            return useChatParams.input.slice(0, 50)
          })
          await createChat(title, chatId)
        }

        // Here you can handle images separately or combine them with the message
        // For example:
        await addMessage(chatId, {
          id: uuidv4(),
          role: 'user',
          content,
          // images: images, // You'll need to modify your message type to include images
          createdAt: new Date(),
          chatId
        })

        // Clear images after successful submission
        setPastedImages([])
        useChatParams.handleSubmit()
      }
    } catch (error) {
      xtoast.error(
        `${error instanceof Error ? error.message : 'There is an unknown error when submitting a new message!'}`
      )
    }
  }

  const removeImage = (id: string) => {
    setPastedImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <Container className={cn('flex flex-row gap-4 pt-4 md:gap-5 lg:gap-6', className)}>
      {/* Fake div to use the gap, this is the same as in messages' container, copied from ChatGPT. */}
      <div className="w-0"></div>
      <div className="x-flex-1 flex flex-col items-center">
        <div className={styles.toolbarContainer}>
          <div
            className={cn(
              styles.toolbar,
              'w-full px-5',
              showInputTools ? styles.toolbarVisible : styles.toolbarHidden
            )}
          >
            <div className="flex w-full flex-row items-center gap-2 rounded-t-xl border-slate-200 bg-gray-100 p-2">
              <TextToolButton icon={Bold} onClick={() => {}} tooltip="Bold" />
              <TextToolButton icon={Italic} onClick={() => {}} tooltip="Italic" />
              <TextToolButton icon={Underline} onClick={() => {}} tooltip="Underline" />
              <TextToolButton icon={Strikethrough} onClick={() => {}} tooltip="Strikethrough" />
              <TextToolButton icon={Code} onClick={() => {}} tooltip="Mark as code" />
              <TextToolButton icon={Braces} onClick={() => {}} tooltip="Code block" />
              <TextToolButton icon={List} onClick={() => {}} tooltip="Bulleted list" />
              <TextToolButton icon={ListOrdered} onClick={() => {}} tooltip="Numbered list list" />
              <TextToolButton icon={Quote} onClick={() => {}} tooltip="Quote" />
            </div>
          </div>
        </div>
        <form
          onSubmit={handleClientSubmit}
          className="x-flex-1 mb-2 flex w-full flex-col rounded-3xl border-gray-200 bg-gray-100 p-3"
        >
          {/* Image previews */}
          {pastedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 overflow-hidden rounded-tl-2xl px-2 pt-2">
              {pastedImages.map(image => (
                <div
                  key={image.id}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
                >
                  {image.loading ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <NextImage src={image.previewUrl} alt="Pasted image" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="max-h-[calc(25dvh)] min-h-6 overflow-auto bg-transparent p-2 pt-3">
            <DynamicEditorContent editor={editor} className="pM-prose max-w-none focus-visible:outline-none" />
          </div>

          <div className="flex flex-row items-center justify-between gap-4 pr-1">
            <div className="flex flex-row items-center gap-1">
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
                tooltipPosition="bottom"
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
                tooltipPosition="bottom"
              >
                <Globe />
              </Button>
              {/* Text tools */}
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowInputTools(!showInputTools)
                }}
                className={cn('rounded-xl hover:bg-gray-200 [&_svg]:size-[22px]', {
                  'bg-gray-200 text-primary hover:text-primary': showInputTools
                })}
                variant="ghost"
                size="iconBig"
                tooltip="Input tools"
                tooltipPosition="bottom"
              >
                <Baseline />
              </Button>
              {/* Prompt collection */}
              <Button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="rounded-xl hover:bg-gray-200 [&_svg]:size-[22px]"
                variant="ghost"
                size="iconBig"
                tooltip="Prompt collection"
                tooltipPosition="bottom"
              >
                <Library />
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
        <div className="select-none text-xs text-muted-foreground">
          AI can make mistakes. Double check important info.
        </div>
      </div>
    </Container>
  )
}

const TextToolButton = ({
  icon: Icon,
  onClick,
  tooltip,
  tooltipPosition = 'top',
  className,
  active
}: {
  icon: LucideIcon
  onClick: (e: React.MouseEvent) => void
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  active?: boolean
}) => {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
      }}
      className={cn('h-6 w-6 rounded-md hover:bg-gray-200 [&_svg]:size-[16px]', active && 'bg-gray-200', className)}
      variant="ghost"
      size="icon"
      tooltip={tooltip}
      tooltipPosition={tooltipPosition}
    >
      <Icon />
    </Button>
  )
}
