import { Editor } from '@tiptap/core'

import type { Block, BlockType } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type Props = {
  editor: Editor
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  blockRefs: React.RefObject<(Editor | null)[]>
}
const textEditorOnUpdate = ({ editor, block, dispatch, blockRefs }: Props): void => {
  const updateBlockType = (blockType: BlockType) => {
    dispatch({
      type: 'updateBlockType',
      blockId: block.id,
      blockType,
    })
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
      if (block.blockType !== 'ToDoList') {
        updateBlockType('ToDoList')
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
  } else if (block.blockType !== 'Text') {
    updateBlockType('Text')
  }
}
export default textEditorOnUpdate
