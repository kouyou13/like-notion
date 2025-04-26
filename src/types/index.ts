import type { Constants } from './supabase'

export type Page = {
  id: string
  title: string
  order: number
  deletedAt: string | null
  parentBlockId: string | null
}

export type BlockType = (typeof Constants)['public']['Enums']['block_type'][number]

export type Block = {
  id: string
  blockType: BlockType
  message: string
  order: number
  indentIndex: number
  isChecked: boolean
}

export type PageWithBlocks = Page & {
  block: Block[]
}
