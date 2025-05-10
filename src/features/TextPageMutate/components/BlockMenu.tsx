import { Box, HStack, Text, Menu, Portal, Flex, Button } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React from 'react'
import { GrDrag } from 'react-icons/gr'
import { RiDeleteBinLine } from 'react-icons/ri'

import type { Block } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type BlockMenuProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
}
const BlockMenuComponent = ({ block, dispatch }: BlockMenuProps) => {
  return (
    <Menu.Root positioning={{ placement: 'left' }}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="2xs" p={0} _hover={{ bgColor: 'gray.100' }}>
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" py={1} px={0} alignContent="center">
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
        </Button>
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
  )
}
const BlockMenu = React.memo(BlockMenuComponent)
export default BlockMenu
