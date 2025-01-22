'use client'

import { Extension } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { UseChatHelpers } from 'ai/react/dist'
import { Baseline, Globe, Loader2, LucideIcon, Paperclip, Settings2, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { RefObject, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Typography from '@tiptap/extension-typography'
import { usePathname, useRouter } from 'next/navigation'
import TurndownService from 'turndown'
import { generateTitleFromUserMessage } from '../app/actions'
import { useChatClient } from '../hooks/useChatClient'
import { useChatIdStore } from '../hooks/useChatIdStore'
import { useOperatingSystem } from '../hooks/useOperatingSystem'
import { addMessage, createChat } from '../lib/chats'
import { DEFAULT_MODEL_ID } from '../lib/models'
import { cn } from '../lib/utils'
import { xtoast } from '../lib/xtoast'
import '../styles/tiptap.scss'
import Container from './container'
import { InputFooterMoreBtn } from './input-footer-more-btn'
import { ModelSelector } from './model-selector'
import SendButton from './send-button'
import StopButton from './stop-button'
import TextToolsGroup from './text-tool-group'
import { Button } from './ui/button'

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

const turndownService = new TurndownService()

const placeholder = `Ask something... (Shift+Enter for new line)`

export const inputFooterBtnHover = 'hover:bg-slate-200 hover:text-gray-800 hover:shadow-sm'
export const inputFooterBtnFixed = 'bg-slate-200 text-gray-800 shadow-sm rounded-3xl'
export const inputFooterBtnActive = 'bg-slate-200 text-primary shadow-sm rounded-3xl hover:text-primary'
export const inputBg = 'border-slate-200 bg-slate-100'

export default function AppInputMsg(props: {
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
  messagesContainerRef: RefObject<HTMLElement | null>
}) {
  const { className, useChatParams, messagesContainerRef } = props
  const { chatId } = useChatIdStore()
  const [pastedImages, setPastedImages] = useState<PastedImage[]>([])
  const [showInputTools, setShowInputTools] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [showPromptCollection, setShowPromptCollection] = useState(false)
  const [showApps, setShowApps] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID)
  const pathname = usePathname()
  const router = useRouter()
  const os = useOperatingSystem()

  const editor = useEditor({
    // https://tiptap.dev/docs/editor/extensions/functionality/starterkit
    extensions: [
      StarterKit.configure({
        codeBlock: {
          exitOnArrowDown: true
        },
        heading: {
          levels: [1, 2, 3]
        },
        hardBreak: false // Disable hard break on Enter
      }),
      ShiftEnterExtension,
      Typography,
      Placeholder.configure({
        placeholder: placeholder
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
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          handleClientSubmit()
          return true
        }
      }
    },
    content: useChatParams.input,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const markdown = turndownService.turndown(html)
      useChatParams.setInput(markdown)
    },
    immediatelyRender: false // SSR
  })

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        editor?.isFocused && // Only activate when editor is focused
        e.key === 'a' &&
        e.shiftKey &&
        ((os === 'mac' && e.metaKey) || (os !== 'mac' && e.ctrlKey))
      ) {
        e.preventDefault()
        setShowInputTools(prev => !prev)
      }

      if (e.key === 'f' && e.shiftKey && ((os === 'mac' && e.metaKey) || (os !== 'mac' && e.ctrlKey))) {
        e.preventDefault()
        setSearchEnabled(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [os, editor]) // Add editor to dependencies

  const { chat } = useChatClient(chatId)

  const handleClientSubmit = async () => {
    if (pathname === '/') {
      window.history.pushState({}, '', `/chat/${chatId}`)
    }

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

        // Clear the editor content after submitting
        editor?.commands.clearContent()
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
    <Container className={cn('flex w-full flex-col items-center gap-0.5', className)}>
      <div
        className="overflow-hidden transition-[height] duration-300 w-full"
        style={{ height: !showInputTools ? '0' : '2.5rem' }}
      >
        <div
          className={cn('h-10 w-fit mx-auto origin-bottom px-8 transition-all duration-300', {
            'pointer-events-none translate-y-full opacity-0': !showInputTools,
            'translate-y-0 opacity-100': showInputTools
          })}
        >
          <TextToolsGroup editor={editor} />
        </div>
      </div>
      <form
        onSubmit={handleClientSubmit}
        className={cn('x-flex-1 z-20 mb-2 flex w-full flex-col overflow-hidden rounded-3xl py-3', inputBg)}
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

        <div className="max-h-[calc(25dvh)] min-h-6 overflow-auto bg-transparent p-2 px-5 pb-4">
          <DynamicEditorContent editor={editor} className="pM-prose max-w-none focus-visible:outline-none" />
          {!editor && <div className="h-6 text-[#adb5bd]">{placeholder}</div>}
        </div>

        <div className="flex flex-row items-center justify-between gap-4 px-3">
          <div className="flex flex-row items-center gap-1.5">
            <InputFooterMoreBtn
              onClearContext={() => {}}
              onPromptCollection={() => setShowPromptCollection(!showPromptCollection)}
              onApps={() => setShowApps(!showApps)}
              showPromptCollection={showPromptCollection}
              showApps={showApps}
            />
            <FooterButton icon={Settings2} onClick={() => {}} tooltip="This chat's configs" />
            <FooterButton icon={Paperclip} onClick={() => {}} tooltip="Attach files" />
            <FooterButton
              icon={Baseline}
              onClick={() => {
                setShowInputTools(!showInputTools)
              }}
              tooltip={`Text tools (${os === 'mac' ? '⌘' : 'Ctrl'}+Shift+A)`}
              active={showInputTools}
            />
            <FooterButton
              icon={Globe}
              onClick={() => {
                setSearchEnabled(!searchEnabled)
              }}
              tooltip={`Search the web (${os === 'mac' ? '⌘' : 'Ctrl'}+Shift+F)`}
              active={searchEnabled}
              title="Web"
            />
            <ModelSelector selectedModelId={selectedModelId} onModelChange={setSelectedModelId} />
          </div>
          {useChatParams.isLoading && <StopButton stop={useChatParams.stop} setMessages={useChatParams.setMessages} />}
          {!useChatParams.isLoading && <SendButton submitForm={handleClientSubmit} input={useChatParams.input} />}
        </div>
      </form>
      <div className="select-none text-xs text-muted-foreground">
        AI can make mistakes. Double check important info.
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
  active,
  title
}: {
  icon: LucideIcon
  onClick: (e: React.MouseEvent) => void
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  active?: boolean
  title?: string
}) => {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        'overflow-hidden rounded-lg text-gray-600 transition-all duration-300 [&_svg]:size-[20px]',
        inputFooterBtnHover,
        active && inputFooterBtnActive,
        title && 'w-auto px-1.5',
        title && active && 'bg-[#d3edfa] hover:bg-[#d3edfa]',
        className
      )}
      variant="ghost"
      size="icon"
      tooltip={tooltip}
      tooltipPosition={tooltipPosition}
    >
      <div className="flex w-full items-center justify-center">
        <Icon className="flex-shrink-0" />
        {title && (
          <div
            className={cn(
              'w-0 text-primary opacity-0 transition-all duration-200',
              active && 'ml-1 w-auto pr-1 opacity-100'
            )}
          >
            {title}
          </div>
        )}
      </div>
    </Button>
  )
}
