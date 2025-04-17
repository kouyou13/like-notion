import type { BlockType, Text } from '../types'

export type Page_snake = {
  id: string
  title: string
  order: number
  is_deleted: string[] | null
}

export type Block_snake = {
  id: string
  block_type: BlockType
  order: number
  texts: Text
}

export type PageWithBlocks_snake = Page_snake & {
  page_blocks: Block_snake[]
}
