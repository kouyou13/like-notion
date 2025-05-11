import { Blockquote } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import React from 'react'

import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type CitingBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}

const CitingBlockComponent = ({ block, dispatch, titleRef, blockRefs }: CitingBlockProps) => {
  return (
    <Blockquote.Root w="100%" my={1} colorPalette="black">
      <Blockquote.Content justifyContent="center" alignItems="center" display="flex" w="100%">
        <TextBlock block={block} dispatch={dispatch} titleRef={titleRef} blockRefs={blockRefs} />
      </Blockquote.Content>
    </Blockquote.Root>
  )
}
const CitingBlock = React.memo(CitingBlockComponent)
export default CitingBlock
