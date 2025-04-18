import { Box, HStack, Text } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { GrDrag } from 'react-icons/gr'

import AddBlockMenu from './AddBlockMenu'
import TextBlock from './TextBlock'
import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type BlockRowProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  hoverRowIndex: number | null
  setHoverRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  grabbedRowIndex: number | null
  setGrabbedRowIndex: React.Dispatch<React.SetStateAction<number | null>>
  isOpenBlockSettingIndex: number | null
  setIsOpenBlockSettingIndex: React.Dispatch<React.SetStateAction<number | null>>
  titleRef: React.RefObject<HTMLInputElement | null>
  blockRefs: React.RefObject<(HTMLInputElement | null)[]>
  rowLength: number
}
const BlockRowComponent = ({
  block,
  dispatch,
  hoverRowIndex,
  setHoverRowIndex,
  grabbedRowIndex,
  setGrabbedRowIndex,
  isOpenBlockSettingIndex,
  setIsOpenBlockSettingIndex,
  titleRef,
  blockRefs,
  rowLength,
}: BlockRowProps) => {
  return (
    <HStack
      gap={0}
      onMouseEnter={() => {
        if (isOpenBlockSettingIndex == null) {
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
      borderBottom={
        grabbedRowIndex != null &&
        grabbedRowIndex !== hoverRowIndex &&
        hoverRowIndex === block.order
          ? '4px solid #e4edfa'
          : 'none'
      }
    >
      {hoverRowIndex === block.order || isOpenBlockSettingIndex === block.order ? (
        <HStack w={50} gap={1}>
          <AddBlockMenu
            block={block}
            dispatch={dispatch}
            setIsOpenBlockSettingIndex={setIsOpenBlockSettingIndex}
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
        <Box w={50} />
      )}
      {block.blockType === 'Text' ||
      block.blockType === 'H1' ||
      block.blockType === 'H2' ||
      block.blockType === 'H3' ? (
        <TextBlock
          block={block}
          dispatch={dispatch}
          titleRef={titleRef}
          blockRefs={blockRefs}
          rowLength={rowLength}
        />
      ) : (
        <></>
      )}
    </HStack>
  )
}
const BlockRow = React.memo(BlockRowComponent)
export default BlockRow
