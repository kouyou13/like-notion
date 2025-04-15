import { Box, Input } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react'
import { useDebounce } from 'use-debounce'

import TextRow from './TextRow'
import { createSupabaseClient } from '../../../lib/supabase'
import selectPageWithBlocks from '../hooks/selectPageWithBlocks'
import { blocksReducer } from '../utils/pageDispatch'

const TextPageComponent = () => {
  const supabase = createSupabaseClient()
  const router = useRouter()
  const { pageId }: { pageId: string } = useParams()
  const [pageTitle, setPageTitle] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const previousBlocksRef = useRef(blocks)
  const [debouncedBlocks] = useDebounce(blocks, 1000)

  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const [isOpenBlockSettingIndex, setIsOpenBlockSettingIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchPages = async () => {
      const { data: page, error } = await selectPageWithBlocks(pageId)
      if (error) {
        router.push('/')
      }
      if (page) {
        setPageTitle(page.title)
        dispatch({
          type: 'initBlocks',
          blocks: page.pageBlocks.sort((a, b) => a.order - b.order),
        })
      }
    }
    void fetchPages()
  }, [pageId, supabase, router])

  const handleEditPageTitle = useCallback(
    async (newTitle: string) => {
      await supabase.from('pages').update({ title: newTitle }).eq('id', pageId)
      setPageTitle(newTitle)
    },
    [supabase, pageId],
  )

  useEffect(() => {
    const saveBlocks = async () => {
      if (JSON.stringify(previousBlocksRef.current) === JSON.stringify(debouncedBlocks)) return

      const prevIds = previousBlocksRef.current.map((b) => b.id)
      const currentIds = debouncedBlocks.map((b) => b.id)
      const deletedIds = prevIds.filter((id) => !currentIds.includes(id))

      try {
        const updates = debouncedBlocks.map((block) => ({
          id: block.id,
          block_type: block.blockType,
          order: block.order,
          page_id: pageId,
        }))
        const updateTexts = debouncedBlocks.map((block) => ({
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
          console.error('保存失敗:', error)
          console.error('保存失敗:', textsError)
        }

        previousBlocksRef.current = debouncedBlocks

        if (deletedIds.length > 0) {
          const { error: deleteError } = await supabase
            .from('page_blocks')
            .update({ is_deleted: `{${new Date().toISOString()}}` })
            .in('id', deletedIds)

          if (deleteError) {
            console.error('削除マークの更新に失敗:', deleteError)
          }
        }
      } catch (err) {
        console.error('保存エラー:', err)
      }
    }

    void saveBlocks()
  }, [debouncedBlocks, pageId, supabase])

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
          isOpenBlockSettingIndex={isOpenBlockSettingIndex}
          setIsOpenBlockSettingIndex={setIsOpenBlockSettingIndex}
          inputRefs={inputRefs}
          rowLength={blocks.length}
        />
      ))}
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
