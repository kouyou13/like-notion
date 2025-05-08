import { HStack, Box, Checkbox, Flex } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import React, { useCallback } from 'react'
import { BiSolidCircle, BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'

import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type ListSignProps = {
  block: Block
  listNumber: number
  handleChecked: (isChecked: boolean) => void
}
const ListSignComponent = ({ block, listNumber, handleChecked }: ListSignProps) => {
  switch (block.blockType) {
    case 'List':
      return (
        <Box my={0} ml={2} mr={1} p={0} gap={0}>
          <BiSolidCircle size={8} />
        </Box>
      )
    case 'ListNumbers':
      return (
        <Box pb={0} ml={2}>
          {listNumber}.
        </Box>
      )
    case 'ToDoList':
      return (
        <Checkbox.Root
          variant="solid"
          size="sm"
          colorPalette="blue"
          checked={block.isChecked}
          border="1px solid black"
          borderRadius={3}
          onCheckedChange={(isChecked) => {
            if (typeof isChecked.checked === 'boolean') {
              handleChecked(isChecked.checked)
            }
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      )
    case 'ToggleList':
      return (
        <Box my={0} mr={1} p={1} gap={0} _hover={{ bgColor: 'gray.100' }} borderRadius="md">
          {block.isChecked ? (
            <BiSolidDownArrow
              size={12}
              onClick={() => {
                handleChecked(false)
              }}
            />
          ) : (
            <BiSolidRightArrow
              size={12}
              onClick={() => {
                handleChecked(true)
              }}
            />
          )}
        </Box>
      )
  }
}

type ListBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
  listNumber: number
}
const ListBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  listNumber,
}: ListBlockProps) => {
  // const handleKeyDown = useCallback(
  //   (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //       } else if (block.blockType === 'ToggleList' && block.isChecked) {
  //         // トグル展開時
  //         dispatch({
  //           type: 'addBlock',
  //           order: block.order + 1,
  //           blockType: 'Text',
  //           indentIndex: block.indentIndex + 1,
  //         })
  //         setTimeout(() => {
  //           const nextInput = blockRefs.current[block.order + 1]
  //           if (nextInput) {
  //             nextInput.focus()
  //           }
  //         }, 0)
  //       } else {
  //         // トグル未展開時
  //         dispatch({
  //           type: 'addBlock',
  //           order: block.order + 1,
  //           blockType: block.blockType,
  //           indentIndex: block.indentIndex,
  //         })
  //         setTimeout(() => {
  //           const nextInput = blockRefs.current[block.order + 1]
  //           if (nextInput) {
  //             nextInput.focus()
  //           }
  //         }, 0)
  //       }
  //     }
  //   },
  //   [block, blockRefs, dispatch, rowLength, titleRef, isComposing],
  // )

  const handleChecked = useCallback(
    (isChecked: boolean) => {
      dispatch({
        type: 'checkedBlock',
        blockId: block.id,
        isChecked,
      })
    },
    [block, dispatch],
  )
  return (
    <HStack gap={0} w="100%">
      <Flex w="1.5vw">
        <ListSignComponent block={block} listNumber={listNumber} handleChecked={handleChecked} />
      </Flex>
      <TextBlock block={block} dispatch={dispatch} titleRef={titleRef} blockRefs={blockRefs} />
    </HStack>
  )
}
const ListBlock = React.memo(ListBlockComponent)
export default ListBlock
