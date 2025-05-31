import { Box, Separator } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import React from 'react'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type SeparatorBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  blockRefs: React.RefObject<(Editor | null)[]>
  selectedSeparatorIndex: number | null
  onClickSeparator: (e: React.MouseEvent<HTMLDivElement>) => void
}
const SeparatorBlockComponent = ({
  block,
  dispatch,
  blockRefs,
  selectedSeparatorIndex,
  onClickSeparator,
}: SeparatorBlockProps) => {
  return (
    <Box
      w="100%"
      cursor="pointer"
      bgColor={selectedSeparatorIndex != null ? 'rgba(198, 224, 247, 0.5)' : undefined}
      borderRadius="sm"
      py={1.5}
      tabIndex={0}
      onClick={onClickSeparator}
      onKeyDown={(e) => {
        if (selectedSeparatorIndex != null && e.key === 'Backspace') {
          dispatch({
            type: 'deleteBlock',
            blockId: block.id,
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        } else if (e.key === 'Enter') {
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
            blockType: 'Text',
            indentIndex: 0,
          })
          setTimeout(() => {
            blockRefs.current[block.order + 1]?.commands.focus()
          })
        }
      }}
    >
      <Separator cursor="pointer" size="md" colorPalette="black" />
    </Box>
  )
}
const SeparatorBlock = React.memo(SeparatorBlockComponent)
export default SeparatorBlock
