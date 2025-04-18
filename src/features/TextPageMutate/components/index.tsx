import { Box, Input } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import { useDebounce } from 'use-debounce'

import BlockRow from './BlockRow'
import { createSupabaseClient } from '../../../lib/supabase'
import selectPageWithBlocks from '../hooks/selectPageWithBlocks'
import { blocksReducer } from '../utils/pageDispatch'

const TextPageComponent = () => {
  const supabase = createSupabaseClient()
  const router = useRouter()
  const { pageId }: { pageId: string } = useParams()
  const [pageTitle, setPageTitle] = useState('')
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const previousBlocksRef = useRef(blocks)
  console.log(blocks)

  const [debouncedPageTitle] = useDebounce(pageTitle, 1000) // 編集後1秒間の遅延を設定
  const [debouncedBlocks] = useDebounce(blocks, 1000) // 編集後1秒間の遅延を設定

  const titleRef = useRef<HTMLInputElement | null>(null)
  const blockRefs = useRef<(HTMLInputElement | null)[]>([])
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const [isOpenBlockSettingIndex, setIsOpenBlockSettingIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchPages = async () => {
      const { data: page, error } = await selectPageWithBlocks(pageId)
      if (error || page?.isDeleted != null) {
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

  // 定期的にタイトルを保存
  useEffect(() => {
    const saveTitle = async () => {
      if (debouncedPageTitle === '') return
      const { error } = await supabase
        .from('pages')
        .update({ title: debouncedPageTitle })
        .eq('id', pageId)
      if (error) {
        console.error(error)
      }
    }
    void saveTitle()
  }, [debouncedPageTitle, supabase, pageId])

  // 定期的にブロックの情報を保存
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
          const prevInput = blockRefs.current.slice(-1)[0]
          if (prevInput) {
            prevInput.focus()
          }
        }
      }}
    >
      <Input
        ref={(el) => {
          titleRef.current = el
        }}
        placeholder="新規ページ"
        value={pageTitle}
        onChange={(e) => {
          setPageTitle(e.target.value)
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
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            blockRefs.current[0]?.focus()
          }
        }}
      />
      {blocks.map((block) => (
        <BlockRow
          key={block.id}
          block={block}
          dispatch={dispatch}
          hoverRowIndex={hoverRowIndex}
          setHoverRowIndex={setHoverRowIndex}
          grabbedRowIndex={grabbedRowIndex}
          setGrabbedRowIndex={setGrabbedRowIndex}
          isOpenBlockSettingIndex={isOpenBlockSettingIndex}
          setIsOpenBlockSettingIndex={setIsOpenBlockSettingIndex}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={blocks.length}
        />
      ))}
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
