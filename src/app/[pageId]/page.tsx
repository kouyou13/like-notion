'use client'

import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { errorToast } from '@/common/toast'

import TextPage from '../../features/TextPage/components'
import { createSupabaseClient } from '../../lib/supabase'

const Page = () => {
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const userJudge = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (
        user?.id == null ||
        (user.last_sign_in_at && dayjs().diff(dayjs(user.last_sign_in_at), 'day') >= 1)
      ) {
        errorToast('セッション切れです')
        await supabase.auth.refreshSession()
        router.push(`/login`)
      }
    }
    void userJudge()
    // eslint-disable-next-line
  }, [])

  return <TextPage />
}
export default Page
