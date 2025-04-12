'use client'

import { useParams } from 'next/navigation'
import React from 'react'

import TextPage from '../../features/TextPageMutate/components'

const Page = () => {
  const params: { pageId: string } = useParams()
  return <TextPage pageId={params.pageId} />
}
export default Page
