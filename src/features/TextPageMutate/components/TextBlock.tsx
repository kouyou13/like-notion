import { Editor } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskItem,
      TaskList,
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
          } else if (node.type.name === 'taskList') {
            return 'ToDo'
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
      if (doc.querySelectorAll('h1').length > 0) {
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
      } else if (doc.querySelectorAll('h2').length > 0) {
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
      } else if (doc.querySelectorAll('h3').length > 0) {
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
      } else if (doc.querySelectorAll('ul').length > 0) {
        if (doc.querySelectorAll('label').length > 0) {
          if (block.blockType !== 'ToDoList') {
            dispatch({
              type: 'updateBlockType',
              blockId: block.id,
              blockType: 'ToDoList',
            })
            setTimeout(() => {
              blockRefs.current[block.order]?.commands.focus()
            })
          }
          return
        } else {
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
      } else if (doc.querySelectorAll('ol').length > 0) {
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
      } else if (doc.querySelectorAll('blockquote').length > 0) {
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
      } else if (block.blockType !== 'Text') {
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
      handleKeyDown: (_, event: KeyboardEvent) => {
        console.log(editor?.state.selection.$from.pos)
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          if (block.blockType === 'ToggleList') {
            // トグル展開時
            if (block.isChecked) {
              dispatch({
                type: 'addBlock',
                order: block.order + 1,
                blockType: block.blockType,
                indentIndex: block.indentIndex + 1,
              })
              setTimeout(() => {
                blockRefs.current[block.order + 1]?.commands.focus()
              })
            }
          } else {
            dispatch({
              type: 'addBlock',
              order: block.order + 1,
              blockType: block.blockType,
              indentIndex: block.indentIndex,
            })
            setTimeout(() => {
              blockRefs.current[block.order + 1]?.commands.focus()
            })
          }
          return true // trueの時, 無効化
        } else if (event.key === 'Backspace') {
          if (block.message === '<p></p>' || block.message === '') {
            if (block.indentIndex > 0) {
              dispatch({
                type: 'subIndent',
                blockId: block.id,
              })
              setTimeout(() => {
                blockRefs.current[block.order]?.commands.focus()
              })
            } else {
              dispatch({
                type: 'deleteBlock',
                blockId: block.id,
              })
              setTimeout(() => {
                blockRefs.current[block.order - 1]?.commands.focus()
              })
            }
          }
        } else if (event.key === 'ArrowUp') {
          if (block.order > 0) {
            for (let i = 1; block.order - i >= 0; i++) {
              if (blockRefs.current[block.order - i] != null) {
                blockRefs.current[block.order - i]?.commands.focus()
                break
              }
            }
          } else if (block.order === 0) {
            titleRef.current?.focus()
          }
        } else if (event.key === 'ArrowDown') {
          for (let i = 1; block.order + i < blockRefs.current.length; i++) {
            if (blockRefs.current[block.order + i] != null) {
              blockRefs.current[block.order + i]?.commands.focus()
              break
            }
          }
        }
        return false
      },
    },
  })

  blockRefs.current[block.order] = editor

  return <EditorContent editor={editor} style={{ width: '100%' }} />
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
