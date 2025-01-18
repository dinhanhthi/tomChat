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
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Library,
  List,
  ListOrdered,
  Loader2,
  LucideIcon,
  Paperclip,
  Quote,
  Redo,
  Strikethrough,
  Undo,
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
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [showPromptCollection, setShowPromptCollection] = useState(false)

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
        <div className="h-11 w-full overflow-hidden">
          <div
            className={cn('w-full origin-bottom px-5 transition-all duration-200', {
              'translate-y-full opacity-0': !showInputTools,
              'translate-y-0 opacity-100': showInputTools
            })}
          >
            <div className="flex w-full flex-row items-center gap-2 rounded-t-xl border-slate-200 bg-gray-100 p-2">
              <TextToolButton
                icon={Undo}
                onClick={() => editor?.chain().focus().undo().run()}
                tooltip="Undo"
                editor={editor}
              />
              <TextToolButton
                icon={Redo}
                onClick={() => editor?.chain().focus().redo().run()}
                tooltip="Redo"
                editor={editor}
              />
              <TextToolButton
                icon={Heading1}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                tooltip="Heading H1"
                active={editor?.isActive('heading', { level: 1 })}
                editor={editor}
              />
              <TextToolButton
                icon={Heading2}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                tooltip="Heading H2"
                active={editor?.isActive('heading', { level: 2 })}
                editor={editor}
              />
              <TextToolButton
                icon={Heading3}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                tooltip="Heading H3"
                active={editor?.isActive('heading', { level: 3 })}
                editor={editor}
              />
              <TextToolButton
                icon={Bold}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                tooltip="Bold"
                active={editor?.isActive('bold')}
                editor={editor}
              />
              <TextToolButton
                icon={Italic}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                tooltip="Italic"
                active={editor?.isActive('italic')}
                editor={editor}
              />
              <TextToolButton
                icon={Strikethrough}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                tooltip="Strikethrough"
                active={editor?.isActive('strike')}
                editor={editor}
              />
              <TextToolButton
                icon={Code}
                onClick={() => editor?.chain().focus().toggleCode().run()}
                tooltip="Mark as code"
                active={editor?.isActive('code')}
                editor={editor}
              />
              <TextToolButton
                icon={Braces}
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                tooltip="Code block"
                active={editor?.isActive('codeBlock')}
                editor={editor}
              />
              <TextToolButton
                icon={List}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                tooltip="Bulleted list"
                active={editor?.isActive('bulletList')}
                editor={editor}
              />
              <TextToolButton
                icon={ListOrdered}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                tooltip="Numbered list"
                active={editor?.isActive('orderedList')}
                editor={editor}
              />
              <TextToolButton
                icon={Quote}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                tooltip="Quote"
                active={editor?.isActive('blockquote')}
                editor={editor}
              />
            </div>
          </div>
        </div>
        <form
          onSubmit={handleClientSubmit}
          className="x-flex-1 mb-2 flex w-full flex-col rounded-3xl border-gray-200 bg-gray-100 p-3"
        >
          {/* Image previews */}
          {pastedImages.length > 0 && (
            <div className="flex w-full gap-2 overflow-auto rounded-tl-2xl px-2 pb-2 pt-2">
              {pastedImages.map(image => (
                <div
                  key={image.id}
                  className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200"
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

          <div className="max-h-[calc(25dvh)] min-h-6 overflow-auto bg-transparent p-2">
            <DynamicEditorContent editor={editor} className="pM-prose max-w-none focus-visible:outline-none" />
          </div>

          <div className="flex flex-row items-center justify-between gap-4 pr-1">
            <div className="flex flex-row items-center gap-1">
              {/* Attach */}
              <FooterButton icon={Paperclip} onClick={() => {}} tooltip="Attach files" />
              {/* Web Search */}
              <FooterButton
                icon={Globe}
                onClick={() => {
                  setSearchEnabled(!searchEnabled)
                }}
                tooltip="Search the web"
                active={searchEnabled}
              />
              {/* Text tools */}
              <FooterButton
                icon={Baseline}
                onClick={() => {
                  setShowInputTools(!showInputTools)
                }}
                tooltip="Text tools"
                active={showInputTools}
              />
              {/* Prompt collection */}
              <FooterButton
                icon={Library}
                onClick={() => {
                  setShowPromptCollection(!showPromptCollection)
                }}
                tooltip="Prompt collection"
                active={showPromptCollection}
              />
            </div>
            {/* <div className="flex h-full flex-row items-end pb-1">
              <SimpleTooltip text="Usage of this chat">
                <div className="flex h-fit select-none flex-row divide-x divide-slate-300 rounded-md border-gray-300 px-2 text-xs text-gray-400">
                  <div className="flex flex-row flex-nowrap items-center gap-0.5 whitespace-nowrap pr-1.5">
                    <TokenIcon className="h-4 w-4" />
                    <span>1.2K</span>
                  </div>

                  <div className="pl-1.5">$15.00</div>
                </div>
              </SimpleTooltip>
            </div> */}
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

const FooterButton = ({
  icon: Icon,
  onClick,
  tooltip,
  tooltipPosition = 'bottom',
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
      className={cn(
        'rounded-xl hover:bg-gray-200 [&_svg]:size-[22px]',
        active && 'bg-gray-200 text-primary hover:text-primary',
        className
      )}
      variant="ghost"
      size="iconBig"
      tooltip={tooltip}
      tooltipPosition={tooltipPosition}
    >
      <Icon />
    </Button>
  )
}

const TextToolButton = ({
  icon: Icon,
  onClick,
  tooltip,
  tooltipPosition = 'top',
  className,
  active,
  editor
}: {
  icon: LucideIcon
  onClick: (e: React.MouseEvent) => void
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  active?: boolean
  editor: any
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
