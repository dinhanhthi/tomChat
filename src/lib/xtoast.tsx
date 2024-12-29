import { CircleCheckBig, Info, OctagonAlert, TriangleAlert } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

const wrapMessage = (message: string, type?: 'info' | 'error' | 'success' | 'warning') => (
  <div className="flex flex-row items-start gap-4">
    {type === 'info' && <Info size={24} className="shrink-0 text-info" />}
    {type === 'error' && <OctagonAlert size={24} className="shrink-0 text-danger" />}
    {type === 'success' && <CircleCheckBig size={24} className="shrink-0 text-success" />}
    {type === 'warning' && <TriangleAlert size={24} className="shrink-0 text-warning" />}
    <div className="x-prose text-sm dark:prose-invert">
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  </div>
)

const baseToast = (message: string) => toast(wrapMessage(message))

export const xtoast = Object.assign(baseToast, {
  info: (message: string) => toast.info(wrapMessage(message, 'info')),
  error: (message: string) => toast.error(wrapMessage(message, 'error')),
  success: (message: string) => toast.success(wrapMessage(message, 'success')),
  warning: (message: string) => toast.warning(wrapMessage(message, 'warning'))
})
