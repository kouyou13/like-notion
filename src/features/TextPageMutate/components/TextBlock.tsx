import { Editor } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
      StarterKit,
      TaskItem,
      TaskList,
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

  blockRefs.current[block.order] = editor

  return <EditorContent editor={editor} style={{ width: '100%' }} />
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
