import { HStack, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { FaRegFile } from 'react-icons/fa'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Block } from '../../../types'

type PageBlockProps = {
  block: Block
}
const PageBlockComponent = ({ block }: PageBlockProps) => {
  const supabase = createSupabaseClient()
  const router = useRouter()
  const [page, setPage] = useState<{ id: string; title: string } | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('page')
        .select('id, title')
        .eq('parent_block_id', block.id)
        .is('deleted_at', null)
        .single()
      if (error) {
        console.error(error)
      }
      setPage(() => {
        if (!data) {
          return null
        } else if (data.title === '') {
          return {
            id: data.id,
            title: '新規ページ',
          }
        }
        return {
          id: data.id,
          title: data.title,
        }
      })
    }
    void fetchData()
  }, [block.id, supabase])
  return (
    <HStack
      justify="left"
      gap={2}
      _hover={{ backgroundColor: 'gray.100' }}
      w="100%"
      p={1}
      borderRadius={3}
      cursor="pointer"
      onClick={() => {
        console.log(page)
        if (page) {
          router.push(`/${page.id}`)
        }
      }}
    >
      <Flex w="1vw" align="center" justify="center">
        <FaRegFile size={18} color="gray" />
      </Flex>
      <Text fontWeight="bold" fontSize={16} borderBottom="1px solid gray" h="1.4rem">
        {page?.title ?? '新規ページ'}
      </Text>
    </HStack>
  )
}
const PageBlock = React.memo(PageBlockComponent)
export default PageBlock
