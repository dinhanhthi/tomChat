import { cn } from '../lib/utils'

export default function Container(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]', props.className)}>
      {props.children}
    </div>
  )
}
