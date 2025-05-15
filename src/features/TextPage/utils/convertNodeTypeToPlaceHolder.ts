import { Node } from '@/../prosemirror-model/dist/index'
import { Editor } from '@tiptap/react'

import type { Block } from '../../../types'

type Props = {
  node: Node
  editor: Editor
  block: Block
}
/**
 * Nodeの種類からplaceholderの文字列を返す関数
 * @param node tiptapで出力されるNode
 * @param editor tiptapのEditor
 * @param block 対象のblockデータ
 * @return placeholderの文字列
 */
const convertNodeTypeToPlaceHolder = ({ node, editor, block }: Props): string => {
  if (node.type.name === 'heading' && node.attrs.level === 1) {
    return '見出し1'
  } else if (node.type.name === 'heading' && node.attrs.level === 2) {
    return '見出し2'
  } else if (node.type.name === 'heading' && node.attrs.level === 3) {
    return '見出し3'
  } else if (node.type.name === 'bulletList' || node.type.name === 'orderedList') {
    return 'リスト'
  } else if (node.type.name === 'blockquote') {
    return 'トグル'
  } else if (node.type.name === 'taskList') {
    return 'ToDo'
  } else if (node.type.name === 'paragraph' && editor.isFocused) {
    return '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
  } else if (block.blockType === 'Citing') {
    return '入力してください...'
  }
  return ''
}
export default convertNodeTypeToPlaceHolder
