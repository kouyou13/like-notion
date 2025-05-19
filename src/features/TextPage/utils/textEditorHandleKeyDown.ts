import { Editor } from '@tiptap/core'

import type { Action } from './pageDispatch'
import type { Block } from '../../../types'

type Props = {
  editor: Editor | null
  event: KeyboardEvent
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}
/**
 * テキストブロックで特定のキーを押した時の処理
 * @param editor tiptapのEditor
 * @param event tiptapのKeyを押した時のEvent
 * @param block 対象のブロックデータ
 * @param dispatch 編集内容を読み込むdispatch
 * @param titleRef タイトル部分のuseRef
 * @param blockRefs ブロック部分のuseRef
 * @return キーのデフォルト処理を行うかのboolean (trueならデフォルト処理をしない)
 */
const textEditorHandleKeyDown = ({
  editor,
  event,
  block,
  dispatch,
  titleRef,
  blockRefs,
}: Props): boolean => {
  if (event.key === 'Enter' && !event.shiftKey && block.blockType !== 'Code') {
    event.preventDefault()
    if (editor?.isEmpty && block.blockType !== 'Text') {
      dispatch({
        type: 'updateBlock',
        blockId: block.id,
        blockType: 'Text',
        message: '<p></p>',
        indentIndex: block.indentIndex,
      })
      setTimeout(() => {
        blockRefs.current[block.order]?.commands.clearNodes()
        blockRefs.current[block.order]?.commands.focus()
      })
    } else if (block.blockType === 'ToggleList') {
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
      } else {
        let i
        for (i = 1; block.order + i < blockRefs.current.length; i++) {
          if (blockRefs.current[block.order + i] != null) {
            break
          }
        }
        dispatch({
          type: 'addBlock',
          order: block.order + i,
          blockType: block.blockType,
          indentIndex: block.indentIndex,
        })
        setTimeout(() => {
          blockRefs.current[block.order + i]?.commands.focus()
        })
      }
    } else {
      const index =
        (editor?.state.selection.$from.pos ?? 1) - (editor?.state.selection.$from.depth ?? 0)
      // ブロックの先頭にカーソルがある時
      if (!editor?.isEmpty && index === 0) {
        dispatch({
          type: 'addBlock',
          order: block.order,
          blockType: block.blockType,
          indentIndex: block.indentIndex,
        })
        setTimeout(() => {
          blockRefs.current[block.order]?.commands.focus()
        })
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
    }
    return true
  } else if (event.key === 'Enter' && event.shiftKey && block.blockType === 'Code') {
    event.preventDefault()
    let i
    for (i = 1; block.order + i < blockRefs.current.length; i++) {
      if (blockRefs.current[block.order + i] != null) {
        break
      }
    }
    dispatch({
      type: 'addBlock',
      order: block.order + i,
      blockType: block.blockType,
      indentIndex: block.indentIndex,
    })
    setTimeout(() => {
      blockRefs.current[block.order + i]?.commands.focus()
    })
    return true
  } else if (event.key === 'Backspace') {
    if (block.message === '<p></p>' || block.message === '') {
      if (block.blockType === 'Text') {
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
            for (let i = 1; block.order - i >= 0; i++) {
              if (blockRefs.current[block.order - i] != null) {
                blockRefs.current[block.order - i]?.commands.focus()
                break
              }
            }
          })
        }
      } else if (block.blockType === 'Callout' || block.blockType === 'Citing') {
        dispatch({
          type: 'updateBlockType',
          blockId: block.id,
          blockType: 'Text',
        })
        setTimeout(() => {
          blockRefs.current[block.order]?.commands.focus()
        })
      }
    }
  } else if (event.key === 'ArrowUp') {
    const index = editor?.state.selection.$from.index()
    if (index === 0 || index === 1) {
      if (block.order > 0) {
        // 上のブロックに移動
        for (let i = 1; block.order - i >= 0; i++) {
          if (blockRefs.current[block.order - i] != null) {
            blockRefs.current[block.order - i]?.commands.focus()
            break
          }
        }
      } else {
        titleRef.current?.focus()
      }
    }
  } else if (event.key === 'ArrowDown') {
    const index = editor?.state.selection.$to.index()
    const childCount = editor?.state.selection.$to.parent.childCount
    const isAtLastLine = childCount && (index === childCount - 1 || index === childCount)
    if (editor?.isEmpty || (isAtLastLine && block.order + 1 < blockRefs.current.length)) {
      // 下のブロックに移動
      for (let i = 1; block.order + i < blockRefs.current.length; i++) {
        if (blockRefs.current[block.order + i] != null) {
          blockRefs.current[block.order + i]?.commands.focus()
          break
        }
      }
    }
  }
  return false
}

export default textEditorHandleKeyDown
