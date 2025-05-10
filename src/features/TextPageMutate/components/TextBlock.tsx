import { Editor } from '@tiptap/core'
import ToggleList from '@tiptap/extension-blockquote' // blockquoteをトグルリストとして扱う
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent } from '@tiptap/react'
import React from 'react'

import type { Block } from '../../../types'
import convertNodeTypeToPlaceHolder from '../utils/convertNodeTypeToPlaceHolder'
import type { Action } from '../utils/pageDispatch'
import textEditorHandleKeyDown from '../utils/textEditorHandleKeyDown'
import textEditorOnUpdate from '../utils/textEditorOnUpdate'

type TextBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}
const TextBlockComponent = ({ block, dispatch, titleRef, blockRefs }: TextBlockProps) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Heading,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
      TaskItem,
      TaskList,
      ToggleList,
      HardBreak,
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          return convertNodeTypeToPlaceHolder({ node, editor })
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

  return <EditorContent editor={editor} style={{ width: '100%' }} />
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
