'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import React, { createContext, useContext, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { MODAL_RADIUS } from '../lib/constants'
import { cn } from '../lib/utils'

interface AlertDialogOptions {
  title?: string
  description?: string
  confirmText?: string
  confirmClassName?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface AlertDialogContextType {
  showAlert: (options: AlertDialogOptions) => void
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined)

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AlertDialogOptions>({})

  const showAlert = (opts: AlertDialogOptions) => {
    setOptions(opts)
    setIsOpen(true)
  }

  const handleConfirm = () => {
    options.onConfirm?.()
    setIsOpen(false)
  }

  const handleCancel = () => {
    options.onCancel?.()
    setIsOpen(false)
  }

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className={MODAL_RADIUS}>
          <AlertDialogHeader className="gap-2">
            <AlertDialogTitle className="text-lg">{options.title || 'Confirm Action'}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{options.description || 'Are you sure you want to continue?'}</ReactMarkdown>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="focus-visible:!ring-0 focus-visible:!ring-offset-0" onClick={handleCancel}>
              {options.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn('focus-visible:!ring-0 focus-visible:!ring-offset-0 h-9', options.confirmClassName)}
              onClick={handleConfirm}
            >
              {options.confirmText || 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function useAlertDialog() {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialogProvider')
  }
  return context
}
