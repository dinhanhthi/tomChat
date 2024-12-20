import { useState } from 'react'

const CodeCopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button onClick={handleCopy} style={{ position: 'absolute', right: '10px', top: '10px' }}>
      {copied ? 'Copied!' : 'Copy'}
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
