'use client'

import { CircleUserRound, HelpCircle, LogIn, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export function UserMenu() {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <DropdownMenu
      onOpenChange={open => {
        if (open) setShowTooltip(false)
        else setTimeout(() => setShowTooltip(true), 100)
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="iconBig"
          tooltip={showTooltip ? 'User menu' : undefined}
          tooltipPosition="bottom"
          delayDuration={500}
        >
          <CircleUserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={event => event.preventDefault()}>
        <DropdownMenuItem asChild>
          <Link href="/admin" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin configs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogIn className="mr-2 h-4 w-4" />
          <span>Login / Signup</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
