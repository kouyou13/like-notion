import camelcaseKeys from 'camelcase-keys'

import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks } from '../../../types'

const selectPageWithBlocks = async (
  pageId: string,
): Promise<{ data: PageWithBlocks | undefined; error: Error | null }> => {
  const supabase = createSupabaseClient()
  const { data: page, error: pageError } = await supabase
    .from('page')
    .select('*, block(*)')
    .eq('id', pageId)
    .filter('deleted_at', 'is', null)
    .filter('block.deleted_at', 'is', null)
    .single()
  const camel = page ? camelcaseKeys(page, { deep: true }) : undefined
  const camelData: PageWithBlocks | undefined = camel
  return { data: camelData, error: pageError }
}
export default selectPageWithBlocks
