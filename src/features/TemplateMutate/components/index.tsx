'use client'

import { Box, HStack, Spacer, Text, Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { AiOutlineDoubleLeft } from 'react-icons/ai'
import { FaRegFileAlt } from 'react-icons/fa'
import { GrHomeRounded, GrMore, GrAdd } from 'react-icons/gr'

import { createSupabaseClient } from '../../../lib/supabase'
import TopBar from '../../TopBarMutate/components'
import type { PageWithBlocks, Page } from '../types/index'
import { defaultPage } from '../utils/defaultProps'

type TemplateProps = {
  children: React.ReactNode
}

const Template = ({ children }: TemplateProps) => {
  const supabase = createSupabaseClient()

  const [isOpenSidebar, setIsOpenSidebar] = useState(true)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase.from('pages').select('id, title')
      if (error) {
        console.error(error)
      } else {
        setPages(data)
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
  }, [supabase])

  return (
    <Box w="100vw" h="100vh">
      <HStack gap={0}>
        <Box w="12vw" bgColor="gray.100" minH="100vh" p={2} hidden={!isOpenSidebar}>
          <HStack mb={1}>
            <Spacer />
            <Box
              bgColor="gray.100"
              color="gray.500"
              _hover={{ bgColor: 'gray.200' }}
              onClick={() => {
                setIsOpenSidebar(false)
              }}
              borderRadius="md"
            >
              <AiOutlineDoubleLeft size={21} />
            </Box>
          </HStack>
          <Box py={2} px={1}>
            {/* ホーム */}
            <HStack
              borderRadius="md"
              mb={6}
              p={1}
              _hover={{ bgColor: 'gray.200' }}
              onClick={() => {
                router.push('/')
              }}
            >
              <GrHomeRounded size={14} color="gray" />
              <Text
                color="gray.800"
                fontSize="sm"
                ml={1}
                _hover={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none', outline: 'none' }}
                textDecoration="none"
              >
                ホーム
              </Text>
            </HStack>
            {/* プライベート */}
            <HStack gap={1} borderRadius="md" p={1} _hover={{ bgColor: 'gray.200' }}>
              <Text fontSize="xs" color="gray.600">
                プライベート
              </Text>
              <Spacer />
              <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
                <GrMore color="gray" size={13} />
              </Box>
              <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }} onClick={handleAddPage}>
                <GrAdd color="gray" size={13} />
              </Box>
            </HStack>
            <Skeleton loading={isLoading}>
              {pages.map((page) => (
                <HStack
                  key={page.id}
                  gap={1}
                  borderRadius="md"
                  px={2}
                  py={1}
                  _hover={{ bgColor: 'gray.200' }}
                  onClick={() => {
                    router.push(`/${page.id}`)
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
                  >
                    {page.title}
                  </Text>
                </HStack>
              ))}
            </Skeleton>
            <HStack gap={1} borderRadius="md" p={1} _hover={{ bgColor: 'gray.200' }}>
              <GrAdd size={16} color="gray" />
              <Text color="gray.800" fontSize="sm" ml={2} onClick={handleAddPage}>
                新規ページを追加
              </Text>
            </HStack>
          </Box>
        </Box>
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
