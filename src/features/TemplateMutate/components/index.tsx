'use client'

import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { v4 } from 'uuid'

import SidebarComponent from './Sidebar'
import { createSupabaseClient } from '../../../lib/supabase'
import type { PageWithBlocks, Page } from '../../../types'
import TopBar from '../../TopBarMutate/components'

type TemplateProps = {
  children: React.ReactNode
}

const Template = ({ children }: TemplateProps) => {
  const supabase = createSupabaseClient()
  const router = useRouter()

  const [isOpenSidebar, setIsOpenSidebar] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, order')
        .filter('is_deleted', 'is', null)
      if (error) {
        console.error(error)
      } else {
        setPages(data.sort((a, b) => a.order - b.order))
      }
      setIsLoading(false)
    }

    void fetchPages()

    // リアルタイムに更新
    const channel = supabase
      .channel('pages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPages((prev) => [...prev, payload.new as Page])
        } else if (payload.eventType === 'UPDATE') {
          setPages((prev) =>
            prev.map((page) => (page.id === payload.new.id ? (payload.new as Page) : page)),
          )
        } else {
          setPages((prev) => prev.filter((page) => page.id !== payload.old.id))
        }
      })
      .subscribe()

    // クリーンアップ
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleAddPage = useCallback(async () => {
    const defaultPage: PageWithBlocks = {
      id: v4(),
      title: '',
      order: pages.length,
      pageBlocks: [
        {
          id: v4(),
          blockType: 'Text',
          order: 0,
          texts: {
            id: v4(),
            content: '',
          },
        },
        {
          id: v4(),
          blockType: 'Text',
          order: 1,
          texts: {
            id: v4(),
            content: '',
          },
        },
        {
          id: v4(),
          blockType: 'Text',
          order: 2,
          texts: {
            id: v4(),
            content: '',
          },
        },
      ],
    }
    const newPage: PageWithBlocks = defaultPage
    await supabase.from('pages').insert([{ id: newPage.id, title: newPage.title }])
    await supabase.from('page_blocks').insert(
      newPage.pageBlocks.map((block) => ({
        id: block.id,
        block_type: block.blockType,
        order: block.order,
        page_id: newPage.id,
      })),
    )
    await supabase.from('texts').insert(
      newPage.pageBlocks.map((block) => ({
        content: block.texts.content,
        page_block_id: block.id,
      })),
    )
    router.push(`/${newPage.id}`)
  }, [supabase, router, pages])

  return (
    <Box w="100vw" h="100vh">
      <HStack gap={0}>
        <SidebarComponent
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
          isLoading={isLoading}
          pages={pages}
          handleAddPage={handleAddPage}
        />
        <Box
          justifyContent="start"
          w={isOpenSidebar ? '85vw' : '100vw'}
          h="100vh"
          overflow="scroll"
        >
          <TopBar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
          {children}
        </Box>
      </HStack>
    </Box>
  )
}

export default Template
