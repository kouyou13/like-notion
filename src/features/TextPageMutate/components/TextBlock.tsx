import { Textarea } from '@chakra-ui/react'
import React, { useMemo, useCallback, useState } from 'react'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type TextBlockProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
}
const TextBlockComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
}: TextBlockProps) => {
  const [isComposing, setIsComposing] = useState(false)
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
        return '1rem'
      case 'H1':
        return '2.5rem'
      case 'H2':
        return 30
      case 'H3':
        return 30
    }
  }, [block.blockType])

  const lineHeight = useMemo(() => {
    switch (block.blockType) {
      case 'H1':
        return '2.5rem'
      case 'H2':
        return '2rem'
      case 'H3':
        return '1.8rem'
      default:
        return '1.5rem'
    }
  }, [block.blockType])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isComposing) {
        // IME入力中は何もしない
        return
      } else if (e.key === 'Backspace' && block.texts.content === '' && block.indentIndex === 0) {
        e.preventDefault()
        if (rowLength > 1) {
          dispatch({
            type: 'deleteBlock',
            blockId: block.id,
          })
          const prevInput =
            block.order > 0 ? blockRefs.current[block.order - 1] : blockRefs.current[1]
          if (prevInput) {
            prevInput.focus()
          }
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
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Shift + Enter でない時
        e.preventDefault()
        if (block.texts.content === '' && block.blockType !== 'Text') {
          dispatch({
            type: 'updateBlock',
            blockId: block.id,
            newContent: block.texts.content,
            blockType: 'Text',
            indentIndex: block.indentIndex,
          })
          setTimeout(() => {
            blockRefs.current[block.order]?.focus()
          })
        } else {
          dispatch({
            type: 'addBlock',
            order: block.order + 1,
            blockType: 'Text',
            indentIndex: block.indentIndex,
          })
          setTimeout(() => {
            const nextInput = blockRefs.current[block.order + 1]
            if (nextInput) {
              nextInput.focus()
            }
          }, 0)
        }
      } else if (e.key === 'Enter' && e.shiftKey) {
        // Shift + Enter の時Textarea 内で改行
        e.preventDefault()
        const newValue = block.texts.content + '\n'
        dispatch({
          type: 'updateBlock',
          blockId: block.id,
          newContent: newValue,
          blockType: block.blockType,
          indentIndex: block.indentIndex,
        })
      }
    },
    [block, blockRefs, dispatch, rowLength, titleRef, isComposing],
  )
  return (
    <Textarea
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
      lineHeight={lineHeight}
      border="none"
      outline="none"
      px={0}
      py={1}
      w={650}
      mr={50}
      rows={1}
      onCompositionStart={() => {
        setIsComposing(true)
      }}
      onCompositionEnd={() => {
        setIsComposing(false)
      }}
      onChange={(e) => {
        dispatch({
          type: 'updateBlock',
          blockId: block.id,
          newContent: e.target.value,
          blockType: block.blockType,
          indentIndex: block.indentIndex,
        })
      }}
      onKeyDown={handleKeyDown}
      autoresize
    />
  )
}
const TextBlock = React.memo(TextBlockComponent)
export default TextBlock
