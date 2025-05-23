import type { UserIdentity } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { createSupabaseClient } from '../lib/supabase'

const useUser = () => {
  const [user, setUser] = useState<UserIdentity | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.getUserIdentities()
      if (error) {
        console.error(error)
      }
      setUser(data?.identities[0] ?? null)
    }
    void fetchUser()
  }, [])

  return user
}
export default useUser
