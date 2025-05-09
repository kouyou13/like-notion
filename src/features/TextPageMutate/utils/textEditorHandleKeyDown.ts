import { Editor } from '@tiptap/core'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type Props = {
  editor: Editor | null
  event: KeyboardEvent
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(Editor | null)[]>
}

const textEditorHandleKeyDown = ({
  editor,
  event,
  block,
  dispatch,
  titleRef,
  blockRefs,
}: Props): boolean => {
  console.log(blockRefs.current)
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
    const index = editor?.state.selection.$from.index()
    const childCount = editor?.state.selection.$from.parent.childCount
    const isAtLastLine = childCount && (index === childCount - 1 || index === childCount)
    if (isAtLastLine && block.order + 1 < blockRefs.current.length) {
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
