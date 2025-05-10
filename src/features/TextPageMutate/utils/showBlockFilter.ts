import type { Block } from '../../../types'

/**
 * トグルリストによって隠れている部分を除くための関数
 * @param blocks ページのブロックデータ
 * @return filter処理をしたページのブロックデータ
 */
const showBlockFilter = (blocks: Block[]): Block[] => {
  let toggleBlockIndent: number | null = null
  return blocks.filter((block) => {
    if (toggleBlockIndent != null && block.indentIndex > toggleBlockIndent) {
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
