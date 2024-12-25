import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Conversation } from '../interface'

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

export function filterConversations(conversations: Conversation[] = []) {
  const group: Record<'today' | 'yesterday' | 'prev3days' | 'prev7days' | 'prev30days' | 'older', Conversation[]> = {
    today: [],
    yesterday: [],
    prev3days: [],
    prev7days: [],
    prev30days: [],
    older: []
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  group['today'] = conversations.filter(conv => new Date(conv.updatedAt) >= today)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  group['yesterday'] = conversations.filter(
    conv => new Date(conv.updatedAt) >= yesterday && new Date(conv.updatedAt) < today
  )

  const prev3days = new Date(today)
  prev3days.setDate(today.getDate() - 3)
  group['prev3days'] = conversations.filter(
    conv => new Date(conv.updatedAt) >= prev3days && new Date(conv.updatedAt) < yesterday
  )

  const prev7days = new Date(today)
  prev7days.setDate(today.getDate() - 7)
  group['prev7days'] = conversations.filter(
    conv => new Date(conv.updatedAt) >= prev7days && new Date(conv.updatedAt) < prev3days
  )

  const prev30days = new Date(today)
  prev30days.setDate(today.getDate() - 30)
  group['prev30days'] = conversations.filter(
    conv => new Date(conv.updatedAt) >= prev30days && new Date(conv.updatedAt) < prev7days
  )

  group['older'] = conversations.filter(conv => new Date(conv.updatedAt) < prev30days)

  return group
}
