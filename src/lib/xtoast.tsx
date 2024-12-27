import { CircleCheckBig, Info, OctagonAlert, TriangleAlert } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

const wrapMessage = (message: string, type?: 'info' | 'error' | 'success' | 'warning') => (
  <div className="flex items-start flex-row gap-4">
    {type === 'info' && <Info size={24} className="text-info shrink-0" />}
    {type === 'error' && <OctagonAlert size={24} className="text-danger shrink-0" />}
    {type === 'success' && <CircleCheckBig size={24} className="text-success shrink-0" />}
    {type === 'warning' && <TriangleAlert size={24} className="text-warning shrink-0" />}
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
