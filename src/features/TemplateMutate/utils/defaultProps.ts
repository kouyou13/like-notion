import { v4 } from 'uuid'

import type { PageWithBlocks, Block } from '../types/index'

export const defaultBlocks: Block[] = [
  {
    id: v4(),
    blockType: 'text',
    order: 0,
    texts: {
      id: v4(),
      content: '',
    },
  },
  {
    id: v4(),
    blockType: 'text',
    order: 1,
    texts: {
      id: v4(),
      content: '',
    },
  },
  {
    id: v4(),
    blockType: 'text',
    order: 2,
    texts: {
      id: v4(),
      content: '',
    },
  },
]

export const defaultPage: PageWithBlocks = {
  id: v4(),
  title: '',
  pageBlocks: defaultBlocks,
}
