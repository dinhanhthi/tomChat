import { SVGProps } from 'react'

export function AppsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <rect width="6.5" height="6.5" x="3.75" y="3.75" rx="2"></rect>
        <path d="M15.586 3.818a2 2 0 0 1 2.828 0l1.768 1.768a2 2 0 0 1 0 2.828l-1.768 1.768a2 2 0 0 1-2.828 0l-1.768-1.768a2 2 0 0 1 0-2.828z"></path>
        <rect width="6.5" height="6.5" x="3.75" y="13.75" rx="1.5"></rect>
        <rect width="6.5" height="6.5" x="13.75" y="13.75" rx="2"></rect>
      </g>
    </svg>
  )
}
