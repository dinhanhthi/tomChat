import { CircleCheckBig, Info, OctagonAlert, TriangleAlert } from 'lucide-react'
import { ExternalToast, toast } from 'sonner'

const baseToast = (message: string) => toast(message)

export const xtoast = Object.assign(baseToast, toast, {
  info: (message: string, data?: ExternalToast) =>
    toast.info(message, {
      icon: <Info className="h-5 w-5 text-info" />,
      action: data?.action
    }),
  error: (message: string, data?: ExternalToast) =>
    toast.error(message, {
      icon: <OctagonAlert className="h-5 w-5 text-danger" />,
      action: data?.action
    }),
  success: (message: string, data?: ExternalToast) =>
    toast.success(message, {
      icon: <CircleCheckBig className="h-5 w-5 text-success" />,
      action: data?.action
    }),
  warning: (message: string, data?: ExternalToast) =>
    toast.warning(message, {
      icon: <TriangleAlert className="h-5 w-5 text-warning" />,
      action: data?.action
    })
})
