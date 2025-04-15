import { Box, Input } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react'
import TextRow from './TextRow'

import { createSupabaseClient } from '../../../lib/supabase'

import selectPageWithBlocks from '../hooks/selectPageWithBlocks'
import { blocksReducer } from '../utils/pageDispatch'

const TextPageComponent = () => {
  const supabase = createSupabaseClient()
  const { pageId }: { pageId: string } = useParams()
  const [pageTitle, setPageTitle] = useState('')
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const previousBlocksRef = useRef(blocks) // 前回の blocks を保持

  useEffect(() => {
    const fetchPages = async () => {
      const page = await selectPageWithBlocks(pageId)
      if (page) {
        setPageTitle(page.title)
        dispatch({
          type: 'initBlocks',
          blocks: page.pageBlocks,
        })
      }
    }
    void fetchPages()
  }, [pageId, supabase])

  const handleEditPageTitle = useCallback(
    async (newTitle: string) => {
      await supabase.from('pages').update({ title: newTitle }).eq('id', pageId)
      setPageTitle(newTitle)
    },
    [supabase, pageId],
  )

  useEffect(() => {
    const saveBlocks = async () => {
      // blocks が変更されていない場合は保存をスキップ
      if (JSON.stringify(previousBlocksRef.current) === JSON.stringify(blocks)) {
        return
      }

      try {
        const updates = blocks.map((block) => ({
          id: block.id,
          block_type: block.blockType,
          order: block.order,
          page_id: pageId,
        }))
        const updateTexts = blocks.map((block) => ({
          id: block.texts.id,
          content: block.texts.content,
          page_block_id: block.id,
        }))

        const { error } = await supabase.from('page_blocks').upsert(updates, {
          onConflict: 'id',
        })
        const { error: textsError } = await supabase.from('texts').upsert(updateTexts, {
          onConflict: 'id',
        })

        if (error || textsError) {
          console.error('ブロックの保存に失敗しました:', error)
          console.error('テキストの保存に失敗しました:', textsError)
        }

        previousBlocksRef.current = blocks
      } catch (err) {
        console.error('ブロックの保存中にエラーが発生しました:', err)
      }
    }

    const interval = setInterval(() => {
      void saveBlocks()
    }, 3000)

    // クリーンアップ
    return () => {
      clearInterval(interval)
    }
  }, [blocks, pageId, supabase])

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
