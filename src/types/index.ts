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
  | 'ToDoList'
  | 'ToggleList'
  | 'Page'
  | 'Callout'
  | 'Citing'
  | 'Table'
  | 'SeparatorLine'
  | 'PageLink'

export type Block = {
  id: string
  blockType: BlockType
  order: number
  indentIndex: number
  texts: Text
}

export type Text = {
  id: string
  content: string
}

export type PageWithBlocks = Page & {
  pageBlocks: Block[]
}
