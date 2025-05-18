'use client'

import React from 'react'

import { Toaster } from '@/components/ui/toaster'

import Login from '../../features/Login/components'

const Page = () => {
  return (
    <>
      <Toaster />
      <Login />
    </>
  )
}
export default Page
