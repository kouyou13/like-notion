import { Box, HStack, Text, Button, Menu, Portal } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { useCallback } from 'react'
import { FaRegFileAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { GrAdd } from 'react-icons/gr'
import { ImList2, ImListNumbered, ImQuotesLeft } from 'react-icons/im'
import { LuListChecks, LuListCollapse } from 'react-icons/lu'
import { RiH1, RiH2, RiH3, RiTBoxLine } from 'react-icons/ri'
import { RxText, RxTable, RxMinus } from 'react-icons/rx'

import type { Block, BlockType } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type AddBlockMenuProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  setIsOpenBlockSettingIndex: React.Dispatch<React.SetStateAction<number | null>>
  blockRefs: React.RefObject<(HTMLTextAreaElement | null)[]>
}
const AddBlockMenuComponent = ({
  block,
  dispatch,
  setIsOpenBlockSettingIndex,
  blockRefs,
}: AddBlockMenuProps) => {
  const handleSelectBlockType = useCallback(
    (selectedBlockType: BlockType) => {
      dispatch({
        type: 'updateBlock',
        blockId: block.id,
        newContent: block.texts.content,
        blockType: selectedBlockType,
      })
      blockRefs.current[block.order]?.focus()
    },
    [block, dispatch, blockRefs],
  )
  return (
    <Menu.Root
      positioning={{ placement: 'bottom-start' }}
      onOpenChange={(isOpen) => {
        if (isOpen.open) {
          if (block.texts.content !== '') {
            dispatch({
              type: 'addBlock',
              order: block.order + 1,
            })
            setIsOpenBlockSettingIndex(block.order + 1)
          } else {
            setIsOpenBlockSettingIndex(block.order)
          }
        } else {
          setIsOpenBlockSettingIndex(null)
        }
      }}
    >
      <Menu.Trigger asChild>
        <Button variant="ghost" size="2xs" p={1} _hover={{ bgColor: 'gray.100' }} borderRadius="md">
          <Tooltip
            label={
              <Box textAlign="center" fontSize="xs" py={1} px={2} alignContent="center">
                <HStack justify="center" align="center" gap={0}>
                  クリックして<Text color="gray">下に追加</Text>
                </HStack>
                <HStack gap={0}>
                  Opt+クリック/Alt+クリックで<Text color="gray">上に追加</Text>
                </HStack>
              </Box>
            }
            bgColor="black"
            color="white"
            borderRadius={5}
            borderColor="black"
          >
            <GrAdd color="gray" size={16} />
          </Tooltip>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content w={300}>
            <Text fontSize="xs" color="gray.600" p={1}>
              基本
            </Text>
            <Menu.Item
              value="Text"
              onClick={() => {
                handleSelectBlockType('Text')
              }}
            >
              <HStack>
                <RxText color="gray" size={16} />
                <Text fontSize="sm" color="gray.700">
                  テキスト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="H1"
              onClick={() => {
                handleSelectBlockType('H1')
              }}
            >
              <HStack>
                <RiH1 color="gray" size={17} />
                <Text fontSize="sm" color="gray.700">
                  見出し1
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="H2"
              onClick={() => {
                handleSelectBlockType('H2')
              }}
            >
              <HStack>
                <RiH2 color="gray" size={17} />
                <Text fontSize="sm" color="gray.700">
                  見出し2
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="H3"
              onClick={() => {
                handleSelectBlockType('H3')
              }}
            >
              <HStack>
                <RiH3 color="gray" size={17} />
                <Text fontSize="sm" color="gray.700">
                  見出し3
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="List"
              onClick={() => {
                handleSelectBlockType('List')
              }}
            >
              <HStack>
                <ImList2 color="gray" size={13} />
                <Text fontSize="sm" color="gray.700">
                  箇条書きリスト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="ListNumbers"
              onClick={() => {
                handleSelectBlockType('ListNumbers')
              }}
            >
              <HStack>
                <ImListNumbered color="gray" size={13} />
                <Text fontSize="sm" color="gray.700">
                  番号付きリスト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="ToDoList"
              onClick={() => {
                handleSelectBlockType('ToDoList')
              }}
            >
              <HStack>
                <LuListChecks color="gray" size={15} />
                <Text fontSize="sm" color="gray.700">
                  ToDoリスト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="ToggleList"
              onClick={() => {
                handleSelectBlockType('ToggleList')
              }}
            >
              <HStack>
                <LuListCollapse color="gray" size={15} />
                <Text fontSize="sm" color="gray.700">
                  トグルリスト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="Page"
              onClick={() => {
                handleSelectBlockType('Page')
              }}
            >
              <HStack>
                <FaRegFileAlt color="gray" size={15} />
                <Text fontSize="sm" color="gray.700">
                  ページ
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="Callout"
              onClick={() => {
                handleSelectBlockType('Callout')
              }}
            >
              <HStack>
                <RiTBoxLine color="gray" size={16} />
                <Text fontSize="sm" color="gray.700">
                  コールアウト
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="Citing"
              onClick={() => {
                handleSelectBlockType('Citing')
              }}
            >
              <HStack>
                <ImQuotesLeft color="gray" size={13} />
                <Text fontSize="sm" color="gray.700">
                  引用
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="Table"
              onClick={() => {
                handleSelectBlockType('Table')
              }}
            >
              <HStack>
                <RxTable color="gray" size={15} />
                <Text fontSize="sm" color="gray.700">
                  テーブル
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="SeparatorLine"
              onClick={() => {
                handleSelectBlockType('SeparatorLine')
              }}
            >
              <HStack>
                <RxMinus color="gray" size={17} />
                <Text fontSize="sm" color="gray.700">
                  区切り線
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item
              value="PageLink"
              onClick={() => {
                handleSelectBlockType('PageLink')
              }}
            >
              <HStack>
                <FaExternalLinkAlt color="gray" size={15} />
                <Text fontSize="sm" color="gray.700">
                  ページリンク
                </Text>
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
const AddBlockMenu = React.memo(AddBlockMenuComponent)
export default AddBlockMenu
