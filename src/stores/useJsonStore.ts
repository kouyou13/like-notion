import { create } from 'zustand'

type Block = {
  id: string
  content: string
}

type JsonState = {
  blocks: Block[]
  addBlock: (content: string) => void
  updateBlock: (id: string, content: string) => void
}

export const useJsonStore = create<JsonState>((set) => ({
  blocks: [],
  addBlock: (content) => {
    set((state) => ({
      blocks: [...state.blocks, { id: Date.now().toString(), content }],
    }))
  },
  updateBlock: (id, content) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }))
  },
}))
