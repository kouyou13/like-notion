import { Box, HStack, Text, Button, Menu, Portal, Flex } from '@chakra-ui/react'
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

  const menuItems = [
    { value: 'Text', label: 'テキスト', icon: <RxText color="gray" size={16} /> },
    { value: 'H1', label: '見出し1', icon: <RiH1 color="gray" size={17} /> },
    { value: 'H2', label: '見出し2', icon: <RiH2 color="gray" size={17} /> },
    { value: 'H3', label: '見出し3', icon: <RiH3 color="gray" size={17} /> },
    { value: 'List', label: '箇条書きリスト', icon: <ImList2 color="gray" size={13} /> },
    {
      value: 'ListNumbers',
      label: '番号付きリスト',
      icon: <ImListNumbered color="gray" size={13} />,
    },
    { value: 'ToDoList', label: 'ToDoリスト', icon: <LuListChecks color="gray" size={15} /> },
    { value: 'ToggleList', label: 'トグルリスト', icon: <LuListCollapse color="gray" size={15} /> },
    { value: 'Page', label: 'ページ', icon: <FaRegFileAlt color="gray" size={15} /> },
    { value: 'Callout', label: 'コールアウト', icon: <RiTBoxLine color="gray" size={16} /> },
    { value: 'Citing', label: '引用', icon: <ImQuotesLeft color="gray" size={11} /> },
    { value: 'Table', label: 'テーブル', icon: <RxTable color="gray" size={15} /> },
    { value: 'SeparatorLine', label: '区切り線', icon: <RxMinus color="gray" size={17} /> },
    {
      value: 'PageLink',
      label: 'ページリンク',
      icon: <FaExternalLinkAlt color="gray" size={13} />,
    },
  ]

  return (
    <Menu.Root
      positioning={{ placement: 'bottom-start' }}
      onOpenChange={(isOpen) => {
        if (isOpen.open) {
          if (block.message !== '<p></p>' || block.blockType === 'SeparatorLine') {
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
                  クリックして<Text color="gray.400">下に追加</Text>
                </HStack>
                <HStack gap={0}>
                  Opt+クリック/Alt+クリックで<Text color="gray.400">上に追加</Text>
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
            {menuItems.map((item) => (
              <Menu.Item
                key={item.value}
                value={item.value}
                onClick={async () => {
                  await handleSelectBlockType(item.value as BlockType)
                }}
              >
                <Flex w={5} justifyContent="center" alignItems="center">
                  {item.icon}
                </Flex>
                <Text fontSize="sm" color="gray.700">
                  {item.label}
                </Text>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
const AddBlockMenu = React.memo(AddBlockMenuComponent)
export default AddBlockMenu
