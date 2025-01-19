import { Message } from 'ai'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Chat } from '../interface'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processMarkdownString(md: string) {
  // Convert \( ... \) to $ ... $
  md = md.replace(/\\\(.*?\\\)/g, match => `$${match.slice(2, -2)}$`) // Convert \( ... \) to $ ... $
  // Convert \[ ... \] to $$ ... $$
  md = convertMathDisplayStyle(md)
  return md
}

/**
 * Convert \[ ... \] to $$ ... $$
 */
function convertMathDisplayStyle(text: string): string {
  let result = ''
  let inBacktick = false
  let inTripleBacktick = false
  let currentBlock = ''
  let i = 0

  while (i < text.length) {
    if (text.slice(i, i + 3) === '```') {
      inTripleBacktick = !inTripleBacktick
      result += '```'
      i += 3
      continue
    }

    if (text[i] === '`' && !inTripleBacktick) {
      inBacktick = !inBacktick
      result += '`'
      i++
      continue
    }

    if (!inBacktick && !inTripleBacktick && text.slice(i, i + 2) === '\\[') {
      let j = i + 2
      while (j < text.length && text.slice(j, j + 2) !== '\\]') {
        currentBlock += text[j]
        j++
      }
      if (j < text.length) {
        result += '$$\n' + currentBlock + '\n$$'
        currentBlock = ''
        i = j + 2
        continue
      }
    }

    result += text[i]
    i++
  }

  return result
}

export function getMonthYearString(date: Date): string {
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map(message => {
    if (message.role !== 'assistant') return message

    if (!message.toolInvocations) return message

    const toolResultIds: Array<string> = []

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId)
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      toolInvocation => toolInvocation.state === 'result' || toolResultIds.includes(toolInvocation.toolCallId)
    )

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations
    }
  })

  return messagesBySanitizedToolInvocations.filter(
    message => message.content.length > 0 || (message.toolInvocations && message.toolInvocations.length > 0)
  )
}

/**
 * Group chats by dates into: today, yesterday, past 3 days, past 7 days, past 30 days, months in current year,
 * and years before current year
 */
export function groupChatsByDates(chats: Chat[] = []): Map<string, Chat[]> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const currentYear = now.getFullYear()

  // Initialize time-based groups
  const yesterday = new Date(today)
  const prev3days = new Date(today)
  const prev7days = new Date(today)
  const prev30days = new Date(today)

  yesterday.setDate(today.getDate() - 1)
  prev3days.setDate(today.getDate() - 3)
  prev7days.setDate(today.getDate() - 7)
  prev30days.setDate(today.getDate() - 30)

  const groups = new Map<string, Chat[]>()

  groups.set(
    'today',
    chats.filter(conv => new Date(conv.updatedAt) >= today)
  )
  groups.set(
    'yesterday',
    chats.filter(conv => new Date(conv.updatedAt) >= yesterday && new Date(conv.updatedAt) < today)
  )
  groups.set(
    'prev3days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev3days && new Date(conv.updatedAt) < yesterday)
  )
  groups.set(
    'prev7days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev7days && new Date(conv.updatedAt) < prev3days)
  )
  groups.set(
    'prev30days',
    chats.filter(conv => new Date(conv.updatedAt) >= prev30days && new Date(conv.updatedAt) < prev7days)
  )

  const remainingChats = chats.filter(conv => new Date(conv.updatedAt) < prev30days)

  // Group by months for current year
  remainingChats.forEach(conv => {
    const date = new Date(conv.updatedAt)
    if (date.getFullYear() === currentYear && date < prev30days) {
      const key = getMonthYearString(date)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)?.push(conv)
    }
  })

  // Group by years for older chats
  remainingChats.forEach(conv => {
    const date = new Date(conv.updatedAt)
    if (date.getFullYear() < currentYear) {
      const key = date.getFullYear().toString()
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)?.push(conv)
    }
  })

  return groups
}

export const generatePastelColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

interface RGB {
  r: number
  g: number
  b: number
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error('Invalid hex color')

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function hexToRgba(color: string, opacity: number = 0.1): string {
  const rgb = hexToRgb(color)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

export function getLighterColor(color?: string, opacity: number = 0.2) {
  if (!color) return color
  return hexToRgba(color, opacity)
}
