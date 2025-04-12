import { v4 } from 'uuid'
import { create } from 'zustand'
import type { Block, Page } from './types'

type JsonState = {
  pages: Page[]
  addPage: () => void
  editPageTitle: (pageId: string, title: string) => void
  addBlock: (payload: { pageId: string; index: number; content: string }) => void
  updateBlock: (payload: { pageId: string; blockId: string; content: string }) => void
  deleteBlock: (payload: { pageId: string; blockId: string }) => void
  moveBlock: (payload: { pageId: string; fromIndex: number; toIndex: number }) => void
}

const defaultPages: Page[] = []

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
  pages: defaultPages,
  addPage: () => {
    set((state) => ({
      pages: [...state.pages, { id: v4(), title: '', blocks: defaultBlocks }],
    }))
  },
  editPageTitle: (pageId, title) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) {
          return page
        }
        return { ...page, title }
      }),
    }))
  },
  addBlock: ({ pageId, index, content }) => {
    set((state) => {
      return {
        pages: state.pages.map((page) => {
          if (page.id !== pageId) {
            return page
          }
          const newBlock: Block = { id: v4(), type: 'text', index: page.blocks.length, content }
          return {
            ...page,
            blocks: [...page.blocks.slice(0, index), newBlock, ...page.blocks.slice(index)],
          }
        }),
      }
    })
  },
  updateBlock: ({ pageId, blockId, content }) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) {
          return page
        }
        return {
          ...page,
          blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
        }
      }),
    }))
  },
  deleteBlock: ({ pageId, blockId }) => {
    set((state) => ({
      pages: state.pages.map((page) => {
        if (page.id !== pageId) {
          return page
        }
        const newBlocks = page.blocks
          .filter((b) => b.id !== blockId)
          .map((block, index) => ({ ...block, index }))
        return {
          ...page,
          blocks: [...newBlocks, ...(newBlocks.length === 0 ? [defaultBlocks[0]] : [])].map(
            (block, index) => ({ ...block, index }),
          ),
        }
      }),
    }))
  },
  moveBlock: ({ pageId, fromIndex, toIndex }) => {
    set((state) => {
      if (fromIndex === toIndex) return state
      return {
        pages: state.pages.map((page) => {
          if (page.id !== pageId) {
            return page
          }
          const targetBlock = page.blocks[fromIndex]
          const blocks =
            fromIndex < toIndex
              ? // 下に動かした時
                [
                  ...page.blocks.slice(0, fromIndex),
                  ...(fromIndex + 1 !== toIndex
                    ? page.blocks.slice(fromIndex + 1, toIndex + 1)
                    : [page.blocks[toIndex]]),
                  targetBlock,
                  ...page.blocks.slice(toIndex + 1),
                ]
              : // 上に動かした時
                [
                  ...page.blocks.slice(0, toIndex),
                  targetBlock,
                  ...page.blocks.slice(toIndex, fromIndex),
                  ...page.blocks.slice(fromIndex + 1),
                ]
          return {
            ...page,
            blocks: blocks.map((block, index) => ({ ...block, index })),
          }
        }),
      }
    })
  },
}))

// 初期データの取得
try {
  const response = await fetch('/api/load')
  if (response.ok && response.status === 200) {
    const data: { pages: Page[] } = await response.json()
    if (data.pages.length > 0) {
      useJsonStore.setState(data)
    }
  }
} catch (err: unknown) {
  console.error('初期データの取得に失敗しました:', err)
}

// データの保存
useJsonStore.subscribe((state) => {
  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }).catch((err: unknown) => {
    console.error('保存に失敗しました:', err)
  })
})
