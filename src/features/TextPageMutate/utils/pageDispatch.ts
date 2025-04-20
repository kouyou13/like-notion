import { v4 } from 'uuid'

import type { Block, BlockType } from '../../../types'

export type Action =
  | {
      type: 'addBlock'
      order: number
      blockType: BlockType
    }
  | {
      type: 'updateBlock'
      blockId: string
      newContent: string
      blockType: BlockType
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
            texts: {
              ...block.texts,
              content: action.newContent,
            },
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
  texts: {
    id: v4(),
    content: '',
  },
})
