import { useEffect, useState } from 'react'

interface LoadingBarProps {
  isLoading: boolean
  className?: string
  color?: string
  height?: number
}

const LoadingBar = ({ isLoading, className, color = 'bg-principal', height = 2 }: LoadingBarProps) => {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout

    if (isLoading) {
      setShow(true)
      setProgress(0)
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + Math.random() * 10
          }
          return prev
        })
      }, 100)
    } else {
      setProgress(100)
      timeout = setTimeout(() => setShow(false), 300)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div className={`absolute left-0 top-0 w-full bg-transparent ${className}`} style={{ height }}>
      <div
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'all 0.3s ease-out' : 'width 0.3s ease-out'
        }}
      />
    </div>
  )
}

export default LoadingBar
