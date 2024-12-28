import Image from 'next/image'
import Logo from '../../public/logo.svg'
import { cn } from '../lib/utils'

export default function XChatBrand({
  className,
  size = 'sm',
  wrap = false
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  wrap?: boolean
}) {
  const sizeMap = { sm: 20, md: 24, lg: 32 }
  return (
    <div
      className={cn(
        'flex items-center',
        {
          'gap-1.5': size === 'sm' || size === 'md',
          'gap-2': size === 'lg',
          'flex-row whitespace-nowrap flex-nowrap': !wrap,
          'flex-col': wrap
        },
        className
      )}
    >
      <Image src={Logo} alt="xChat" width={sizeMap[size]} height={sizeMap[size]} className="shrink-0" />
      <div
        className={cn('text-sidebar-primary font-medium', {
          'text-sm': size === 'sm',
          'text-lg': size === 'md',
          'text-xl': size === 'lg'
        })}
      >
        xChat
      </div>
    </div>
  )
}
