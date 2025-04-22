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
        .from('page')
        .select('*')
        .filter('deleted_at', 'is', null)
      if (error) {
        console.error(error)
      } else {
        setPages(
          data
            .map((data) => ({
              id: data.id,
              title: data.title,
              order: data.order,
              deletedAt: data.deleted_at,
            }))
            .sort((a, b) => a.order - b.order),
        )
      }
      setIsLoading(false)
    }

    void fetchPages()

    // リアルタイムに更新
    const channel = supabase
      .channel('page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newPage: Page = {
            id: payload.new.id,
            title: payload.new.title,
            order: payload.new.order,
            deletedAt: payload.new.deleted_at ?? null,
          }
          setPages((prev) => [...prev, newPage])
        } else if (payload.eventType == 'UPDATE') {
          const newPage: Page = {
            id: payload.new.id,
            title: payload.new.title,
            order: payload.new.order,
            deletedAt: payload.new.deleted_at ?? null,
          }
          setPages((prev) =>
            prev
              .map((page) => (page.id === newPage.id ? newPage : page))
              .filter((page) => page.deletedAt == null),
          )
        }
      })
      .subscribe()

    // クリーンアップ
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const handleAddPage = useCallback(async () => {
    const defaultBlockType = 'Text'
    const newPage: PageWithBlocks = {
      id: v4(),
      title: '',
      order: pages.length + 1,
      deletedAt: null,
      block: [
        {
          id: v4(),
          blockType: defaultBlockType,
          order: 0,
          indentIndex: 0,
          message: '',
        },
        {
          id: v4(),
          blockType: defaultBlockType,
          order: 1,
          indentIndex: 0,
          message: '',
        },
        {
          id: v4(),
          blockType: defaultBlockType,
          order: 2,
          indentIndex: 0,
          message: '',
        },
      ],
    }
    await supabase
      .from('page')
      .insert([{ id: newPage.id, title: newPage.title, order: newPage.order }])
    await supabase.from('block').insert(
      newPage.block.map((block) => ({
        id: block.id,
        block_type: block.blockType,
        message: block.message,
        indent_index: block.indentIndex,
        order: block.order,
        page_id: newPage.id,
      })),
    )
    router.push(`/${newPage.id}`)
  }, [supabase, router, pages.length])

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
          w={isOpenSidebar ? '88vw' : '100vw'}
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
