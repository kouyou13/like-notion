import { Box, Input } from '@chakra-ui/react'
import React, { useState, useRef, useMemo } from 'react'
import TextRow from './TextRow'
import { useJsonStore } from '../../../stores/useJsonStore'

type TextPageProps = {
  pageId: string
}
const TextPageComponent = ({ pageId }: TextPageProps) => {
  const { pages, editPageTitle } = useJsonStore()
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const page = useMemo(() => pages.find((page) => page.id === pageId), [pages, pageId])
  const blocks = useMemo(() => page?.blocks ?? [], [page])
  return (
    <Box
      h="85vh"
      overflow="scroll"
      display="flex"
      justifyContent="start"
      alignItems="center"
      flexDirection="column"
      pt="10vh"
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
        value={page?.title}
        onChange={(e) => {
          editPageTitle(pageId, e.target.value)
        }}
        size="2xl"
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
          pageId={pageId}
          block={block}
          index={index}
          hoverRowIndex={hoverRowIndex}
          setHoverRowIndex={setHoverRowIndex}
          grabbedRowIndex={grabbedRowIndex}
          setGrabbedRowIndex={setGrabbedRowIndex}
          inputRefs={inputRefs}
          rowLength={blocks.length}
        />
      ))}
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
