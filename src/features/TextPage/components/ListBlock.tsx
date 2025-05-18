import { HStack, Box, Checkbox, Flex } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import { EditorContent } from '@tiptap/react'
import React, { useCallback } from 'react'
import { BiSolidCircle, BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'

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
        <Box my={0} p={0} gap={0}>
          <BiSolidCircle size={8} />
        </Box>
      )
    case 'ListNumbers':
      return <Box pb={0}>{listNumber}.</Box>
    case 'ToDoList':
      return (
        <Checkbox.Root
          variant="solid"
          size="xs"
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
        <Box
          my={0}
          gap={0}
          _hover={{ bgColor: 'gray.100' }}
          borderRadius="md"
          onClick={() => {
            handleChecked(!block.isChecked)
          }}
          p={1}
        >
          {block.isChecked ? <BiSolidDownArrow size={12} /> : <BiSolidRightArrow size={12} />}
        </Box>
      )
  }
}

type ListBlockProps = {
  editor: Editor
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  listNumber: number
}
const ListBlockComponent = ({ editor, block, dispatch, listNumber }: ListBlockProps) => {
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
      <Flex w="1.5vw" pl={0.5}>
        <ListSignComponent block={block} listNumber={listNumber} handleChecked={handleChecked} />
      </Flex>
      <EditorContent editor={editor} style={{ width: '100%' }} />
    </HStack>
  )
}
const ListBlock = React.memo(ListBlockComponent)
export default ListBlock
