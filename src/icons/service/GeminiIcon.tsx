import { SVGProps } from 'react'

export function GeminiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M24 12.024c-6.437.388-11.59 5.539-11.977 11.976h-.047C11.588 17.563 6.436 12.412 0 12.024v-.047C6.437 11.588 11.588 6.437 11.976 0h.047c.388 6.437 5.54 11.588 11.977 11.977z"
      ></path>
    </svg>
  )
}

export function GeminiColorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="lobe-icons-gemini-fill" x1="0%" x2="68.73%" y1="100%" y2="30.395%">
          <stop offset="0%" stopColor="#1C7DFF"></stop>
          <stop offset="52.021%" stopColor="#1C69FF"></stop>
          <stop offset="100%" stopColor="#F0DCD6"></stop>
        </linearGradient>
      </defs>
      <path
        d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
        fill="url(#lobe-icons-gemini-fill)"
        fillRule="nonzero"
      ></path>
    </svg>
  )
}
