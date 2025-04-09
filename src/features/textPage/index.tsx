import { Box, Button, Input, HStack } from '@chakra-ui/react'
import { useState } from 'react'

import { AiOutlinePlus, AiOutlineHolder } from 'react-icons/ai'
// import { useJsonStore } from '../../stores/useJsonStore'

const TextPage = () => {
  // const { blocks, addBlock, updateBlock } = useJsonStore()
  const [title, setTitle] = useState('')

  return (
    <Box px="25vw" pt="10vh" w="100%">
      <Input
        placeholder="新規ページ"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        size="2xl"
        border="none"
        outline="none"
        fontSize="4xl"
        p={0}
        fontWeight="bold"
        _placeholder={{ color: 'gray.200' }}
        pl="3.3vw"
      />
      {/* <Button
        colorScheme="blue"
        onClick={() => {
          addBlock(title)
        }}
      >
        追加
      </Button>

      {blocks.map((block) => (
        <Box key={block.id} p={2} border="1px solid gray" borderRadius="md">
          {block.content}
        </Box>
      ))} */}
      <HStack gap={0}>
        <Button bgColor="white" color="black" size="2xs" _hover={{ bgColor: 'gray.100' }}>
          <AiOutlinePlus />
        </Button>
        <Button bgColor="white" color="black" size="2xs" _hover={{ bgColor: 'gray.100' }}>
          <AiOutlineHolder />
        </Button>
        <Input
          size="lg"
          border="none"
          outline="none"
          placeholder="入力して、AIはスペースキーを、コマンドは半角の「/」を押す..."
          p={0}
        />
      </HStack>
    </Box>
  )
}
export default TextPage
