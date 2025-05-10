import { createToaster } from '@chakra-ui/react'

const toaster = createToaster({
  placement: 'bottom',
  pauseOnPageIdle: true,
})

export const successToast = (message: string) => {
  toaster.create({
    type: 'success',
    description: message,
    duration: 5000,
  })
}

export const errorToast = (message: string) => {
  toaster.create({
    type: 'error',
    description: message,
    duration: 5000,
  })
}

export const infoToast = (message: string) => {
  toaster.create({
    type: 'info',
    description: message,
    duration: 5000,
  })
}

export const warningToast = (message: string) => {
  toaster.create({
    type: 'warning',
    description: message,
    duration: 5000,
  })
}
