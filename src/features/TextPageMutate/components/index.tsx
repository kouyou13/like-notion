import { Box, Textarea } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, useReducer, useMemo } from 'react'
import { useDebounce } from 'use-debounce'

import BlockRow from './BlockRow'
import { createSupabaseClient } from '../../../lib/supabase'
import selectPageWithBlocks from '../hooks/selectPageWithBlocks'
import { blocksReducer } from '../utils/pageDispatch'
import showBlockFilter from '../utils/showBlockFilter'

const TextPageComponent = () => {
  const supabase = createSupabaseClient()
  const router = useRouter()
  const { pageId }: { pageId: string } = useParams()
  const [pageTitle, setPageTitle] = useState<string | null>(null)
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const previousBlocksRef = useRef(blocks)

  const [debouncedPageTitle] = useDebounce(pageTitle, 1000) // 編集後1秒間の遅延を設定
  const [debouncedBlocks] = useDebounce(blocks, 1000) // 編集後1秒間の遅延を設定

  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const blockRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const [openBlockSettingIndex, setOpenBlockSettingIndex] = useState<number | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  let listNumber = 0

  useEffect(() => {
    const fetchPages = async () => {
      const { data: page, error } = await selectPageWithBlocks(pageId)
      if (page?.deletedAt != null) {
        router.push('/')
      } else if (error) {
        console.error(error)
        router.push('/')
      } else if (page != null) {
        if (page.title !== '') {
          setPageTitle(page.title)
        }
        dispatch({
          type: 'initBlocks',
          blocks: page.block.sort((a, b) => a.order - b.order),
        })
      }
    }
    void fetchPages()
  }, [pageId, router])

  // 定期的にタイトルを保存
  useEffect(() => {
    const saveTitle = async () => {
      if (debouncedPageTitle != null) {
        const { error } = await supabase
          .from('page')
          .update({ title: debouncedPageTitle })
          .eq('id', pageId)
        if (error) {
          console.error(error)
        }
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
          indent_index: block.indentIndex,
          message: block.message,
          is_checked: block.isChecked,
          page_id: pageId,
        }))

        const { error } = await supabase.from('block').upsert(updates, {
          onConflict: 'id',
        })
        if (error) {
          console.error('保存失敗:', error)
        }

        await supabase
          .from('page')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', pageId)

        previousBlocksRef.current = debouncedBlocks

        if (deletedIds.length > 0) {
          const { error: deleteError } = await supabase
            .from('block')
            .update({ deleted_at: `{${new Date().toISOString()}}` })
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

  const filteredBlocks = useMemo(() => showBlockFilter(blocks), [blocks])

  return (
    <Box
      h="85vh"
      w="40vw"
      overflowY="scroll"
      display="flex"
      pt="9.5vh"
      ml="23.5vw"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const prevInput = blockRefs.current.slice(-1)[0]
          if (prevInput) {
            prevInput.focus()
          }
        }
      }}
    >
      <Box w="40vw">
        <Textarea
          ref={(el) => {
            titleRef.current = el
          }}
          placeholder="新規ページ"
          value={pageTitle ?? ''}
          onChange={(e) => {
            setPageTitle(e.target.value)
          }}
          rows={1}
          border="none"
          outline="none"
          fontSize={40}
          lineHeight="3rem"
          py="auto"
          pl="2.5vw"
          pr={0}
          fontWeight="bold"
          _placeholder={{ color: 'gray.200' }}
          mb="0.1vh"
          textAlign="left"
          autoresize
          onKeyDown={(e) => {
            if (isComposing) {
              // IME入力中は何もしない
              return
            } else if (e.key === 'ArrowDown') {
              blockRefs.current[0]?.focus()
            } else if (e.key === 'Enter') {
              e.preventDefault()
              dispatch({
                type: 'addBlock',
                order: 0,
                blockType: 'Text',
                indentIndex: 0,
              })
              setTimeout(() => {
                blockRefs.current[0]?.focus()
              })
            }
          }}
          onCompositionStart={() => {
            setIsComposing(true)
          }}
          onCompositionEnd={() => {
            setIsComposing(false)
          }}
        />
        {filteredBlocks.map((block, index) => {
          if (blocks[index].blockType === 'ListNumbers') {
            if (index === 0 || blocks[index - 1].indentIndex === blocks[index].indentIndex) {
              listNumber += 1
            } else {
              listNumber = 1
            }
          } else {
            listNumber = 0
          }
          return (
            <BlockRow
              key={block.id}
              block={block}
              dispatch={dispatch}
              hoverRowIndex={hoverRowIndex}
              setHoverRowIndex={setHoverRowIndex}
              grabbedRowIndex={grabbedRowIndex}
              setGrabbedRowIndex={setGrabbedRowIndex}
              openBlockSettingIndex={openBlockSettingIndex}
              setOpenBlockSettingIndex={setOpenBlockSettingIndex}
              titleRef={titleRef}
              blockRefs={blockRefs}
              rowLength={blocks.length}
              listNumber={listNumber}
            />
          )
        })}
      </Box>
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
