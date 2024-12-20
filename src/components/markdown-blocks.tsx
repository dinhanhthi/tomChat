import { useState } from 'react';

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button 
        onClick={copyToClipboard}
        className="absolute right-2 top-2"
      >
        {copied ? '✓' : 'Copy'}
      </button>
      {children}
    </div>
  );
}