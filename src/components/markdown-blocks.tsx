import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import SimpleTooltip from './ui/simple-tooltip'

const CodeCopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    })
  }

  return (
    <button onClick={handleCopy} style={{ position: 'absolute', right: '10px', top: '10px' }}>
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <SimpleTooltip text={'Copy code'}>
          <Copy className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </SimpleTooltip>
      )}
    </button>
  )
}

export const Pre: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const code = children?.toString() || ''

  return (
    <div style={{ position: 'relative' }}>
      <CodeCopyButton code={code} />
      <pre>{children}</pre>
    </div>
  )
}
