'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { allModels } from '../lib/models'
import { cn } from '../lib/utils'
import { inputFooterBtnFixed, inputFooterBtnHover } from './app-input-msg'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface ModelSelectorProps {
  selectedModelId: string
  onModelChange: (model: string) => void
}

export function ModelSelector({ selectedModelId, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedModel = allModels.find(model => model.id === selectedModelId)!

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className={cn(
            'group h-7 overflow-hidden rounded-xl px-2 transition-all duration-300 hover:bg-[#d8d8d8b3] hover:shadow-sm',
            inputFooterBtnHover,
            {
              'rounded-3xl shadow-sm': open,
              [inputFooterBtnFixed]: open
            }
          )}
        >
          <div className="flex w-full items-center justify-center">
            <selectedModel.colorIcon className={cn('h-4 w-4 flex-shrink-0 text-gray-700')} />
            <div
              className={cn(
                'w-0 overflow-hidden font-normal opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:w-auto group-hover:pr-1 group-hover:opacity-100',
                {
                  'ml-1 w-auto pr-1 opacity-100': open
                }
              )}
              style={{ color: selectedModel.serviceColor }}
            >
              {selectedModel?.shortName || selectedModel?.name}
            </div>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-80" />
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
                    onModelChange(model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-row items-center gap-3">
                    <model.colorIcon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{model.name}</span>
                  </div>
                  <Check className={cn('h-4 w-4', selectedModel.id === model.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
