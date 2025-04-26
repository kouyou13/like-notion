import { Blockquote } from '@chakra-ui/react'
import React from 'react'

import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type CitingBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
}

const CitingBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
}: CitingBlockProps) => {
  return (
    <Blockquote.Root w="100%" pr={0} my={1} colorPalette="black">
      <Blockquote.Content justifyContent="center" alignItems="center" display="flex">
        <TextBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
        />
      </Blockquote.Content>
    </Blockquote.Root>
  )
}
const CitingBlock = React.memo(CitingBlockComponent)
export default CitingBlock
