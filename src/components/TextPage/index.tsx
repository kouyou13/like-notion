import { Box, Input } from '@chakra-ui/react'
import React, { useState, useRef } from 'react'
import TextRow from './TextRow'
import { useJsonStore } from '../../stores/useJsonStore'

const TextPageComponent = () => {
  const { blocks, addBlock, updateBlock, deleteBlock } = useJsonStore()
  const [title, setTitle] = useState('')
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  return (
    <Box
      w="100vw" h="85vh"
      overflow="scroll"
      display="flex"
      justifyContent="start"
      alignItems="center"
      flexDirection="column"
      pt="15vh"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const prevInput = inputRefs.current.slice(-1)[0]
          if (prevInput) {
            prevInput.focus()
          }
        }
      }}
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
        <TextRow
          key={block.id}
          block={block}
          index={index}
          addBlock={addBlock}
          updateBlock={updateBlock}
          deleteBlock={deleteBlock}
          hoverRowIndex={hoverRowIndex}
          setHoverRowIndex={setHoverRowIndex}
          inputRefs={inputRefs}
          rowLength={blocks.length}
        />
      ))}
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
