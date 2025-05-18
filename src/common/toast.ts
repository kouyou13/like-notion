import { toaster } from '@/components/ui/toaster'

export const successToast = (message: string) => {
  toaster.create({
    type: 'success',
    description: message,
    duration: 5000,
    closable: true,
  })
}

export const errorToast = (message: string) => {
  toaster.create({
    type: 'error',
    description: message,
    duration: 5000,
    closable: true,
  })
}

export const infoToast = (message: string) => {
  toaster.create({
    type: 'info',
    description: message,
    duration: 5000,
    closable: true,
  })
}

export const warningToast = (message: string) => {
  toaster.create({
    type: 'warning',
    description: message,
    duration: 5000,
    closable: true,
  })
}
