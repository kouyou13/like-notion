import dayjs from 'dayjs'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Block } from '../../../types'

type Props = {
  previousBlocksRef: React.RefObject<Block[]>
  debouncedBlocks: Block[]
  pageId: string
}
/**
 * 定期的に編集したブロックを保存する関数
 * @param  previousBlocksRef 編集前のBlock[]
 * @param  debouncedBlocks 編集保存用のBlock[]
 * @param  pageId ページid
 * @return void
 */
const regularlySaveBlocks = async ({ previousBlocksRef, debouncedBlocks, pageId }: Props) => {
  const supabase = createSupabaseClient()
  // 画面起動時に更新されないようにするための対策
  if (
    previousBlocksRef.current.length === 0 ||
    JSON.stringify(previousBlocksRef.current) === JSON.stringify(debouncedBlocks)
  ) {
    if (previousBlocksRef.current.length === 0) {
      previousBlocksRef.current = debouncedBlocks
    }
    return
  }
  const prevIds = previousBlocksRef.current.map((b) => b.id)
  const currentIds = debouncedBlocks.map((b) => b.id)
  const deletedIds = prevIds.filter((id) => !currentIds.includes(id))

  try {
    const updates = debouncedBlocks.map((block) => ({
      id: block.id,
      block_type: block.blockType,
      order: block.order,
      indent_index: block.indentIndex,
      message: block.message,
      is_checked: block.isChecked,
      page_id: pageId,
    }))

    const { error } = await supabase.from('block').upsert(updates, {
      onConflict: 'id',
    })
    if (error) {
      console.error('保存失敗:', error)
    }

    await supabase.from('page').update({ updated_at: dayjs().format() }).eq('id', pageId)

    previousBlocksRef.current = debouncedBlocks

    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('block')
        .update({ deleted_at: `{${new Date().toISOString()}}` })
        .in('id', deletedIds)

      if (deleteError) {
        console.error('削除マークの更新に失敗:', deleteError)
      }
    }
  } catch (err) {
    console.error('保存エラー:', err)
  }
}
export default regularlySaveBlocks
