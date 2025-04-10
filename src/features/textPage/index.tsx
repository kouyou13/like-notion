import { Box, Input, HStack } from '@chakra-ui/react'
import { useState } from 'react'

import { AiOutlinePlus, AiOutlineHolder } from 'react-icons/ai'
import { useJsonStore } from '../../stores/useJsonStore'

const TextPage = () => {
  const { blocks, addBlock, updateBlock, deleteBlock } = useJsonStore()
  const [title, setTitle] = useState('')

  return (
    <Box
      w="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mt={160}
    >
      <Input
        placeholder="新規ページ"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        size="xl"
        border="none"
        outline="none"
        fontSize="4xl"
        p={0}
        fontWeight="bold"
        _placeholder={{ color: 'gray.200' }}
        mb={2}
        w={650}
        textAlign="left"
      />
      {blocks.map((block, index) => (
        <HStack key={block.id} gap={0}>
          <HStack w={50} gap={0}>
            <Box
              _hover={{ bgColor: 'gray.100' }}
              p={1}
              borderRadius="md"
              onClick={() => {
                addBlock({ index: index + 1, content: '' })
              }}
            >
              <AiOutlinePlus color="gray" />
            </Box>
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
              <AiOutlineHolder color="gray" />
            </Box>
          </HStack>
          <Input
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
              } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault()
                const prevInput = document.querySelectorAll('input')[index]
                prevInput.focus()
              } else if (e.key === 'ArrowDown' && index < blocks.length - 1) {
                e.preventDefault()
                const nextInput = document.querySelectorAll('input')[index + 2]
                nextInput.focus()
              }
            }}
          />
        </HStack>
      ))}
    </Box>
  )
}
export default TextPage
