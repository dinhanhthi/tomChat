'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { MessageCircle, SmilePlus } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface EmojiPickerButtonProps {
  popupOpen?: boolean
  onPopupOpenChange?: (open: boolean) => void
  currentIcon?: string
  onEmojiSelect: (emoji: { native: string }) => void
  handleBtnClick: (e: React.MouseEvent) => void
  tooltip?: string
}

export function EmojiPickerButton({
  popupOpen,
  onPopupOpenChange,
  currentIcon,
  onEmojiSelect,
  handleBtnClick,
  tooltip
}: EmojiPickerButtonProps) {
  return (
    <Popover open={popupOpen} onOpenChange={onPopupOpenChange}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleBtnClick}
          className={cn('group/icon relative h-6 w-6 hover:bg-white', {
            'bg-white': popupOpen
          })}
          variant="ghost"
          size="icon"
          tooltip={tooltip}
        >
          {currentIcon && (
            <span
              className={cn('z-10 group-hover/icon:opacity-0', {
                'opacity-0': popupOpen
              })}
            >
              {currentIcon}
            </span>
          )}
          {!currentIcon && (
            <MessageCircle
              className={cn('z-10 group-hover/icon:opacity-0', {
                'opacity-0': popupOpen
              })}
            />
          )}
          <SmilePlus
            className={cn('absolute left-1 top-1 z-20 opacity-0 group-hover/icon:opacity-100 text-primary', {
              'opacity-100': popupOpen
            })}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-none p-0 shadow-none" side="right" align="start" sideOffset={0}>
        <div className="max-h-[300px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme="light"
            previewPosition="none"
            skinTonePosition="none"
            perLine={8}
            emojiSize={16}
            emojiButtonSize={35}
            maxFrequentRows={1}
            skin={1}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
