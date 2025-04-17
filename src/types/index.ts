export type Page = {
  id: string
  title: string
  order: number
  isDeleted: string[] | null
}

export type BlockType =
  | 'Text'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'List'
  | 'ListNumbers'
  | 'TodoList'
  | 'ToggleList'
  | 'Page'
  | 'Callout'
  | 'Citing'
  | 'Table'
  | 'Separator'
  | 'PageLink'

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
