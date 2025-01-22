import { ChevronDown } from 'lucide-react'
import React, { RefObject, useEffect, useState } from 'react'
import { cn } from '../lib/utils'

interface ScrollToBottomButtonProps {
  targetRef: RefObject<HTMLElement | null>
  className?: string
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ targetRef, className }) => {
  const [showButton, setShowButton] = useState<boolean>(false)

  const handleScroll = (): void => {
    if (!targetRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = targetRef.current
    const isNotAtBottom = scrollTop + clientHeight < scrollHeight - 50
    setShowButton(isNotAtBottom)
  }

  const scrollToBottom = (): void => {
    if (!targetRef.current) return
    targetRef.current.scrollTo({
      top: targetRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const currentRef = targetRef.current
    if (!currentRef) return

    currentRef.addEventListener('scroll', handleScroll)
    return () => currentRef.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  return (
    <button
      onClick={scrollToBottom}
      className={cn(
        'absolute bottom-4 right-0 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm',
        'transition-all duration-300 ease-in-out',
        'pointer-events-none', // Disable interactions when hidden
        showButton ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-0 opacity-0',
        'hover:scale-110', // Add hover scaling effect
        className
      )}
      aria-label="Scroll to bottom"
    >
      <ChevronDown />
    </button>
  )
}

export default ScrollToBottomButton
