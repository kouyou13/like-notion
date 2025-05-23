import { v4 } from 'uuid'

import type { Block, BlockType } from '../../../types'

export type Action =
  | {
      type: 'addBlock'
      order: number
      blockType: BlockType
      indentIndex: number
    }
  | {
      type: 'updateBlock'
      blockId: string
      message: string
      blockType: BlockType
      indentIndex: number
    }
  | {
      type: 'updateBlockMessage'
      blockId: string
      message: string
    }
  | {
      type: 'updateBlockType'
      blockId: string
      blockType: BlockType
    }
  | {
      type: 'checkedBlock'
      blockId: string
      isChecked: boolean
    }
  | {
      type: 'deleteBlock'
      blockId: string
    }
  | {
      type: 'moveBlock'
      fromIndex: number
      toIndex: number
    }
  | {
      // インデント追加
      type: 'addIndent'
      blockId: string
    }
  | {
      // インデント削除
      type: 'subIndent'
      blockId: string
    }
  | {
      // block[]の読み込み
      type: 'initBlocks'
      blocks: Block[]
    }

export const blocksReducer = (blocks: Block[], action: Action): Block[] => {
  switch (action.type) {
    case 'addBlock': {
      return [
        ...blocks.slice(0, action.order),
        defaultBlock(action.order, action.blockType, action.indentIndex),
        ...blocks.slice(action.order),
      ].map((b, index) => ({ ...b, order: index }))
    }
    case 'updateBlock': {
      return blocks.map((block) => {
        if (block.id === action.blockId) {
          return {
            ...block,
            blockType: action.blockType,
            indentIndex: action.indentIndex,
            message: action.message,
          }
        }
        return block
      })
    }
    case 'updateBlockMessage': {
      return blocks.map((block) => {
        if (block.id === action.blockId) {
          return {
            ...block,
            message: action.message,
          }
        }
        return block
      })
    }
    case 'updateBlockType': {
      return blocks.map((block) => {
        if (block.id === action.blockId) {
          return {
            ...block,
            blockType: action.blockType,
          }
        }
        return block
      })
    }
    case 'checkedBlock': {
      return blocks.map((block) => {
        if (block.id === action.blockId) {
          return {
            ...block,
            isChecked: action.isChecked,
          }
        }
        return block
      })
    }
    case 'deleteBlock': {
      if (blocks.length > 1) {
        return blocks
          .filter((block) => block.id !== action.blockId)
          .map((b, index) => ({ ...b, order: index }))
      }
      return blocks
    }
    case 'moveBlock': {
      if (action.fromIndex === action.toIndex) {
        return blocks
      }
      const targetBlock = blocks[action.fromIndex]
      if (action.fromIndex < action.toIndex) {
        return [
          ...blocks.slice(0, action.fromIndex),
          ...blocks.slice(action.fromIndex + 1, action.toIndex + 1),
          targetBlock,
          ...blocks.slice(action.toIndex + 1),
        ].map((b, index) => ({ ...b, order: index }))
      } else {
        return [
          ...blocks.slice(0, action.toIndex),
          targetBlock,
          ...blocks.slice(action.toIndex, action.fromIndex),
          ...blocks.slice(action.fromIndex + 1),
        ].map((b, index) => ({ ...b, order: index }))
      }
    }
    case 'addIndent': {
      let toggleBlockIndent: number | null = null
      return blocks.map((block, index) => {
        if (index === 0) {
          return block
        } else if (block.id === action.blockId) {
          const prevBlockIndent = blocks[index - 1].indentIndex
          if (prevBlockIndent + 1 > block.indentIndex) {
            if (block.blockType === 'ToggleList' && toggleBlockIndent == null && !block.isChecked) {
              toggleBlockIndent = block.indentIndex
            }
            return {
              ...block,
              indentIndex: block.indentIndex + 1,
            }
          }
        } else if (toggleBlockIndent != null) {
          if (block.indentIndex > toggleBlockIndent) {
            return {
              ...block,
              indentIndex: block.indentIndex + 1,
            }
          } else {
            toggleBlockIndent = null
          }
        }
        return block
      })
    }
    case 'subIndent': {
      let toggleBlockIndent: number | null = null
      return blocks.map((block) => {
        if (block.indentIndex === 0) {
          return block
        } else if (block.id === action.blockId) {
          if (block.blockType === 'ToggleList' && toggleBlockIndent == null) {
            toggleBlockIndent = block.indentIndex
          }
          return {
            ...block,
            indentIndex: block.indentIndex - 1,
          }
        } else if (toggleBlockIndent != null) {
          if (block.indentIndex > toggleBlockIndent) {
            return {
              ...block,
              indentIndex: block.indentIndex - 1,
            }
          } else {
            toggleBlockIndent = null
          }
        }
        return block
      })
    }
    case 'initBlocks': {
      return action.blocks.map((b, index) => ({ ...b, order: index }))
    }
    default:
      return blocks
  }
}

const defaultBlock = (order: number, blockType: BlockType, indentIndex?: number): Block => ({
  id: v4(),
  order,
  indentIndex: indentIndex ?? 0,
  isChecked: false,
  ...convertDefaultMessage(blockType),
})

const convertDefaultMessage = (blockType: BlockType): { blockType: BlockType; message: string } => {
  switch (blockType) {
    case 'List':
      return { blockType: 'List', message: '<ul></ul>' }
    case 'ToDoList':
      return {
        blockType: 'ToDoList',
        message: '<ul data-type="taskList"></ul>',
      }
    case 'ListNumbers':
      return { blockType: 'ListNumbers', message: '<ol></ol>' }
    default:
      return { blockType: 'Text', message: '<p></p>' }
  }
}
