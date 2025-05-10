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
  const { pageId }: { pageId: string } = useParams()
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
    void regularlySaveBlocks({
      previousBlocksRef,
      debouncedBlocks,
      pageId,
    })
  }, [debouncedBlocks, pageId])

  const filteredBlocks = useMemo(() => showBlockFilter(blocks), [blocks])

  return (
    <Box
      h="85vh"
      w="39vw"
      overflowY="scroll"
      display="flex"
      pt="9.5vh"
      ml="23.5vw"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const prevInput = blockRefs.current.slice(-1)[0]
          if (prevInput) {
            prevInput.commands.focus()
          }
        }
      }}
    >
      <Box w="39vw">
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
          mb="0.5vh"
          textAlign="left"
          autoresize
          onKeyDown={(e) => {
            if (isComposing) {
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
