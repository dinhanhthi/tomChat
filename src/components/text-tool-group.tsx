import { Editor } from '@tiptap/react'
import {
  Bold,
  Braces,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  LucideIcon,
  Quote,
  Redo,
  Sigma,
  Strikethrough,
  Undo
} from 'lucide-react'
import { cn } from '../lib/utils'
import { inputBg, inputFooterBtnActive, inputFooterBtnHover } from './app-input-msg'
import { Button } from './ui/button'

type TextToolsGroupProps = {
  editor?: Editor | null
  className?: string
}

export default function TextToolsGroup(props: TextToolsGroupProps) {
  const { editor, className } = props
  return (
    <div className={cn('flex w-full flex-row items-center gap-2 rounded-t-xl p-2', inputBg)}>
      <TextToolButton icon={Undo} onClick={() => editor?.chain().focus().undo().run()} tooltip="Undo" editor={editor} />
      <TextToolButton icon={Redo} onClick={() => editor?.chain().focus().redo().run()} tooltip="Redo" editor={editor} />
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
      <TextToolButton
        icon={Sigma}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        tooltip="Math equation"
        active={editor?.isActive('blockquote')}
        editor={editor}
      />
    </div>
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
  editor: any
}) => {
  return (
    <Button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        'h-6 w-6 rounded-md [&_svg]:size-[16px]',
        inputFooterBtnHover,
        active && inputFooterBtnActive,
        className
      )}
      variant="ghost"
      size="icon"
      tooltip={tooltip}
      tooltipPosition={tooltipPosition}
    >
      <Icon />
    </Button>
  )
}
