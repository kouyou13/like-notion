export type Page = {
  id: string
  title: string
  blocks: Block[]
}

export type Block = {
  id: string
  type: InputType
  index: number
  content: string
}

export type InputType = 'text'
