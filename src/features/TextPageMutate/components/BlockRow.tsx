import { Box, HStack, Text, Separator } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { useMemo } from 'react'
import { GrDrag } from 'react-icons/gr'

import AddBlockMenu from './AddBlockMenu'
import CallbackBlock from './CallbackBlock'
import CitingBlock from './CitingBlock'
import ListBlock from './ListBlock'
import PageBlock from './PageBlock'
import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type BlockTypeProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
  listNumber: number
}
const BlockTypeComponent = ({
  block,
  dispatch,
  titleRef,
  blockRefs,
  rowLength,
  listNumber,
}: BlockTypeProps) => {
  switch (block.blockType) {
    case 'Text':
    case 'H1':
    case 'H2':
    case 'H3':
      return (
        <TextBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
        />
      )
    case 'List':
    case 'ListNumbers':
    case 'ToDoList':
    case 'ToggleList':
      return (
        <ListBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
          listNumber={listNumber}
        />
      )
    case 'SeparatorLine':
      return (
        <Box w="100%" py={3}>
          <Separator color="black" />
        </Box>
      )
    case 'Citing':
      return (
        <CitingBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
        />
      )
    case 'Callout':
      return (
        <CallbackBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
        />
      )
    case 'Page':
      return <PageBlock block={block} />
  }
}

type BlockRowProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  grabbedRowIndex: number | null
  setGrabbedRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  openBlockSettingIndex: number | null
  setOpenBlockSettingIndex: React.Dispatch<React.SetStateAction<number | null>>
  titleRef: React.RefObject<HTMLTextAreaElement | null>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
  rowLength: number
  listNumber: number
}
const BlockRowComponent = ({
  block,
  dispatch,
  hoverRowIndex,
  setHoverRowIndex,
  grabbedRowIndex,
  setGrabbedRowIndex,
  openBlockSettingIndex,
  setOpenBlockSettingIndex,
  titleRef,
  blockRefs,
  rowLength,
  listNumber,
}: BlockRowProps) => {
  const mt = useMemo(() => {
    switch (block.blockType) {
      case 'Text':
        return 0
      case 'H1':
        return 9
      case 'H2':
        return 7
      case 'H3':
        return 5
    }
  }, [block.blockType])

  return (
    <HStack
      gap={0}
      mt={mt}
      pl={`${String(block.indentIndex * 1.5)}vw`}
      w="39vw"
      onMouseEnter={() => {
        if (openBlockSettingIndex == null) {
          setHoverRowIndex(block.order)
        }
      }}
      onMouseLeave={() => {
        setHoverRowIndex(null)
        setGrabbedRowIndex(null)
      }}
      onDragStart={() => {
        setGrabbedRowIndex(block.order)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (grabbedRowIndex !== null) {
          setHoverRowIndex(block.order)
        }
      }}
      onDrop={() => {
        if (grabbedRowIndex !== null && grabbedRowIndex !== block.order) {
          dispatch({
            type: 'moveBlock',
            fromIndex: grabbedRowIndex,
            toIndex: block.order,
          })
          setGrabbedRowIndex(null)
        }
        setHoverRowIndex(null)
      }}
      onKeyDown={(e) => {
        if (block.blockType !== 'Callout') {
          if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault()
            dispatch({
              type: 'addIndent',
              blockId: block.id,
            })
          } else if (
            (e.key === 'Tab' && e.shiftKey) ||
            (e.key === 'Backspace' && block.message === '')
          ) {
            e.preventDefault()
            dispatch({
              type: 'subIndent',
              blockId: block.id,
            })
          }
        }
      }}
    >
      {hoverRowIndex === block.order || openBlockSettingIndex === block.order ? (
        <HStack w="2.5vw" gap={0}>
          <AddBlockMenu
            block={block}
            dispatch={dispatch}
            openBlockSettingIndex={openBlockSettingIndex}
            setIsOpenBlockSettingIndex={setOpenBlockSettingIndex}
            blockRefs={blockRefs}
          />
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" py={1} px={2} alignContent="center">
                <HStack justify="center" align="center" gap={0}>
                  ドラッグして<Text color="gray">移動する</Text>
                </HStack>
                <HStack gap={0}>
                  クリックして<Text color="gray">メニューを開く</Text>
                </HStack>
              </Box>
            }
            bgColor="black"
            color="white"
            borderRadius={5}
            borderColor="black"
          >
            <Box
              _hover={{ bgColor: 'gray.100' }}
              py={1}
              borderRadius="md"
              cursor="grab"
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = 'grabbing'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab'
              }}
              draggable
            >
              <GrDrag color="gray" size={16} />
            </Box>
          </Tooltip>
        </HStack>
      ) : (
        <Box w="2.5vw" />
      )}
      <HStack
        w="36.5vw"
        borderBottom={
          grabbedRowIndex != null &&
          grabbedRowIndex !== hoverRowIndex &&
          hoverRowIndex === block.order
            ? '4px solid #e4edfa'
            : 'none'
        }
      >
        <BlockTypeComponent
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
          listNumber={listNumber}
        />
      </HStack>
    </HStack>
  )
}
const BlockRow = React.memo(BlockRowComponent)
export default BlockRow
