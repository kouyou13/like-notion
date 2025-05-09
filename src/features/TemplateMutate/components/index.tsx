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
        .is('parent_block_id', null)
        .is('deleted_at', null)
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
              parentBlockId: data.parent_block_id,
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
          if (payload.new.parent_block_id == null) {
            const newPage: Page = {
              id: payload.new.id,
              title: payload.new.title,
              order: payload.new.order,
              deletedAt: payload.new.deleted_at ?? null,
              parentBlockId: payload.new.parent_block_id ?? null,
            }
            setPages((prev) => [...prev, newPage])
          }
        } else if (payload.eventType == 'UPDATE') {
          if (payload.new.parent_block_id == null) {
            const newPage: Page = {
              id: payload.new.id,
              title: payload.new.title,
              order: payload.new.order,
              deletedAt: payload.new.deleted_at ?? null,
              parentBlockId: payload.new.parent_block_id ?? null,
            }
            setPages((prev) =>
              prev
                .map((page) => (page.id === newPage.id ? newPage : page))
                .filter((page) => page.deletedAt == null && page.parentBlockId == null),
            )
          }
        }
      })
      .subscribe()

    // クリーンアップ
    return () => {
      void supabase.removeChannel(channel)
    }
    // eslint-disable-next-line
  }, [])

  const handleAddPage = useCallback(async () => {
    const newPage: PageWithBlocks = {
      id: v4(),
      title: '',
      order: pages.length + 1,
      deletedAt: null,
      parentBlockId: null,
      block: [
        {
          id: v4(),
          blockType: 'Text',
          order: 0,
          message: '',
          isChecked: false,
          indentIndex: 0,
        },
        {
          id: v4(),
          blockType: 'Text',
          order: 1,
          message: '',
          isChecked: false,
          indentIndex: 0,
        },
        {
          id: v4(),
          blockType: 'Text',
          order: 2,
          message: '',
          isChecked: false,
          indentIndex: 0,
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
        <Box justifyContent="start" w={isOpenSidebar ? '88vw' : '100vw'} h="100vh">
          <TopBar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
          {children}
        </Box>
      </HStack>
    </Box>
  )
}

export default Template
