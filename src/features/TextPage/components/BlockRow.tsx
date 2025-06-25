import { Box, Flex, HStack } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/react'
import React, { useMemo } from 'react'

import AddBlockMenu from './AddBlockMenu'
import BlockMenu from './BlockMenu'
import CallbackBlock from './CallbackBlock'
import CitingBlock from './CitingBlock'
import ListBlock from './ListBlock'
import PageBlock from './PageBlock'
import SeparatorBlock from './SeparatorBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'
import textEditorHandleKeyDown from '../utils/textEditorHandleKeyDown'
import textEditorOnUpdate from '../utils/textEditorOnUpdate'
import extensions from '../utils/tiptapExtensions'

type BlockTypeProps = {
  editor: Editor
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  blockRefs: React.RefObject<(Editor | null)[]>
  listNumber: number
  selectedSeparatorIndex: number | null
  onClickSeparator: (e: React.MouseEvent<HTMLDivElement>) => void
}
const BlockTypeComponent = ({
  editor,
  block,
  dispatch,
  blockRefs,
  listNumber,
  selectedSeparatorIndex,
  onClickSeparator,
}: BlockTypeProps) => {
  switch (block.blockType) {
    case 'Text':
    case 'H1':
    case 'H2':
    case 'H3':
    case 'Code':
      return <EditorContent editor={editor} style={{ width: '100%' }} />
    case 'List':
    case 'ListNumbers':
    case 'ToDoList':
    case 'ToggleList':
      return <ListBlock editor={editor} block={block} dispatch={dispatch} listNumber={listNumber} />
    case 'SeparatorLine':
      return (
        <Box w="100%">
          <SeparatorBlock
            block={block}
            dispatch={dispatch}
            blockRefs={blockRefs}
            selectedSeparatorIndex={selectedSeparatorIndex}
            onClickSeparator={onClickSeparator}
          />
        </Box>
      )
    case 'Citing': // 引用
      return <CitingBlock editor={editor} />
    case 'Callout':
      return <CallbackBlock editor={editor} />
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
  selectedSeparatorIndex: number | null
  onClickSeparator: (e: React.MouseEvent<HTMLDivElement>) => void
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
  selectedSeparatorIndex,
  onClickSeparator,
  titleRef,
  blockRefs,
  listNumber,
}: BlockRowProps) => {
  const pt = useMemo(() => {
    switch (block.blockType) {
      case 'Text':
        return 0
      case 'H1':
        return 8
      case 'H2':
        return 7
      case 'H3':
        return 6
    }
  }, [block.blockType])

  const my = useMemo(() => {
    switch (block.blockType) {
      case 'Callout':
        return 3
      case 'Citing':
        return 2
      case 'H1':
      case 'H2':
      case 'H3':
        return 0
    }
  }, [block.blockType])

  const editor = useEditor({
    extensions: extensions(block),
    content: block.message,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      textEditorOnUpdate({ editor, block, dispatch, blockRefs })
    },
    editorProps: {
      handleKeyDown: (_, event: KeyboardEvent): boolean => {
        return textEditorHandleKeyDown({
          editor,
          event,
          block,
          dispatch,
          titleRef,
          blockRefs,
        })
      },
    },
  })

  if (!editor) {
    return
  }

  blockRefs.current[block.order] = editor

  return (
    <HStack
      gap={0}
      pt={pt}
      my={my}
      pl={`${String(block.indentIndex * 1.5)}vw`}
      w="100%"
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
      <Box
        w="22vw"
        onClick={() => {
          editor.commands.focus('start')
        }}
      />
      <Flex
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
            editor={editor}
            block={block}
            dispatch={dispatch}
            blockRefs={blockRefs}
            listNumber={listNumber}
            selectedSeparatorIndex={selectedSeparatorIndex}
            onClickSeparator={onClickSeparator}
          />
        </HStack>
      </Flex>
      <Box
        w="23vw"
        onClick={() => {
          editor.commands.focus('end')
        }}
      />
    </HStack>
  )
}
const BlockRow = React.memo(BlockRowComponent)
export default BlockRow
