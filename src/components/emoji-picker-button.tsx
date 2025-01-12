'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { MessageCircle, SmilePlus } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface EmojiPickerButtonProps {
  size?: 'sm' | 'lg'
  popupOpen?: boolean
  onPopupOpenChange?: (open: boolean) => void
  currentIcon?: string
  onEmojiSelect: (emoji: { native: string }) => void
  handleBtnClick: (e: React.MouseEvent) => void
  tooltip?: string
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
}

export function EmojiPickerButton({
  size = 'sm',
  popupOpen,
  onPopupOpenChange,
  currentIcon,
  onEmojiSelect,
  handleBtnClick,
  tooltip,
  tooltipPosition
}: EmojiPickerButtonProps) {
  return (
    <Popover open={popupOpen} onOpenChange={onPopupOpenChange}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleBtnClick}
          className={cn('group/icon relative h-4 w-4 hover:bg-white', {
            'bg-white': popupOpen
          })}
          style={{ fontSize: 'inherit' }}
          variant="ghost"
          size={size === 'sm' ? 'icon' : 'iconBig'}
          tooltip={tooltip}
          tooltipPosition={tooltipPosition}
        >
          {currentIcon && (
            <span
              className={cn('z-10 group-hover/icon:opacity-0', {
                'opacity-0': popupOpen
              })}
              style={{ fontSize: 'inherit' }}
            >
              {currentIcon}
            </span>
          )}
          {!currentIcon && (
            <MessageCircle
              className={cn('z-10 text-gray-600 group-hover/icon:opacity-0', {
                'opacity-0': popupOpen
              })}
            />
          )}
          <div
            className={cn(
              'absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center text-primary opacity-0 transition-opacity duration-100 ease-linear group-hover/icon:opacity-100',
              {
                'opacity-100': popupOpen
              }
            )}
          >
            <SmilePlus />
          </div>
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
