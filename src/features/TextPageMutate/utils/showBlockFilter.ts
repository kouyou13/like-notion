import { Editor } from '@tiptap/core'

import type { Block } from '../../../types'

/**
 * トグルリストによって隠れている部分を除くための関数
 * @param blocks ページのブロックデータ
 * @return filter処理をしたページのブロックデータ
 */
const showBlockFilter = (
  blocks: Block[],
  blockRefs: React.RefObject<(Editor | null)[]>,
): Block[] => {
  let toggleBlockIndent: number | null = null
  return blocks.filter((block) => {
    if (toggleBlockIndent != null && block.indentIndex > toggleBlockIndent) {
      blockRefs.current[block.order] = null
      return false
    } else if (toggleBlockIndent != null && block.indentIndex <= toggleBlockIndent) {
      toggleBlockIndent = null
    } else if (block.blockType === 'ToggleList' && !block.isChecked) {
      toggleBlockIndent = block.indentIndex
    }
    return true
  })
}
export default showBlockFilter
