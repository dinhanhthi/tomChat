'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { allModels } from '../lib/models'
import { cn } from '../lib/utils'
import { inputFooterBtnFixed, inputFooterBtnHover } from './app-input-msg'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface ModelSelectorProps {
  selectedModelId: string | undefined
  onModelChange: (model: string) => void
  compact?: boolean // hide the model name and only show the icon in the button
  className?: string
  disabled?: boolean // disable the model selector
  tooltip?: string // tooltip text for the button
  isLoading?: boolean // add loading state
}

export function ModelSelector({
  selectedModelId,
  onModelChange,
  compact = false,
  className,
  disabled,
  tooltip,
  isLoading = false
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [currentModelId, setCurrentModelId] = useState(selectedModelId)

  // Update the current model ID when the selectedModelId prop changes
  useEffect(() => {
    if (selectedModelId) {
      setCurrentModelId(selectedModelId)
    }
  }, [selectedModelId])

  // Find the selected model object
  const selectedModel = currentModelId
    ? allModels.find(model => model.id === currentModelId) || allModels[0]
    : allModels[0]

  // Determine if we should show loading state
  const showLoading = isLoading || selectedModelId === undefined

  return (
    <Popover open={open} onOpenChange={isOpen => !disabled && !showLoading && setOpen(isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className={cn(
            'group h-7 overflow-hidden rounded-xl px-2 transition-all duration-300 hover:bg-[#d8d8d8b3] hover:shadow-sm',
            inputFooterBtnHover,
            {
              'rounded-3xl shadow-sm': open,
              [inputFooterBtnFixed]: open,
              'cursor-not-allowed opacity-50 hover:bg-transparent hover:shadow-none': disabled || showLoading
            },
            className
          )}
          onClick={e => (disabled || showLoading) && e.preventDefault()}
          disabled={disabled || showLoading}
          tooltip={tooltip || (showLoading ? 'Loading model...' : undefined)}
        >
          <div className="flex w-full items-center justify-center gap-0.5">
            {showLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
                <div
                  className={cn('ml-1 w-auto overflow-hidden pr-1 text-sm font-normal opacity-100', {
                    'ml-1 w-auto pr-1 opacity-100': open || !compact
                  })}
                >
                  model...
                </div>
                <ChevronsUpDown
                  className={cn('h-4 w-4 shrink-0 opacity-70 group-hover:opacity-80', {
                    'opacity-80': open
                  })}
                />
              </>
            ) : (
              <>
                <selectedModel.colorIcon className={cn('h-4 w-4 flex-shrink-0 text-gray-700')} />
                <div
                  className={cn(
                    'w-0 overflow-hidden font-normal opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:w-auto group-hover:pr-1 group-hover:opacity-100',
                    {
                      'ml-1 w-auto pr-1 opacity-100': open || !compact
                    }
                  )}
                >
                  {selectedModel?.shortName || selectedModel?.name}
                </div>
                <ChevronsUpDown
                  className={cn('h-4 w-4 shrink-0 opacity-70 group-hover:opacity-80', {
                    'opacity-80': open
                  })}
                />
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {allModels.map(model => (
                <CommandItem
                  className="flex flex-row items-center justify-between"
                  key={model.id}
                  onSelect={() => {
                    setCurrentModelId(model.id)
                    onModelChange(model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-row items-center gap-3">
                    <model.colorIcon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{model.name}</span>
                  </div>
                  <Check className={cn('h-4 w-4', currentModelId === model.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
