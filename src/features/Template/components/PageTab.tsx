import { HStack, Text, Spacer, Menu, Portal, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { GrMore, GrAdd } from 'react-icons/gr'
import { RiDeleteBinLine } from 'react-icons/ri'

import useUser from '@/common/useUser'

import { infoToast } from '../../../common/toast'
import { createSupabaseClient } from '../../../lib/supabase'
import type { Page } from '../../../types'

type PageTabProps = {
  pageId: string
  page: Page
}
const PageTabComponent = ({ pageId, page }: PageTabProps) => {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [isHover, setIsHover] = useState(false)
  const user = useUser()

  const handleDeletePage = useCallback(async () => {
    try {
      const { error: deleteError } = await supabase
        .from('page')
        .update({ deleted_at: `{${new Date().toISOString()}}` })
        .eq('id', page.id)
      if (deleteError) {
        console.error(deleteError)
      }
      const { data: remainingPages, error: fetchError } = await supabase
        .from('page')
        .select('id, order')
        .is('deleted_at', null)
        .order('order', { ascending: true })
      if (fetchError) {
        console.error(fetchError)
        return
      }

      const updatedPages = remainingPages.map((page, index) => ({
        id: page.id,
        order: index,
        user_id: user?.id ?? '',
      }))

      const { error: updateError } = await supabase.from('page').upsert(updatedPages, {
        onConflict: 'id',
      })

      if (updateError) {
        console.error(updateError)
      }
      infoToast('ゴミ箱に移動しました')
      router.push(`/home`)
    } catch (err) {
      console.error('ページ削除中にエラーが発生しました:', err)
    }
  }, [supabase, page.id, router, user?.id])
  return (
    <HStack
      gap={1}
      borderRadius="md"
      px={2}
      py={1}
      my={1}
      bgColor={pageId === page.id ? 'gray.200' : undefined}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
      _hover={{ bgColor: 'gray.200' }}
    >
      <FaRegFileAlt size={16} color="gray" />
      <HStack gap={0} w="10.2vw" cursor="pointer">
        <Text
          color="black"
          fontSize="sm"
          ml={2}
          _hover={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none', outline: 'none' }}
          textDecoration="none"
          onClick={() => {
            router.push(`/${page.id}`)
          }}
          h={6}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {page.title === '' ? '新規ページ' : page.title}
        </Text>
        <Spacer
          onClick={() => {
            router.push(`/${page.id}`)
          }}
        />
        {isHover && (
          <>
            <Menu.Root positioning={{ placement: 'right-start' }}>
              <Menu.Trigger asChild>
                <Button
                  borderRadius="md"
                  p={1}
                  _hover={{ bgColor: 'gray.300' }}
                  variant="ghost"
                  size="2xs"
                >
                  <GrMore color="gray" size={13} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="Trash" onClick={handleDeletePage}>
                      <HStack _hover={{ color: 'red' }} color="gray.700" w="100%">
                        <RiDeleteBinLine size={18} />
                        <Text fontSize="sm">ゴミ箱に移動</Text>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Button
              borderRadius="md"
              p={1}
              _hover={{ bgColor: 'gray.300' }}
              variant="ghost"
              size="2xs"
            >
              <GrAdd color="gray" size={13} />
            </Button>
          </>
        )}
      </HStack>
    </HStack>
  )
}
const PageTab = React.memo(PageTabComponent)
export default PageTab
