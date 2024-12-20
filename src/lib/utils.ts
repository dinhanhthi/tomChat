import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processMarkdownString(md: string) {
  // Replace all \( \) with $ $ for inline math and \[ \] with $$ $$ for block math
  // md = md.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, (_, open, content) => {
  //   return open === '(' ? `$${content}$` : `$$${content}$$`
  // })
  // md = md
  //   .replace(/\\\(.*?\\\)/g, match => `$${match.slice(2, -2)}$`) // Convert \( ... \) to $ ... $
  //   .replace(/\\\[.*?\\\]/g, match => `$$${match.slice(2, -2)}$$`) // Convert \[ ... \] to $$ ... $$
  // .replace(/\\\[(.*?)\\\]/g, '$$$$$1$$$$')
  // return md
  return convertMathEquations(md)
}

function convertMathEquations(input: string): string {
  // Match code blocks enclosed in triple backticks
  const codeBlockPattern = /```[\s\S]*?```/g
  const codeBlocks = input.match(codeBlockPattern) || []

  // Match inline code snippets enclosed in single backticks
  const inlineCodePattern = /`[^`]*`/g
  const inlineCodes = input.match(inlineCodePattern) || []

  // Replace code blocks and inline code snippets with placeholders
  let modifiedInput = input
  codeBlocks.forEach((block, index) => {
    modifiedInput = modifiedInput.replace(block, `__CODE_BLOCK_${index}__`)
  })
  inlineCodes.forEach((code, index) => {
    modifiedInput = modifiedInput.replace(code, `__INLINE_CODE_${index}__`)
  })

  // Convert inline math equations
  modifiedInput = modifiedInput.replace(/\\\((.*?)\\\)/g, '$$($1)$$')

  // Convert block display mode equations
  modifiedInput = modifiedInput.replace(/\\\[\s*([\s\S]*?)\s*\\\]/, (_match, p1) => {
    return ` $$\n\n ${p1.trim()} \n $$\n\n`
  })

  // Restore code blocks and inline code snippets
  codeBlocks.forEach((block, index) => {
    modifiedInput = modifiedInput.replace(`__CODE_BLOCK_${index}__`, block)
  })
  inlineCodes.forEach((code, index) => {
    modifiedInput = modifiedInput.replace(`__INLINE_CODE_${index}__`, code)
  })

  return modifiedInput
}

// function convertMathEquations(input: string): string {
//   // Match code blocks enclosed in triple backticks
//   const codeBlockPattern = /```[\s\S]*?```/g;
//   const codeBlocks = input.match(codeBlockPattern) || [];

//   // Match inline code snippets enclosed in single backticks
//   const inlineCodePattern = /`[^`]*`/g;
//   const inlineCodes = input.match(inlineCodePattern) || [];

//   // Replace code blocks and inline code snippets with placeholders
//   let modifiedInput = input;
//   codeBlocks.forEach((block, index) => {
//     modifiedInput = modifiedInput.replace(block, `__CODE_BLOCK_${index}__`);
//   });
//   inlineCodes.forEach((code, index) => {
//     modifiedInput = modifiedInput.replace(code, `__INLINE_CODE_${index}__`);
//   });

//   // Convert inline math equations
//   modifiedInput = modifiedInput.replace(/\\\((.*?)\\\)/g, '$$($1)$$');

//   // Convert block display mode equations
//   modifiedInput = modifiedInput.replace(/\\\[(.*?)\\\]/g, '$$$$($1)$$$$');

//   // Restore code blocks and inline code snippets
//   codeBlocks.forEach((block, index) => {
//     modifiedInput = modifiedInput.replace(`__CODE_BLOCK_${index}__`, block);
//   });
//   inlineCodes.forEach((code, index) => {
//     modifiedInput = modifiedInput.replace(`__INLINE_CODE_${index}__`, code);
//   });

//   return modifiedInput;
// }
