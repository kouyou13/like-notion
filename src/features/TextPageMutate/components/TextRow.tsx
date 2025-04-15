import { Box, Input, HStack, Text } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { GrAdd, GrDrag } from 'react-icons/gr'

import type { Block } from '../../TemplateMutate/types'
import type { Action } from '../utils/pageDispatch'

type TextRowProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  grabbedRowIndex: number | null
  setGrabbedRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>
  rowLength: number
}
const TextRowComponent = ({
  block,
  dispatch,
  hoverRowIndex,
  setHoverRowIndex,
  grabbedRowIndex,
  setGrabbedRowIndex,
  inputRefs,
  rowLength,
}: TextRowProps) => {
  return (
    <HStack
      gap={0}
      onMouseEnter={() => {
        setHoverRowIndex(block.order)
      }}
      onMouseLeave={() => {
        setHoverRowIndex(null)
      }}
      onDragStart={() => {
        setGrabbedRowIndex(block.order)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (grabbedRowIndex !== null && grabbedRowIndex !== block.order) {
          setHoverRowIndex(block.order)
        }
      }}
      onDrop={() => {
        if (grabbedRowIndex !== null && grabbedRowIndex !== block.order) {
          dispatch({
            type: 'moveBlock',
            fromIndex: grabbedRowIndex,
            toIndex: block.order,
          })
          setGrabbedRowIndex(null)
        }
        setHoverRowIndex(null)
      }}
      borderBottom={
        grabbedRowIndex != null && hoverRowIndex === block.order ? '4px solid #e4edfa' : 'none'
      }
    >
      {hoverRowIndex === block.order ? (
        <HStack w={50} gap={1}>
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" py={1} px={2} alignContent="center">
                <HStack justify="center" align="center" gap={0}>
                  クリックして<Text color="gray">下に追加</Text>
                </HStack>
                <HStack gap={0}>
                  Opt+クリック/Alt+クリックで<Text color="gray">上に追加</Text>
                </HStack>
              </Box>
            }
            bgColor="black"
            color="white"
            borderRadius={5}
            borderColor="black"
          >
            <Box
              _hover={{ bgColor: 'gray.100' }}
              p={1}
              borderRadius="md"
              onClick={() => {
                dispatch({
                  type: 'addBlock',
                  order: block.order + 1,
                })
              }}
            >
              <GrAdd color="gray" size={16} />
            </Box>
          </Tooltip>
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" py={1} px={2} alignContent="center">
                <HStack justify="center" align="center" gap={0}>
                  ドラッグして<Text color="gray">移動する</Text>
                </HStack>
                <HStack gap={0}>
                  クリックして<Text color="gray">メニューを開く</Text>
                </HStack>
              </Box>
            }
            bgColor="black"
            color="white"
            borderRadius={5}
            borderColor="black"
          >
            <Box
              _hover={{ bgColor: 'gray.100' }}
              py={1}
              borderRadius="md"
              cursor="grab"
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = 'grabbing'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab'
              }}
              draggable
            >
              <GrDrag color="gray" size={16} />
            </Box>
          </Tooltip>
        </HStack>
      ) : (
        <Box w={50} />
      )}
      <Input
        ref={(el) => {
          inputRefs.current[block.order] = el
        }}
        size="lg"
        border="none"
        outline="none"
        p={0}
        w={650}
        mr={50}
        onBlur={(e) => {
          e.target.placeholder = ''
        }}
        onFocus={(e) => {
          e.target.placeholder = '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
        }}
        value={block.texts.content}
        h={8}
        onChange={(e) => {
          dispatch({
            type: 'updateBlock',
            blockId: block.id,
            newContent: e.target.value,
          })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && block.texts.content === '') {
            e.preventDefault()
            dispatch({
              type: 'deleteBlock',
              blockId: block.id,
            })
            const prevInput =
              block.order > 0 ? inputRefs.current[block.order - 1] : inputRefs.current[1]
            if (prevInput) {
              prevInput.focus()
            }
          } else if (e.key === 'ArrowUp' && block.order > 0) {
            e.preventDefault()
            const prevInput = inputRefs.current[block.order - 1]
            if (prevInput) {
              prevInput.focus()
            }
          } else if (e.key === 'ArrowDown' && block.order < rowLength - 1) {
            e.preventDefault()
            const nextInput = inputRefs.current[block.order + 1]
            if (nextInput) {
              nextInput.focus()
            }
          } else if (e.key === 'Enter') {
            dispatch({
              type: 'addBlock',
              order: block.order + 1,
            })
            setTimeout(() => {
              const nextInput = inputRefs.current[block.order + 1]
              if (nextInput) {
                nextInput.focus()
              }
            }, 0)
          }
        }}
      />
    </HStack>
  )
}
const TextRow = React.memo(TextRowComponent)
export default TextRow
