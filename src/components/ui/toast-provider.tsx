import { Toaster, toast as hotToast, useToasterStore } from 'react-hot-toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export const useToast = () => hotToast 