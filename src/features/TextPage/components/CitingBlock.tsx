import { Blockquote } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import { EditorContent } from '@tiptap/react'
import React from 'react'

type CitingBlockProps = {
  editor: Editor
}

const CitingBlockComponent = ({ editor }: CitingBlockProps) => {
  return (
    <Blockquote.Root w="100%" my={1} colorPalette="black">
      <Blockquote.Content justifyContent="center" alignItems="center" display="flex" w="100%">
        <EditorContent editor={editor} style={{ width: '100%' }} />
      </Blockquote.Content>
    </Blockquote.Root>
  )
}
const CitingBlock = React.memo(CitingBlockComponent)
export default CitingBlock
