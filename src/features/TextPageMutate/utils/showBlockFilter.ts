import type { Block } from '../../../types'

const showBlockFilter = (blocks: Block[]): Block[] => {
  let toggleBlockId: string | null = null
  let toggleBlockIndent: number | null = null
  return blocks.filter((block) => {
    if (toggleBlockIndent == null || toggleBlockId == null) {
      // トグルの状態を取得
      if (block.blockType === 'ToggleList' && !block.isChecked) {
        toggleBlockId = block.id
        toggleBlockIndent = block.indentIndex
      }
    } else {
      if (block.indentIndex > toggleBlockIndent) {
        // インデント内なら省略
        return false
      } else {
        // インデント外
        toggleBlockId = null
        toggleBlockIndent = null
      }
    }
    return true
  })
}
export default showBlockFilter
