import Image from 'next/image'
import Logo from '../../public/logo.svg'
import { cn } from '../lib/utils'

export default function XChatBrand({
  className = 'gap-1.5',
  size = 20,
  textClassName = 'text-sm',
  wrap = false,
  colored = false
}: {
  className?: string
  size?: number
  textClassName?: string
  wrap?: boolean
  colored?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center',
        {
          'flex-row whitespace-nowrap flex-nowrap': !wrap,
          'flex-col': wrap
        },
        className
      )}
    >
      <Image src={Logo} alt="xChat" width={size} height={size} className="shrink-0" />
      <div className={cn('text-sidebar-primary font-medium', textClassName, {
        'text-principal': colored
      })}>xChat</div>
    </div>
  )
}
