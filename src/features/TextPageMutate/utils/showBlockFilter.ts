import type { Block } from '../../../types'

const showBlockFilter = (blocks: Block[]): Block[] => {
  let toggleBlockId: string | null = null
  let toggleBlockIndent: number | null = null
  return blocks.filter((block) => {
    if (block.blockType === 'ToggleList' && !block.isChecked) {
      toggleBlockId = block.id
      toggleBlockIndent = block.indentIndex
    } else if (
      toggleBlockIndent != null &&
      block.indentIndex > toggleBlockIndent &&
      toggleBlockId != null
    ) {
      return false
    } else if (
      toggleBlockIndent != null &&
      block.indentIndex <= toggleBlockIndent &&
      toggleBlockId != null
    ) {
      toggleBlockId = null
      toggleBlockIndent = null
    }
    return true
  })
}
export default showBlockFilter
