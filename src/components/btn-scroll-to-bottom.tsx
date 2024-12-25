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
    const isNotAtBottom = scrollTop + clientHeight < scrollHeight - 10
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

  if (!showButton) return null

  return (
    <button
      onClick={scrollToBottom}
      className={cn(
        'absolute z-50 bottom-4 right-0 bg-white text-slate-500 p-1 rounded-full shadow-sm hover:shadow-lg transition-all duration-200 w-fit border border-slate-100',
        className
      )}
      aria-label="Scroll to bottom"
    >
      <ChevronDown size={24} />
    </button>
  )
}

export default ScrollToBottomButton
