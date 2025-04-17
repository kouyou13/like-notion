import { HStack, Text, Spacer, Menu, Portal, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { GrMore, GrAdd } from 'react-icons/gr'
import { RiDeleteBinLine } from 'react-icons/ri'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Page } from '../../../types'

type PageTabProps = {
  page: Page
}
const PageTabComponent = ({ page }: PageTabProps) => {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const [isHover, setIsHover] = useState(false)

  const handleDeletePage = useCallback(async () => {
    try {
      const { error: deleteError } = await supabase
        .from('pages')
        .update({ is_deleted: `{${new Date().toISOString()}}` })
        .eq('id', page.id)
      if (deleteError) {
        console.error(deleteError)
      }
      const { data: remainingPages, error: fetchError } = await supabase
        .from('pages')
        .select('id, order')
        .is('is_deleted', null)
        .order('order', { ascending: true })
      if (fetchError) {
        console.error(fetchError)
        return
      }

      const updatedPages = remainingPages.map((page, index) => ({
        id: page.id,
        order: index,
      }))

      const { error: updateError } = await supabase.from('pages').upsert(updatedPages, {
        onConflict: 'id',
      })

      if (updateError) {
        console.error(updateError)
      }
    } catch (err) {
      console.error('ページ削除中にエラーが発生しました:', err)
    }
  }, [supabase, page.id])
  return (
    <HStack
      gap={1}
      borderRadius="md"
      px={2}
      py={1}
      _hover={{ bgColor: 'gray.200' }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
    >
      <FaRegFileAlt size={16} color="gray" />
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
      >
        {page.title}
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
                <Menu.Content w={300}>
                  <Menu.Item value="Trash" onClick={handleDeletePage}>
                    <HStack>
                      <RiDeleteBinLine color="gray" size={16} />
                      <Text fontSize="sm" color="gray.700" _hover={{ color: 'rgb(230, 32, 32)' }}>
                        ゴミ箱に移動
                      </Text>
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
  )
}
const PageTab = React.memo(PageTabComponent)
export default PageTab
