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
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
}
const TextBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
}: TextBlockProps) => {
  console.log(titleRef, blockRefs, rowLength)
  // const [isComposing, setIsComposing] = useState(false) // IME入力中か

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading' && node.attrs.level === 1) {
            return '見出し1'
          } else if (node.type.name === 'heading' && node.attrs.level === 2) {
            return '見出し2'
          } else if (node.type.name === 'heading' && node.attrs.level === 3) {
            return '見出し3'
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
        }
        return
      }
      if (block.blockType !== 'Text') {
        dispatch({
          type: 'updateBlockType',
          blockId: block.id,
          blockType: 'Text',
        })
      }
    },
  })

  // const handleKeyDown = useCallback(
  //   (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //     if (isComposing) {
  //       // IME入力中は何もしない
  //       return
  //     } else if (e.key === 'Backspace' && block.message === '' && block.indentIndex === 0) {
  //       e.preventDefault()
  //       if (block.blockType === 'Text') {
  //         if (rowLength > 1) {
  //           dispatch({
  //             type: 'deleteBlock',
  //             blockId: block.id,
  //           })
  //           const prevInput =
  //             block.order > 0 ? blockRefs.current[block.order - 1] : blockRefs.current[1]
  //           if (prevInput) {
  //             prevInput.focus()
  //           }
  //         }
  //       } else {
  //         dispatch({
  //           type: 'updateBlockType',
  //           blockId: block.id,
  //           blockType: 'Text',
  //         })
  //         setTimeout(() => {
  //           blockRefs.current[block.order]?.focus()
  //         })
  //       }
  //     } else if (e.key === 'ArrowUp') {
  //       e.preventDefault()
  //       if (block.order > 0) {
  //         const prevInput = blockRefs.current[block.order - 1]
  //         if (prevInput) {
  //           prevInput.focus()
  //         }
  //       } else if (block.order === 0) {
  //         titleRef.current?.focus()
  //       }
  //     } else if (e.key === 'ArrowDown' && block.order < rowLength - 1) {
  //       e.preventDefault()
  //       const nextInput = blockRefs.current[block.order + 1]
  //       if (nextInput) {
  //         nextInput.focus()
  //       }
  //     } else if (e.key === 'Enter' && !e.shiftKey) {
  //       // Shift + Enter でない時
  //       e.preventDefault()
  //       if (block.message === '' && block.blockType !== 'Text' && block.blockType !== 'Callout') {
  //         dispatch({
  //           type: 'updateBlockType',
  //           blockId: block.id,
  //           blockType: 'Text',
  //         })
  //         setTimeout(() => {
  //           blockRefs.current[block.order]?.focus()
  //         })
  //       } else {
  //         dispatch({
  //           type: 'addBlock',
  //           order: block.order + 1,
  //           blockType: 'Text',
  //           indentIndex: block.indentIndex,
  //         })
  //         setTimeout(() => {
  //           const nextInput = blockRefs.current[block.order + 1]
  //           if (nextInput) {
  //             nextInput.focus()
  //           }
  //         }, 0)
  //       }
  //     }
  //   },
  //   [block, blockRefs, dispatch, rowLength, titleRef, isComposing],
  // )
  return (
    // <Textarea
    //   ref={(el) => {
    //     blockRefs.current[block.order] = el
    //   }}
    //   fontWeight={fontWeight}
    //   onBlur={(e) => {
    //     if (block.blockType === 'Text' || block.blockType === 'Callout') {
    //       e.target.placeholder = ''
    //     }
    //   }}
    //   onFocus={(e) => {
    //     if (block.blockType === 'Text' || block.blockType === 'Callout') {
    //       e.target.placeholder = '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
    //     }
    //   }}
    //   placeholder={placeholder}
    //   value={block.message}
    //   h={height}
    //   w="100%"
    //   fontSize={fontSize}
    //   lineHeight={lineHeight}
    //   border="none"
    //   outline="none"
    //   px={0}
    //   py={py}
    //   rows={1}
    //   onCompositionStart={() => {
    //     setIsComposing(true)
    //   }}
    //   onCompositionEnd={() => {
    //     setIsComposing(false)
    //     if (block.blockType === 'Text' && block.message === '・') {
    //       dispatch({
    //         type: 'updateBlock',
    //         blockId: block.id,
    //         blockType: 'List',
    //         message: '',
    //         indentIndex: block.indentIndex,
    //       })
    //       setTimeout(() => {
    //         blockRefs.current[block.order]?.focus()
    //       })
    //     }
    //   }}
    //   onChange={(e) => {
    //     const newMessage = e.target.value
    //     if (block.blockType === 'Text' && newMessage === '---') {
    //       dispatch({
    //         type: 'updateBlockType',
    //         blockId: block.id,
    //         blockType: 'SeparatorLine',
    //       })
    //       dispatch({
    //         type: 'addBlock',
    //         order: block.order + 1,
    //         blockType: 'Text',
    //         indentIndex: block.indentIndex,
    //       })
    //       setTimeout(() => {
    //         blockRefs.current[block.order + 1]?.focus()
    //       })
    //     } else if (block.blockType === 'Text' && newMessage === '- ') {
    //       dispatch({
    //         type: 'updateBlock',
    //         blockId: block.id,
    //         blockType: 'List',
    //         message: '',
    //         indentIndex: block.indentIndex,
    //       })
    //       setTimeout(() => {
    //         blockRefs.current[block.order]?.focus()
    //       })
    //     } else {
    //       dispatch({
    //         type: 'updateBlockMessage',
    //         blockId: block.id,
    //         message: newMessage,
    //       })
    //     }
    //   }}
    //   onKeyDown={handleKeyDown}
    //   autoresize
    // />
    <EditorContent editor={editor} style={{ width: '100%' }} />
  )
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
