import { Box, Textarea } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useRef, useEffect, useReducer, useMemo } from 'react'
import { useDebounce } from 'use-debounce'

import BlockRow from './BlockRow'
import regularlySaveBlocks from '../hooks/regularlySaveBlocks'
import regularlySavePageTitle from '../hooks/regularlySavePageTitle'
import selectPageWithBlocks from '../hooks/selectPageWithBlocks'
import { blocksReducer } from '../utils/pageDispatch'
import showBlockFilter from '../utils/showBlockFilter'

const TextPageComponent = () => {
  const router = useRouter()
  const params = useParams()
  const pageId = (params as { pageId?: string }).pageId ?? ''
  const [pageTitle, setPageTitle] = useState<string | null>(null)
  const [blocks, dispatch] = useReducer(blocksReducer, [])
  const previousBlocksRef = useRef(blocks)

  const [debouncedPageTitle] = useDebounce(pageTitle, 1000) // 編集後1秒間の遅延を設定
  const [debouncedBlocks] = useDebounce(blocks, 1000) // 編集後1秒間の遅延を設定

  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const blockRefs = useRef<(Editor | null)[]>([])
  const [hoverRowIndex, setHoverRowIndex] = useState<number | null>(null)
  const [grabbedRowIndex, setGrabbedRowIndex] = useState<number | null>(null)
  const [openBlockSettingIndex, setOpenBlockSettingIndex] = useState<number | null>(null)
  const [isComposingTitle, setIsComposingTitle] = useState(false)

  let listNumber = 0

  useEffect(() => {
    const fetchPages = async () => {
      const { data: page, error } = await selectPageWithBlocks(pageId)
      if (page?.deletedAt != null) {
        router.push('/home')
      } else if (error) {
        console.error(error)
        router.push('/home')
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
    // eslint-disable-next-line
  }, [])

  // 定期的にタイトルを保存
  useEffect(() => {
    void regularlySavePageTitle({
      debouncedPageTitle,
      pageId,
    })
  }, [debouncedPageTitle, pageId])

  // 定期的にブロックの情報を保存
  useEffect(() => {
    if (debouncedBlocks.length > 0) {
      void regularlySaveBlocks({
        previousBlocksRef,
        debouncedBlocks,
        pageId,
      })
    }
  }, [debouncedBlocks, pageId])

  const filteredBlocks = useMemo(() => showBlockFilter(blocks, blockRefs), [blocks])
  // blockRefsの個数を合わせる処理
  if (blocks.length < blockRefs.current.length) {
    blockRefs.current = blockRefs.current.slice(0, blocks.length)
  }

  return (
    <Box w="100%" h="96vh" overflowY="scroll">
      <Box
        w="100%"
        h="8.5vh"
        onClick={() => {
          const prevInput = blockRefs.current[0]
          prevInput?.commands.focus()
        }}
      />
      <Box w="100%" h="86vh">
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
          pl="26vw"
          mb="0.3vh"
          pr="25vw"
          fontWeight="bold"
          _placeholder={{ color: 'gray.200' }}
          textAlign="left"
          autoresize
          onKeyDown={(e) => {
            if (isComposingTitle) {
              // IME入力中は何もしない
              return
            } else if (e.key === 'ArrowDown') {
              blockRefs.current[0]?.commands.focus()
            } else if (e.key === 'Enter') {
              e.preventDefault()
              dispatch({
                type: 'addBlock',
                order: 0,
                blockType: 'Text',
                indentIndex: 0,
              })
              setTimeout(() => {
                blockRefs.current[0]?.commands.focus()
              })
            }
          }}
          onCompositionStart={() => {
            setIsComposingTitle(true)
          }}
          onCompositionEnd={() => {
            setIsComposingTitle(false)
          }}
        />
        {filteredBlocks.map((block, index) => {
          // ListNumbersの番号計算
          if (block.blockType === 'ListNumbers') {
            if (index === 0 || filteredBlocks[index - 1].indentIndex === block.indentIndex) {
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
              listNumber={listNumber}
            />
          )
        })}
        <Box
          w="100%"
          h="28vh"
          onClick={() => {
            const lastInput = blockRefs.current.slice(-1)[0]
            if (lastInput?.options.content !== '<p></p>') {
              dispatch({
                type: 'addBlock',
                order: blockRefs.current.length + 1,
                blockType: 'Text',
                indentIndex: 0,
              })
              setTimeout(() => {
                const lastInput = blockRefs.current.slice(-1)[0]
                lastInput?.commands.focus()
              })
            } else {
              lastInput.commands.focus()
            }
          }}
        />
      </Box>
    </Box>
  )
}
const TextPage = React.memo(TextPageComponent)
export default TextPage
