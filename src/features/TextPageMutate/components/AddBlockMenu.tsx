import { Box, HStack, Text, Button, Menu, Portal } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/tooltip'
import { Editor } from '@tiptap/core'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { FaRegFileAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { GrAdd } from 'react-icons/gr'
import { ImList2, ImListNumbered, ImQuotesLeft } from 'react-icons/im'
import { LuListChecks, LuListCollapse } from 'react-icons/lu'
import { RiH1, RiH2, RiH3, RiTBoxLine } from 'react-icons/ri'
import { RxText, RxTable, RxMinus } from 'react-icons/rx'
import { v4 } from 'uuid'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Block, BlockType } from '../../../types'
import type { Action } from '../utils/pageDispatch'

type AddBlockMenuProps = {
  block: Block
  dispatch: React.ActionDispatch<[action: Action]>
  openBlockSettingIndex: number | null
  setIsOpenBlockSettingIndex: React.Dispatch<React.SetStateAction<number | null>>
  blockRefs: React.RefObject<(Editor | null)[]>
}
const AddBlockMenuComponent = ({
  block,
  dispatch,
  openBlockSettingIndex,
  setIsOpenBlockSettingIndex,
  blockRefs,
}: AddBlockMenuProps) => {
  const supabase = createSupabaseClient()
  const router = useRouter()

  const handleSelectBlockType = useCallback(
    async (selectedBlockType: BlockType) => {
      if (selectedBlockType !== 'Page') {
        dispatch({
          type: 'updateBlockType',
          blockId: block.id,
          blockType: selectedBlockType,
        })
        setTimeout(() => {
          blockRefs.current[block.order]?.commands.focus()
        })
      } else {
        await supabase
          .from('block')
          .update({
            block_type: 'Page',
          })
          .eq('id', block.id)
        const newPageId = v4()
        await supabase.from('page').insert({
          id: newPageId,
          title: '',
          order: -1,
          parent_block_id: block.id,
        })
        await supabase.from('block').insert({
          id: v4(),
          block_type: 'Text',
          message: '',
          order: 0,
          indent_index: 0,
          page_id: newPageId,
        })
        router.push(`/${newPageId}`)
      }
    },
    [block, dispatch, blockRefs, supabase, router],
  )
  return (
    <Menu.Root
      positioning={{ placement: 'bottom-start' }}
      onOpenChange={(isOpen) => {
        if (isOpen.open) {
          if (block.message !== '' || block.blockType === 'SeparatorLine') {
            dispatch({
              type: 'addBlock',
              order: block.order + 1,
              blockType: 'Text',
              indentIndex: block.indentIndex,
            })
            setIsOpenBlockSettingIndex(block.order + 1)
          } else {
            setIsOpenBlockSettingIndex(block.order)
          }
        } else {
          setIsOpenBlockSettingIndex(null)
        }
      }}
      open={openBlockSettingIndex === block.order}
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
              onClick={async () => {
                await handleSelectBlockType('Text')
              }}
            >
              <RxText color="gray" size={16} />
              <Text fontSize="sm" color="gray.700">
                テキスト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="H1"
              onClick={async () => {
                await handleSelectBlockType('H1')
              }}
            >
              <RiH1 color="gray" size={17} />
              <Text fontSize="sm" color="gray.700">
                見出し1
              </Text>
            </Menu.Item>
            <Menu.Item
              value="H2"
              onClick={async () => {
                await handleSelectBlockType('H2')
              }}
            >
              <RiH2 color="gray" size={17} />
              <Text fontSize="sm" color="gray.700">
                見出し2
              </Text>
            </Menu.Item>
            <Menu.Item
              value="H3"
              onClick={async () => {
                await handleSelectBlockType('H3')
              }}
            >
              <RiH3 color="gray" size={17} />
              <Text fontSize="sm" color="gray.700">
                見出し3
              </Text>
            </Menu.Item>
            <Menu.Item
              value="List"
              onClick={async () => {
                await handleSelectBlockType('List')
              }}
            >
              <ImList2 color="gray" size={13} />
              <Text fontSize="sm" color="gray.700">
                箇条書きリスト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="ListNumbers"
              onClick={async () => {
                await handleSelectBlockType('ListNumbers')
              }}
            >
              <ImListNumbered color="gray" size={13} />
              <Text fontSize="sm" color="gray.700">
                番号付きリスト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="ToDoList"
              onClick={async () => {
                await handleSelectBlockType('ToDoList')
              }}
            >
              <LuListChecks color="gray" size={15} />
              <Text fontSize="sm" color="gray.700">
                ToDoリスト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="ToggleList"
              onClick={async () => {
                await handleSelectBlockType('ToggleList')
              }}
            >
              <LuListCollapse color="gray" size={15} />
              <Text fontSize="sm" color="gray.700">
                トグルリスト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="Page"
              onClick={async () => {
                await handleSelectBlockType('Page')
              }}
            >
              <FaRegFileAlt color="gray" size={15} />
              <Text fontSize="sm" color="gray.700">
                ページ
              </Text>
            </Menu.Item>
            <Menu.Item
              value="Callout"
              onClick={async () => {
                await handleSelectBlockType('Callout')
              }}
            >
              <RiTBoxLine color="gray" size={16} />
              <Text fontSize="sm" color="gray.700">
                コールアウト
              </Text>
            </Menu.Item>
            <Menu.Item
              value="Citing"
              onClick={async () => {
                await handleSelectBlockType('Citing')
              }}
            >
              <ImQuotesLeft color="gray" size={13} />
              <Text fontSize="sm" color="gray.700">
                引用
              </Text>
            </Menu.Item>
            <Menu.Item
              value="Table"
              onClick={async () => {
                await handleSelectBlockType('Table')
              }}
            >
              <RxTable color="gray" size={15} />
              <Text fontSize="sm" color="gray.700">
                テーブル
              </Text>
            </Menu.Item>
            <Menu.Item
              value="SeparatorLine"
              onClick={async () => {
                await handleSelectBlockType('SeparatorLine')
              }}
            >
              <RxMinus color="gray" size={17} />
              <Text fontSize="sm" color="gray.700">
                区切り線
              </Text>
            </Menu.Item>
            <Menu.Item
              value="PageLink"
              onClick={async () => {
                await handleSelectBlockType('PageLink')
              }}
              ml={1}
            >
              <FaExternalLinkAlt color="gray" size={13} />
              <Text fontSize="sm" color="gray.700">
                ページリンク
              </Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
const AddBlockMenu = React.memo(AddBlockMenuComponent)
export default AddBlockMenu
