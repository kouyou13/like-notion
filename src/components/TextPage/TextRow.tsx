import { Box, Input, HStack, Text } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { AiOutlinePlus, AiOutlineHolder } from 'react-icons/ai'
import type { Block } from '../../stores/types'
import { useJsonStore } from '../../stores/useJsonStore'

type TextRowProps = {
  block: Block
  index: number
  addBlock: (payload: { index: number; content: string }) => void
  updateBlock: (payload: { id: string; content: string }) => void
  deleteBlock: (payload: { id: string }) => void
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>
  rowLength: number
}
const TextRowComponent = ({
  block,
  index,
  addBlock,
  updateBlock,
  deleteBlock,
  hoverRowIndex,
  setHoverRowIndex,
  inputRefs,
  rowLength,
}: TextRowProps) => {
  return (
    <HStack
      gap={0}
      onMouseEnter={() => {
        setHoverRowIndex(index)
      }}
      onMouseLeave={() => {
        setHoverRowIndex(null)
      }}
    >
      {hoverRowIndex === index ? (
        <HStack w={50} gap={0}>
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
              borderRadius="full"
              onClick={() => {
                console.log('aaa')
              }}
            >
              <AiOutlinePlus color="gray" size={20} />
            </Box>
          </Tooltip>
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
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString())
            }}
            onDragOver={(e) => {
              e.preventDefault()
            }}
            onDrop={(e) => {
              e.preventDefault()
              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
              const toIndex = index
              if (fromIndex !== toIndex) {
                useJsonStore.getState().moveBlock({ fromIndex, toIndex })
              }
            }}
          >
            <AiOutlineHolder color="gray" size={20} />
          </Box>
        </HStack>
      ) : (
        <Box w={50}></Box>
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
          updateBlock({ id: block.id, content: e.target.value })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && block.content === '') {
            e.preventDefault()
            deleteBlock({ id: block.id })
            const prevInput = inputRefs.current[index - 1]
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
            addBlock({ index: index + 1, content: '' })
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
