import { v4 } from 'uuid'
import { create } from 'zustand'
import type { Block } from './types'

type JsonState = {
  blocks: Block[]
  addBlock: (payload: { index: number; content: string }) => void
  updateBlock: (payload: { id: string; content: string }) => void
  deleteBlock: (payload: { id: string }) => void
  moveBlock: (payload: { fromIndex: number; toIndex: number }) => void
}

const defaultBlocks: Block[] = [
  {
    id: v4(),
    type: 'text',
    index: 0,
    content: '',
  },
  {
    id: v4(),
    type: 'text',
    index: 1,
    content: '',
  },
  {
    id: v4(),
    type: 'text',
    index: 2,
    content: '',
  },
]

export const useJsonStore = create<JsonState>((set) => ({
  blocks: defaultBlocks,
  addBlock: ({ index, content }) => {
    set((state) => {
      const newBlock: Block = { id: v4(), type: 'text', index: state.blocks.length, content }
      return {
        blocks: [...state.blocks.slice(0, index), newBlock, ...state.blocks.slice(index)].map(
          (block, index) => ({ ...block, index }),
        ),
      }
    })
  },
  updateBlock: ({ id, content }) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }))
  },
  deleteBlock: ({ id }) => {
    set((state) => {
      const newBlocks = state.blocks
        .filter((b) => b.id !== id)
        .map((block, index) => ({ ...block, index }))
      if (newBlocks.length === 0) {
        newBlocks.push({ id: v4(), type: 'text', index: 0, content: '' })
      }
      return {
        blocks: newBlocks,
      }
    })
  },
  moveBlock: ({ fromIndex, toIndex }) => {
    set((state) => {
      const blocks = [...state.blocks]
      const [movedBlock] = blocks.splice(fromIndex, 1)
      blocks.splice(toIndex, 0, movedBlock)
      return {
        blocks: blocks.map((block, index) => ({ ...block, index })),
      }
    })
  },
}))
