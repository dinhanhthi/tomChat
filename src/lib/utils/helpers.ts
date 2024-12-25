import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processMarkdownString(md: string) {
  // Convert \( ... \) to $ ... $
  md = md
    .replace(/\\\(.*?\\\)/g, match => `$${match.slice(2, -2)}$`) // Convert \( ... \) to $ ... $
  // Convert \[ ... \] to $$ ... $$
  md = convertMathDisplayStyle(md)
  return md
}

/**
 * Convert \[ ... \] to $$ ... $$
 */
function convertMathDisplayStyle(text: string): string {
  let result = '';
  let inBacktick = false;
  let inTripleBacktick = false;
  let currentBlock = '';
  let i = 0;

  while (i < text.length) {
    if (text.slice(i, i + 3) === '```') {
      inTripleBacktick = !inTripleBacktick;
      result += '```';
      i += 3;
      continue;
    }
    
    if (text[i] === '`' && !inTripleBacktick) {
      inBacktick = !inBacktick;
      result += '`';
      i++;
      continue;
    }
    
    if (!inBacktick && !inTripleBacktick && text.slice(i, i + 2) === '\\[') {
      let j = i + 2;
      while (j < text.length && text.slice(j, j + 2) !== '\\]') {
        currentBlock += text[j];
        j++;
      }
      if (j < text.length) {
        result += '$$\n' + currentBlock + '\n$$';
        currentBlock = '';
        i = j + 2;
        continue;
      }
    }
    
    result += text[i];
    i++;
  }
  
  return result;
}
