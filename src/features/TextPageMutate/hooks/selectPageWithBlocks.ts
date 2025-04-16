import camelcaseKeys from 'camelcase-keys'

import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks, BlockType } from '../../../types'

type Page_Snake = {
  id: string
  title: string
  page_blocks: {
    id: string
    block_type: BlockType
    order: number
    texts: {
      id: string
      content: string
    }
  }[]
}

const selectPageWithBlocks = async (
  pageId: string,
): Promise<{ data: PageWithBlocks | undefined; error: Error | null }> => {
  const supabase = createSupabaseClient()
  const { data: page, error: pageError }: { data: Page_Snake | null; error: Error | null } =
    await supabase
      .from('pages')
      .select('*, page_blocks(*, texts(*))')
      .eq('id', pageId)
      .filter('page_blocks.is_deleted', 'is', null)
      .single()
  const camelData: PageWithBlocks | undefined = page
    ? camelcaseKeys(page, { deep: true })
    : undefined
  return { data: camelData, error: pageError }
}
export default selectPageWithBlocks
