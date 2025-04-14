export type Page = {
  id: string
  title: string
}

export type BlockType = 'text'

export type Block = {
  id: string
  blockType: BlockType
  order: number
  texts: Text
}

export type Text = {
  id: string
  content: string
}

export type PageWithBlocks = Page & {
  pageBlocks: Block[]
}
