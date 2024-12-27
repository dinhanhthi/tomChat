import { CircleCheckBig, Info, OctagonAlert, TriangleAlert } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

const wrapMessage = (message: string, type?: 'info' | 'error' | 'success' | 'warning') => (
  <div className="flex items-start flex-row gap-4">
    {type === 'info' && <Info size={24} className="text-info" />}
    {type === 'error' && <OctagonAlert size={24} className="text-danger" />}
    {type === 'success' && <CircleCheckBig size={24} className="text-success" />}
    {type === 'warning' && <TriangleAlert size={24} className="text-warning" />}
    <div className="x-prose dark:prose-invert text-sm">
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
