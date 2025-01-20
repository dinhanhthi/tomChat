'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { allModels } from '../lib/models'
import { cn } from '../lib/utils'
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
            'group h-8 overflow-hidden rounded-xl px-2 transition-all duration-300 hover:bg-white hover:shadow-sm',
            {
              'rounded-3xl bg-white shadow-sm': open
            }
          )}
        >
          <div className="flex w-full items-center justify-center text-gray-500">
            <selectedModel.icon
              className={cn('h-5 w-5 flex-shrink-0', {
                'text-primary': open
              })}
            />
            <div
              className={cn(
                'w-0 overflow-hidden font-normal text-primary opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:w-auto group-hover:pr-1 group-hover:opacity-100',
                {
                  'ml-1 w-auto pr-1 opacity-100': open
                }
              )}
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
                    <model.icon className="h-4 w-4 opacity-85" />
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
