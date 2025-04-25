import type { Block } from '../../../types'

const showBlockFilter = (blocks: Block[]): Block[] => {
  let toggleBlockIndent: number | null = null
  return blocks.filter((block) => {
    if (toggleBlockIndent == null) {
      // トグルの状態を取得
      if (block.blockType === 'ToggleList' && !block.isChecked) {
        toggleBlockIndent = block.indentIndex
      }
    } else {
      if (block.indentIndex > toggleBlockIndent) {
        // インデント内なら省略
        return false
      } else {
        // インデント外
        toggleBlockIndent = null
      }
    }
    return true
  })
}
export default showBlockFilter
