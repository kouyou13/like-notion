import camelcaseKeys from 'camelcase-keys'
import dayjs from 'dayjs'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Page } from '../../../types'

const selectPage = async (pageId: string | undefined): Promise<Page | null> => {
  if (pageId == null) return null
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('page')
    .select('*, block(*)')
    .eq('id', pageId)
    .is('deleted_at', null)
    .is('block.deleted_at', null)
    .single()
  if (error) {
    console.error(error)
  }
  const camel = data ? camelcaseKeys(data, { deep: true }) : undefined
  const camelData: Page | null = camel
    ? {
        ...camel,
        updatedAt: dayjs(camel.updatedAt),
        favoritedAt: camel.favoritedAt ? dayjs(camel.favoritedAt) : undefined,
      }
    : null
  return camelData
}
export default selectPage
