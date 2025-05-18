import { Flex, HStack } from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import { EditorContent } from '@tiptap/react'
import React from 'react'
import { FcIdea } from 'react-icons/fc'

type CallbackBlockProps = {
  editor: Editor
}

const CallbackBlockComponent = ({ editor }: CallbackBlockProps) => {
  return (
    <HStack minH="3.5rem" justify="center" bgColor="gray.50" gap={0} w="100%" my={1} py={3}>
      <Flex w="3vw" align="center" justify="center">
        <FcIdea size={18} />
      </Flex>
      <EditorContent editor={editor} style={{ width: '100%' }} />
    </HStack>
  )
}
const CallbackBlock = React.memo(CallbackBlockComponent)
export default CallbackBlock
