import { Editor } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type TextBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}
const TextBlockComponent = ({ block, dispatch, titleRef, blockRefs }: TextBlockProps) => {
  // const [isComposing, setIsComposing] = useState(false) // IME入力中か

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          if (node.type.name === 'heading' && node.attrs.level === 1) {
            return '見出し1'
          } else if (node.type.name === 'heading' && node.attrs.level === 2) {
            return '見出し2'
          } else if (node.type.name === 'heading' && node.attrs.level === 3) {
            return '見出し3'
          } else if (node.type.name === 'bulletList' || node.type.name === 'orderedList') {
            return 'リスト'
          } else if (node.type.name === 'blockquote') {
            return 'トグル'
          } else if (node.type.name === 'paragraph' && editor.isFocused) {
            return '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
          }
          // case 'Citing':
          //   return '入力してください...'
          return ''
        },
      }),
    ],
    content: block.message,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      dispatch({
        type: 'updateBlockMessage',
        blockId: block.id,
        message: html,
      })
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const h1Tags = doc.querySelectorAll('h1')
      if (h1Tags.length > 0) {
        if (block.blockType !== 'H1') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'H1',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      const h2Tags = doc.querySelectorAll('h2')
      if (h2Tags.length > 0) {
        if (block.blockType !== 'H2') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'H2',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      const h3Tags = doc.querySelectorAll('h3')
      if (h3Tags.length > 0) {
        if (block.blockType !== 'H3') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'H3',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      const ulTags = doc.querySelectorAll('ul')
      if (ulTags.length > 0) {
        if (block.blockType !== 'List') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'List',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      const olTags = doc.querySelectorAll('ol')
      if (olTags.length > 0) {
        if (block.blockType !== 'ListNumbers') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'ListNumbers',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      const blockquoteTags = doc.querySelectorAll('blockquote')
      if (blockquoteTags.length > 0) {
        if (block.blockType !== 'ToggleList') {
          dispatch({
            type: 'updateBlockType',
            blockId: block.id,
            blockType: 'ToggleList',
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.commands.focus()
          })
        }
        return
      }
      if (block.blockType !== 'Text') {
        dispatch({
          type: 'updateBlockType',
          blockId: block.id,
          blockType: 'Text',
        })
        setTimeout(() => {
          blockRefs.current[block.order]?.commands.focus()
        })
      }
    },
    editorProps: {
      handleKeyDown: (view, event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
            blockType: block.blockType,
            indentIndex: block.indentIndex,
          })
          setTimeout(() => {
            blockRefs.current[block.order + 1]?.commands.focus()
          })
          return true // trueの時, 無効化
        } else if (event.key === 'Backspace') {
          if (block.message === '<p></p>' || block.message === '') {
            dispatch({
              type: 'deleteBlock',
              blockId: block.id,
            })
            setTimeout(() => {
              blockRefs.current[block.order - 1]?.commands.focus()
            })
          }
        } else if (event.key === 'ArrowUp') {
          if (block.order > 0) {
            blockRefs.current[block.order - 1]?.commands.focus()
          } else if (block.order === 0) {
            titleRef.current?.focus()
          }
        } else if (event.key === 'ArrowDown') {
          if (block.order < blockRefs.current.length) {
            blockRefs.current[block.order + 1]?.commands.focus()
          }
        }
        return false
      },
    },
  })

  return (
    <EditorContent
      editor={editor}
      style={{ width: '100%' }}
      ref={() => {
        blockRefs.current[block.order] = editor
      }}
    />
  )
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
