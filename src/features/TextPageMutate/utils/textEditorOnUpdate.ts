import { Editor } from '@tiptap/core'

import type { Block, BlockType } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type Props = {
  editor: Editor
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  blockRefs: React.RefObject<(Editor | null)[]>
}
/**
 * テキストブロックで編集した時の処理 (コマンドによってblockTypeを変更したい時も含む)
 * @param editor tiptapのEditor
 * @param block 対象のブロックデータ
 * @param dispatch 編集内容を読み込むdispatch
 * @return void
 */
const textEditorOnUpdate = ({ editor, block, dispatch, blockRefs }: Props): void => {
  const updateBlockType = (blockType: BlockType, isChecked?: boolean) => {
    dispatch({
      type: 'updateBlockType',
      blockId: block.id,
      blockType,
    })
    if (isChecked != null) {
      dispatch({
        type: 'checkedBlock',
        blockId: block.id,
        isChecked,
      })
    }
    setTimeout(() => {
      blockRefs.current[block.order]?.commands.focus()
    })
  }

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
      updateBlockType('H1')
    }
  } else if (doc.querySelectorAll('h2').length > 0) {
    if (block.blockType !== 'H2') {
      updateBlockType('H2')
    }
  } else if (doc.querySelectorAll('h3').length > 0) {
    if (block.blockType !== 'H3') {
      updateBlockType('H3')
    }
  } else if (doc.querySelectorAll('ul').length > 0) {
    if (doc.querySelectorAll('label').length > 0) {
      const uncheckedItems = doc.querySelectorAll('ul li[data-checked="true"]')
      if (block.blockType !== 'ToDoList') {
        updateBlockType('ToDoList', uncheckedItems.length > 0)
      }
    } else {
      if (block.blockType !== 'List') {
        updateBlockType('List')
      }
    }
  } else if (doc.querySelectorAll('ol').length > 0) {
    if (block.blockType !== 'ListNumbers') {
      updateBlockType('ListNumbers')
    }
  } else if (doc.querySelectorAll('blockquote').length > 0) {
    if (block.blockType !== 'ToggleList') {
      updateBlockType('ToggleList')
    }
  } else if (doc.querySelectorAll('pre').length > 0) {
    if (block.blockType !== 'Code') {
      updateBlockType('Code')
    }
  } else if (
    block.blockType !== 'Text' &&
    block.blockType !== 'Callout' &&
    block.blockType !== 'Citing'
  ) {
    updateBlockType('Text')
  }

  setTimeout(() => {
    if (editor.options.content === '<p>---</p>') {
      dispatch({
        type: 'updateBlockType',
        blockId: block.id,
        blockType: 'SeparatorLine',
      })
      dispatch({
        type: 'addBlock',
        order: block.order + 1,
        blockType: 'Text',
        indentIndex: block.indentIndex,
      })
    } else if (editor.options.content === '<p>| </p>') {
      dispatch({
        type: 'updateBlock',
        blockId: block.id,
        message: '<p></p>',
        indentIndex: block.indentIndex,
        blockType: 'Citing',
      })
      setTimeout(() => {
        blockRefs.current[block.order]?.commands.focus()
      })
    }
  })
}
export default textEditorOnUpdate
