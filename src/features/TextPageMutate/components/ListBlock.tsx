import { HStack, Textarea, Box, Checkbox, Flex } from '@chakra-ui/react'
import React, { useMemo, useState, useCallback } from 'react'
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
        <Box my={0} ml={2} mr={1} p={0} gap={0}>
          <BiSolidCircle size={8} />
        </Box>
      )
    case 'ListNumbers':
      return (
        <Box mt={1} pb={0} ml={2}>
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
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
  listNumber: number
}
const ListBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
  listNumber,
}: ListBlockProps) => {
  const [isComposing, setIsComposing] = useState(false)

  const placeholder = useMemo(() => {
    switch (block.blockType) {
      case 'List':
      case 'ListNumbers':
        return 'リスト'
      case 'ToDoList':
        return 'ToDo'
      case 'ToggleList':
        return 'トグル'
    }
  }, [block.blockType])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isComposing) {
        // IME入力中は何もしない
        return
      } else if (e.key === 'Backspace' && block.message === '' && block.indentIndex === 0) {
        e.preventDefault()
        dispatch({
          type: 'updateBlockType',
          blockId: block.id,
          blockType: 'Text',
        })
        setTimeout(() => {
          blockRefs.current[block.order]?.focus()
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (block.order > 0) {
          const prevInput = blockRefs.current[block.order - 1]
          if (prevInput) {
            prevInput.focus()
          }
        } else if (block.order === 0) {
          titleRef.current?.focus()
        }
      } else if (e.key === 'ArrowDown' && block.order < rowLength - 1) {
        e.preventDefault()
        const nextInput = blockRefs.current[block.order + 1]
        if (nextInput) {
          nextInput.focus()
        }
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Shift + Enter でない時
        e.preventDefault()
        if (block.message === '') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'Text',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.focus()
          })
        } else if (block.blockType === 'ToggleList' && block.isChecked) {
          // トグル展開時
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
            blockType: 'Text',
            indentIndex: block.indentIndex + 1,
          })
          setTimeout(() => {
            const nextInput = blockRefs.current[block.order + 1]
            if (nextInput) {
              nextInput.focus()
            }
          }, 0)
        } else {
          // トグル未展開時
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
            blockType: block.blockType,
            indentIndex: block.indentIndex,
          })
          setTimeout(() => {
            const nextInput = blockRefs.current[block.order + 1]
            if (nextInput) {
              nextInput.focus()
            }
          }, 0)
        }
      } else if (e.key === 'Enter' && e.shiftKey) {
        // Shift + Enter の時Textarea 内で改行
        e.preventDefault()
        const newMessage = block.message + '\n'
        dispatch({
          type: 'updateBlockMessage',
          blockId: block.id,
          message: newMessage,
        })
      }
    },
    [block, blockRefs, dispatch, rowLength, titleRef, isComposing],
  )

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
    <HStack gap={0}>
      <Flex w="1.5vw">
        <ListSignComponent block={block} listNumber={listNumber} handleChecked={handleChecked} />
      </Flex>
      <Textarea
        ref={(el) => {
          blockRefs.current[block.order] = el
        }}
        placeholder={placeholder}
        value={block.message}
        h="1rem"
        fontSize={16}
        lineHeight="1.5rem"
        border="none"
        outline="none"
        px={0}
        py={1}
        w="100%"
        rows={1}
        onCompositionStart={() => {
          setIsComposing(true)
        }}
        onCompositionEnd={() => {
          setIsComposing(false)
        }}
        onChange={(e) => {
          dispatch({
            type: 'updateBlockMessage',
            blockId: block.id,
            message: e.target.value,
          })
        }}
        onKeyDown={handleKeyDown}
        autoresize
        textDecoration={block.blockType === 'ToDoList' && block.isChecked ? 'line-through' : 'none'}
      />
    </HStack>
  )
}
const ListBlock = React.memo(ListBlockComponent)
export default ListBlock
