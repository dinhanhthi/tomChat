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
