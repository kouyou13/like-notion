import { Box, Input, HStack, Text } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { GrAdd, GrDrag } from 'react-icons/gr'
import type { Block } from '../../../stores/types'
import { useJsonStore } from '../../../stores/useJsonStore'

type TextRowProps = {
  pageId: string
  block: Block
  index: number
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  grabbedRowIndex: number | null
  setGrabbedRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>
  rowLength: number
}
const TextRowComponent = ({
  pageId,
  block,
  index,
  hoverRowIndex,
  setHoverRowIndex,
  grabbedRowIndex,
  setGrabbedRowIndex,
  inputRefs,
  rowLength,
}: TextRowProps) => {
  const { addBlock, updateBlock, deleteBlock, moveBlock } = useJsonStore()
  return (
    <HStack
      gap={0}
      onMouseEnter={() => {
        setHoverRowIndex(index)
      }}
      onMouseLeave={() => {
        setHoverRowIndex(null)
      }}
      onDragStart={() => {
        setGrabbedRowIndex(index)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (grabbedRowIndex !== null && grabbedRowIndex !== index) {
          setHoverRowIndex(index)
        }
      }}
      onDrop={() => {
        if (grabbedRowIndex !== null && grabbedRowIndex !== index) {
          moveBlock({ pageId, fromIndex: grabbedRowIndex, toIndex: index })
          setGrabbedRowIndex(null)
        }
        setHoverRowIndex(null)
      }}
      borderBottom={
        grabbedRowIndex != null && hoverRowIndex === index ? '4px solid #e4edfa' : 'none'
      }
    >
      {hoverRowIndex === index ? (
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
                addBlock({ pageId, index: index + 1, content: '' })
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
          inputRefs.current[index] = el
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
        value={block.content}
        h={8}
        onChange={(e) => {
          updateBlock({ pageId, blockId: block.id, content: e.target.value })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && block.content === '') {
            e.preventDefault()
            deleteBlock({ pageId, blockId: block.id })
            const prevInput = index > 0 ? inputRefs.current[index - 1] : inputRefs.current[1]
            if (prevInput) {
              prevInput.focus()
            }
          } else if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault()
            const prevInput = inputRefs.current[index - 1]
            if (prevInput) {
              prevInput.focus()
            }
          } else if (e.key === 'ArrowDown' && index < rowLength - 1) {
            e.preventDefault()
            const nextInput = inputRefs.current[index + 1]
            if (nextInput) {
              nextInput.focus()
            }
          } else if (e.key === 'Enter') {
            addBlock({ pageId, index: index + 1, content: '' })
            setTimeout(() => {
              const nextInput = inputRefs.current[index + 1]
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
