import { Box, Input } from '@chakra-ui/react'
import camelcaseKeys from 'camelcase-keys'
import { useParams } from 'next/navigation'
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react'
import TextRow from './TextRow'

import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks } from '../../TemplateMutate/types'

import { blocksReducer } from '../utils/pageDispatch'

const TextPageComponent = () => {
  const supabase = createSupabaseClient()
  const { pageId }: { pageId: string } = useParams()
  const [pageTitle, setPageTitle] = useState('')
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [blocks, dispatch] = useReducer(blocksReducer, [])

  useEffect(() => {
    const fetchPages = async () => {
      const { data: page, error: pageError } = await supabase
        .from('page')
        .select('*, page_block(*, text(*))')
        .eq('id', pageId)
        .single()
      if (pageError) {
        console.error(pageError)
      } else {
        const camelData: PageWithBlocks = camelcaseKeys(page, { deep: true })
        setPageTitle(camelData.title)
        dispatch({
          type: 'initBlocks',
          blocks: camelData.pageBlock,
        })
      }
    }
    void fetchPages()
  }, [pageId, supabase])

  const handleEditPageTitle = useCallback(
    async (newTitle: string) => {
      await supabase.from('page').update({ title: newTitle }).eq('id', pageId)
      setPageTitle(newTitle)
    },
    [supabase, pageId],
  )
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
        value={pageTitle}
        onChange={async (e) => {
          await handleEditPageTitle(e.target.value)
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
      {blocks.map((block) => (
        <TextRow
          key={block.id}
          block={block}
          dispatch={dispatch}
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
