import camelcaseKeys from 'camelcase-keys'
import dayjs from 'dayjs'

import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks } from '../../../types'

/**
 * 開始時にページ内のブロックをまとめて取得する関数
 * @param pageId ページid
 * @return ページデータ
 */
const selectPageWithBlocks = async (
  pageId: string,
): Promise<{ data: PageWithBlocks | undefined; error: Error | null }> => {
  const supabase = createSupabaseClient()
  const { data: page, error: pageError } = await supabase
    .from('page')
    .select('*, block(*)')
    .eq('id', pageId)
    .is('deleted_at', null)
    .is('block.deleted_at', null)
    .single()
  const camel = page ? camelcaseKeys(page, { deep: true }) : undefined
  const camelData: PageWithBlocks | undefined = camel
    ? {
        ...camel,
        updatedAt: dayjs(camel.updatedAt),
        favoritedAt: camel.favoritedAt ? dayjs(camel.favoritedAt) : undefined,
        block: camel.block.map((b) => ({ ...b })),
      }
    : undefined
  return { data: camelData, error: pageError }
}
export default selectPageWithBlocks
