import { Input } from '@chakra-ui/react'
import React from 'react'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type TextBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLInputElement | null>
  blockRefs: React.RefObject<(HTMLInputElement | null)[]>
  rowLength: number
}
const TextBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
}: TextBlockProps) => {
  return (
    <Input
      ref={(el) => {
        blockRefs.current[block.order] = el
      }}
      size="lg"
      border="none"
      outline="none"
      p={0}
      w={650}
      mr={50}
      onBlur={(e) => {
        e.target.placeholder = ''
      }}
      onFocus={(e) => {
        e.target.placeholder = '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
      }}
      value={block.texts.content}
      h={8}
      onChange={(e) => {
        dispatch({
          type: 'updateBlock',
          blockId: block.id,
          newContent: e.target.value,
        })
      }}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && block.texts.content === '') {
          e.preventDefault()
          dispatch({
            type: 'deleteBlock',
            blockId: block.id,
          })
          const prevInput =
            block.order > 0 ? blockRefs.current[block.order - 1] : blockRefs.current[1]
          if (prevInput) {
            prevInput.focus()
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (block.order > 0) {
            const prevInput = blockRefs.current[block.order - 1]
            if (prevInput) {
              prevInput.focus()
            }
          } else if (block.order === 0) {
            titleRef.current?.focus()
          }
        } else if (e.key === 'ArrowDown' && block.order < rowLength - 1) {
          e.preventDefault()
          const nextInput = blockRefs.current[block.order + 1]
          if (nextInput) {
            nextInput.focus()
          }
        } else if (e.key === 'Enter') {
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
          })
          setTimeout(() => {
            const nextInput = blockRefs.current[block.order + 1]
            if (nextInput) {
              nextInput.focus()
            }
          }, 0)
        }
      }}
    />
  )
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
