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
      return {
        blocks: [...newBlocks, ...(newBlocks.length === 0 ? [defaultBlocks[0]] : [])],
      }
    })
  },
  moveBlock: ({ fromIndex, toIndex }) => {
    set((state) => {
      if (fromIndex === toIndex) return state
      const targetBlock = state.blocks[fromIndex]
      const blocks =
        fromIndex < toIndex
          ? // 下に動かした時
            [
              ...state.blocks.slice(0, fromIndex),
              ...(fromIndex + 1 !== toIndex
                ? state.blocks.slice(fromIndex + 1, toIndex + 1)
                : [state.blocks[toIndex]]),
              targetBlock,
              ...state.blocks.slice(toIndex + 1),
            ]
          : // 上に動かした時
            [
              ...state.blocks.slice(0, toIndex),
              targetBlock,
              ...state.blocks.slice(toIndex, fromIndex),
              ...state.blocks.slice(fromIndex + 1),
            ]
      return {
        blocks: blocks.map((block, index) => ({ ...block, index })),
      }
    })
  },
}))

try {
  const response = await fetch('/api/load')
  if (response.ok && response.status === 200) {
    const data: { blocks: Block[] } = await response.json()
    if (data.blocks.length > 0) {
      useJsonStore.setState({ blocks: data.blocks })
    }
  }
} catch (err: unknown) {
  console.error('初期データの取得に失敗しました:', err)
}

useJsonStore.subscribe((state) => {
  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks: state.blocks }),
  }).catch((err: unknown) => {
    console.error('保存に失敗しました:', err)
  })
})
