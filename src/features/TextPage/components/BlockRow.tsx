import { Box, HStack, Separator } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import React, { useMemo } from 'react'

import AddBlockMenu from './AddBlockMenu'
import BlockMenu from './BlockMenu'
import CallbackBlock from './CallbackBlock'
import CitingBlock from './CitingBlock'
import ListBlock from './ListBlock'
import PageBlock from './PageBlock'
import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type BlockTypeProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
  listNumber: number
}
const BlockTypeComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  listNumber,
}: BlockTypeProps) => {
  switch (block.blockType) {
    case 'Text':
    case 'H1':
    case 'H2':
    case 'H3':
    case 'Code':
      return (
        <TextBlock block={block} dispatch={dispatch} titleRef={titleRef} blockRefs={blockRefs} />
      )
    case 'List':
    case 'ListNumbers':
    case 'ToDoList':
    case 'ToggleList':
      return (
        <ListBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          listNumber={listNumber}
        />
      )
    case 'SeparatorLine':
      return (
        <Box w="100%" py={3}>
          <Separator color="black" />
        </Box>
      )
    case 'Citing':
      // 引用
      return (
        <CitingBlock block={block} dispatch={dispatch} titleRef={titleRef} blockRefs={blockRefs} />
      )
    case 'Callout':
      return (
        <CallbackBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
        />
      )
    case 'Page':
      return <PageBlock block={block} />
    default:
      return <Box>default</Box>
  }
}

type BlockRowProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  grabbedRowIndex: number | null
  setGrabbedRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  openBlockSettingIndex: number | null
  setOpenBlockSettingIndex: React.Dispatch<React.SetStateAction<number | null>>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
  listNumber: number
}
const BlockRowComponent = ({
  block,
  dispatch,
  hoverRowIndex,
  setHoverRowIndex,
  grabbedRowIndex,
  setGrabbedRowIndex,
  openBlockSettingIndex,
  setOpenBlockSettingIndex,
  titleRef,
  blockRefs,
  listNumber,
}: BlockRowProps) => {
  const pt = useMemo(() => {
    switch (block.blockType) {
      case 'Text':
        return 0
      case 'H1':
        return 9
      case 'H2':
        return 7
      case 'H3':
        return 5
    }
  }, [block.blockType])

  return (
    <HStack
      gap={0}
      pt={pt}
      pl={`${String(block.indentIndex * 1.5)}vw`}
      w="40vw"
      onMouseEnter={() => {
        if (openBlockSettingIndex == null) {
          setHoverRowIndex(block.order)
        }
      }}
      onMouseLeave={() => {
        setHoverRowIndex(null)
        setGrabbedRowIndex(null)
      }}
      onDragStart={() => {
        setGrabbedRowIndex(block.order)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (grabbedRowIndex !== null) {
          setHoverRowIndex(block.order)
        }
      }}
      onDrop={() => {
        if (grabbedRowIndex !== null && grabbedRowIndex !== block.order) {
          dispatch({
            type: 'moveBlock',
            fromIndex: grabbedRowIndex,
            toIndex: block.order,
          })
          setGrabbedRowIndex(null)
        }
        setHoverRowIndex(null)
      }}
      onKeyDown={(e) => {
        if (block.blockType !== 'Callout') {
          if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault()
            dispatch({
              type: 'addIndent',
              blockId: block.id,
            })
          } else if (
            (e.key === 'Tab' && e.shiftKey) ||
            (e.key === 'Backspace' && block.message === '')
          ) {
            e.preventDefault()
            dispatch({
              type: 'subIndent',
              blockId: block.id,
            })
          }
        }
      }}
      cursor="text"
    >
      {hoverRowIndex === block.order || openBlockSettingIndex === block.order ? (
        <HStack w="3vw" gap={0}>
          <AddBlockMenu
            block={block}
            dispatch={dispatch}
            openBlockSettingIndex={openBlockSettingIndex}
            setIsOpenBlockSettingIndex={setOpenBlockSettingIndex}
            blockRefs={blockRefs}
          />
          <BlockMenu block={block} dispatch={dispatch} />
        </HStack>
      ) : (
        <Box w="3vw" />
      )}
      <HStack
        w="37vw"
        borderBottom={
          grabbedRowIndex != null &&
          grabbedRowIndex !== hoverRowIndex &&
          hoverRowIndex === block.order
            ? '4px solid #e4edfa'
            : 'none'
        }
      >
        <BlockTypeComponent
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          listNumber={listNumber}
        />
      </HStack>
    </HStack>
  )
}
const BlockRow = React.memo(BlockRowComponent)
export default BlockRow
