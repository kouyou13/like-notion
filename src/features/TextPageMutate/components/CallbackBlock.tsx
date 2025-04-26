import { Flex, HStack } from '@chakra-ui/react'
import React from 'react'
import { FcIdea } from 'react-icons/fc'

import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type CallbackBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
}

const CallbackBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
}: CallbackBlockProps) => {
  return (
    <HStack minH="3.5rem" justify="center" bgColor="gray.100" gap={0} w="100%">
      <Flex w="3vw" align="center" justify="center">
        <FcIdea size={24} />
      </Flex>
      <TextBlock
        block={block}
        dispatch={dispatch}
        titleRef={titleRef}
        blockRefs={blockRefs}
        rowLength={rowLength}
      />
    </HStack>
  )
}
const CallbackBlock = React.memo(CallbackBlockComponent)
export default CallbackBlock
