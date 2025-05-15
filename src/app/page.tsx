'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import Home from '../features/Home/components'
import Template from '../features/Template/components'
import { createSupabaseClient } from '../lib/supabase'

const App = () => {
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const userJudge = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id == null) {
        router.push(`/login`)
      }
    }
    void userJudge()
    // eslint-disable-next-line
  }, [])

  return (
    <Template>
      <Home />
    </Template>
  )
}
export default App
