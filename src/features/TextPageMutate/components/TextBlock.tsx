import { Editor } from '@tiptap/core'
import ToggleList from '@tiptap/extension-blockquote' // blockquoteをトグルリストとして扱う
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-italic'
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

  return <EditorContent editor={editor} style={{ width: '100%' }} />
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
