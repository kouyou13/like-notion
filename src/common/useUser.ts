import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { createSupabaseClient } from '../lib/supabase'

const useUser = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
      }
      setUser(data.user ?? null)
    }
    void fetchUser()
  }, [])

  return user
}
export default useUser
