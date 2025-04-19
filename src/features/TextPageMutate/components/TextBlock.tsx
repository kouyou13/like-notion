import { Input } from '@chakra-ui/react'
import React, { useMemo } from 'react'

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
  const fontWeight = useMemo(() => {
    if (block.blockType === 'H1' || block.blockType === 'H2' || block.blockType === 'H3') {
      return 'bold'
    }
    return undefined
  }, [block.blockType])

  const placeholder = useMemo(() => {
    switch (block.blockType) {
      case 'H1':
        return '見出し1'
      case 'H2':
        return '見出し2'
      case 'H3':
        return '見出し3'
    }
  }, [block.blockType])

  const fontSize = useMemo(() => {
    switch (block.blockType) {
      case 'Text':
        return 16
      case 'H1':
        return 32
      case 'H2':
        return 24
      case 'H3':
        return 20
    }
  }, [block.blockType])

  const height = useMemo(() => {
    switch (block.blockType) {
      case 'Text':
        return 8
      case 'H1':
        return 30
      case 'H2':
        return 30
      case 'H3':
        return 30
    }
  }, [block.blockType])

  return (
    <Input
      ref={(el) => {
        blockRefs.current[block.order] = el
      }}
      fontWeight={fontWeight}
      onBlur={(e) => {
        if (block.blockType === 'Text') {
          e.target.placeholder = ''
        }
      }}
      onFocus={(e) => {
        if (block.blockType === 'Text') {
          e.target.placeholder = '入力して、AIはスペースキーを、コマンドは半角の「/」を押す...'
        }
      }}
      placeholder={placeholder}
      value={block.texts.content}
      h={height}
      fontSize={fontSize}
      border="none"
      outline="none"
      p={0}
      w={650}
      mr={50}
      onChange={(e) => {
        dispatch({
          type: 'updateBlock',
          blockId: block.id,
          newContent: e.target.value,
          blockType: block.blockType,
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
