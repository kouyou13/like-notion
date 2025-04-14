import { v4 } from 'uuid'
import type { PageWithBlocks, Block } from '../types/index'

export const defaultBlocks: Block[] = [
  {
    id: v4(),
    blockType: 'text',
    order: 0,
    text: {
      id: v4(),
      content: '',
    },
  },
  {
    id: v4(),
    blockType: 'text',
    order: 1,
    text: {
      id: v4(),
      content: '',
    },
  },
  {
    id: v4(),
    blockType: 'text',
    order: 2,
    text: {
      id: v4(),
      content: '',
    },
  },
]

export const defaultPage: PageWithBlocks = {
  id: v4(),
  title: '',
  pageBlock: defaultBlocks,
}
