import { Box, Flex, HStack, Separator } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import ToggleList from '@tiptap/extension-blockquote' // blockquoteをトグルリストとして扱う
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import React, { useMemo } from 'react'

import AddBlockMenu from './AddBlockMenu'
import BlockMenu from './BlockMenu'
import CallbackBlock from './CallbackBlock'
import CitingBlock from './CitingBlock'
import ListBlock from './ListBlock'
import PageBlock from './PageBlock'
import type { Block } from '../../../types'
import convertNodeTypeToPlaceHolder from '../utils/convertNodeTypeToPlaceHolder'
import type { Action } from '../utils/pageDispatch'
import textEditorHandleKeyDown from '../utils/textEditorHandleKeyDown'
import textEditorOnUpdate from '../utils/textEditorOnUpdate'

type BlockTypeProps = {
  editor: Editor
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
  listNumber: number
}
const BlockTypeComponent = ({ editor, block, dispatch, listNumber }: BlockTypeProps) => {
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
        <Box w="100%" py={3}>
          <Separator color="black" />
        </Box>
      )
    case 'Citing':
      // 引用
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

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Heading,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
      TaskItem,
      TaskList,
      ToggleList,
      HardBreak,
      Link.configure({
        shouldAutoLink: (url) => url.startsWith('https://') || url.startsWith('http://'),
      }).extend({
        inclusive: false,
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          return convertNodeTypeToPlaceHolder({ node, editor, block })
        },
      }),
    ],
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
      pl={`${String(block.indentIndex * 1.5)}vw`}
      w="100%"
      h="2.7vh"
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
        h="100%"
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
            titleRef={titleRef}
            blockRefs={blockRefs}
            listNumber={listNumber}
          />
        </HStack>
      </Flex>
      <Box
        w="23vw"
        h="100%"
        onClick={() => {
          editor.commands.focus('end')
        }}
      />
    </HStack>
  )
}
const BlockRow = React.memo(BlockRowComponent)
export default BlockRow
