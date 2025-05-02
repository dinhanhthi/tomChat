import { CircleCheckBig, Info, OctagonAlert, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'

const baseToast = (message: string) => toast(message)

export const xtoast = Object.assign(baseToast, {
  info: (message: string) =>
    toast.info(message, {
      icon: <Info className="h-5 w-5 text-info" />
    }),
  error: (message: string) =>
    toast.error(message, {
      icon: <OctagonAlert className="h-5 w-5 text-danger" />
    }),
  success: (message: string) =>
    toast.success(message, {
      icon: <CircleCheckBig className="h-5 w-5 text-success" />
    }),
  warning: (message: string) =>
    toast.warning(message, {
      icon: <TriangleAlert className="h-5 w-5 text-warning" />
    })
})
