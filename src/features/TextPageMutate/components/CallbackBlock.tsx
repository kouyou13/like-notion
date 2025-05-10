import { Flex, HStack } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import React from 'react'
import { FcIdea } from 'react-icons/fc'

import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type CallbackBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}

const CallbackBlockComponent = ({ block, dispatch, titleRef, blockRefs }: CallbackBlockProps) => {
  return (
    <HStack minH="3.5rem" justify="center" bgColor="gray.50" gap={0} w="100%" my={1}>
      <Flex w="3vw" align="center" justify="center">
        <FcIdea size={22} />
      </Flex>
      <TextBlock block={block} dispatch={dispatch} titleRef={titleRef} blockRefs={blockRefs} />
    </HStack>
  )
}
const CallbackBlock = React.memo(CallbackBlockComponent)
export default CallbackBlock
