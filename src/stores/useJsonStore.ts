import { v4 } from 'uuid'
import { create } from 'zustand'

type Block = {
  id: string
  index: number
  content: string
}

type JsonState = {
  blocks: Block[]
  addBlock: (payload: { index: number; content: string }) => void
  updateBlock: (payload: { id: string; content: string }) => void
  deleteBlock: (payload: { id: string }) => void
  moveBlock: (payload: { fromIndex: number; toIndex: number }) => void
}

export const useJsonStore = create<JsonState>((set) => ({
  blocks: [
    {
      id: v4(),
      index: 0,
      content: '1行目',
    },
  ],
  addBlock: ({ index, content }) => {
    set((state) => ({
      blocks: [
        ...state.blocks.slice(0, index),
        { id: v4(), index: state.blocks.length, content },
        ...state.blocks.slice(index),
      ].map((block, index) => ({ ...block, index })),
    }))
  },
  updateBlock: ({ id, content }) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }))
  },
  deleteBlock: ({ id }) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id).map((block, index) => ({ ...block, index })),
    }))
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
