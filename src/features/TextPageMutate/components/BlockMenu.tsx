import { Box, HStack, Text, Menu, Portal, Flex } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { useState } from 'react'
import { GrDrag } from 'react-icons/gr'
import { RiDeleteBinLine } from 'react-icons/ri'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type BlockMenuProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
}
const BlockMenuComponent = ({ block, dispatch }: BlockMenuProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  return (
    <Box
      borderRadius="md"
      cursor="grab"
      draggable
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab'
      }}
      _hover={{ bgColor: 'gray.100' }}
      onClick={() => {
        setIsOpenMenu(true)
      }}
      px={1}
    >
      <Menu.Root
        positioning={{ placement: 'left' }}
        open={isOpenMenu}
        onOpenChange={(isOpen) => {
          setIsOpenMenu(isOpen.open)
        }}
      >
        <Menu.Trigger>
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" p={1} alignContent="center">
                <HStack justify="center" align="center" gap={0}>
                  ドラッグして<Text color="gray.400">移動する</Text>
                </HStack>
                <HStack gap={0}>
                  クリックして<Text color="gray.400">メニューを開く</Text>
                </HStack>
              </Box>
            }
            bgColor="black"
            color="white"
            borderRadius={5}
            borderColor="black"
            draggable
          >
            <GrDrag color="gray" size={16} />
          </Tooltip>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content w={200}>
              <Menu.Item
                value="delete"
                onClick={() => {
                  dispatch({
                    type: 'deleteBlock',
                    blockId: block.id,
                  })
                }}
              >
                <Flex w={5} justifyContent="center" alignItems="center">
                  <RiDeleteBinLine size={14} />
                </Flex>
                <Text fontSize="sm" color="gray.700">
                  削除
                </Text>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  )
}
const BlockMenu = React.memo(BlockMenuComponent)
export default BlockMenu
