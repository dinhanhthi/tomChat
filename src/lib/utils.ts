import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processMarkdownString(md: string) {
  // Replace all \( \) with $ $ for inline math
  md = md.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, (_, open, content) => {
    return open === '(' ? `$${content}$` : `$$${content}$$`
  })
  // Replace all \[ \] with $$ $$ for block math
  md = md.replace(/\\\[(.*?)\\\]/g, '$$$$1$$$$')
  return md
}
