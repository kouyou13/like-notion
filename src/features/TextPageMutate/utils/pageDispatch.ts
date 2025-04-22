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
      newContent: string
      blockType: BlockType
      indentIndex: number
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
      type: 'initBlocks'
      blocks: Block[]
    }
  | {
      type: 'addIndent'
      blockId: string
    }
  | {
      type: 'subIndent'
      blockId: string
    }

export const blocksReducer = (blocks: Block[], action: Action): Block[] => {
  switch (action.type) {
    case 'addBlock': {
      return [
        ...blocks.slice(0, action.order),
        defaultBlock(action.order, action.blockType),
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
      return blocks.map((block, index) => {
        if (block.id !== action.blockId || index === 0) {
          return block
        }
        const prevBlockIndent = blocks[index - 1].indentIndex
        if (prevBlockIndent + 1 > block.indentIndex) {
          return {
            ...block,
            indentIndex: block.indentIndex + 1,
          }
        }
        return block
      })
    }
    case 'subIndent': {
      return blocks.map((block) => {
        if (block.id !== action.blockId || block.indentIndex === 0) {
          return block
        }
        return {
          ...block,
          indentIndex: block.indentIndex - 1,
        }
      })
    }
    case 'initBlocks': {
      return action.blocks
    }
    default:
      return blocks
  }
}

const defaultBlock = (order: number, blockType: BlockType): Block => ({
  id: v4(),
  blockType,
  order,
  indentIndex: 0,
  message: '',
})
