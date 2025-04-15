import camelcaseKeys from 'camelcase-keys'

import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks, BlockType } from '../../TemplateMutate/types'

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

const selectPageWithBlocks = async (pageId: string): Promise<PageWithBlocks | undefined> => {
  const supabase = createSupabaseClient()
  const { data: page, error: pageError }: { data: Page_Snake | null; error: Error | null } =
    await supabase.from('pages').select('*, page_blocks(*, texts(*))').eq('id', pageId).single()
  if (!page || pageError) {
    console.error(pageError)
  } else {
    const camelData: PageWithBlocks = camelcaseKeys(page, { deep: true })
    return camelData
  }
  return undefined
}
export default selectPageWithBlocks
