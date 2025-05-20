import { HStack, Box, IconButton, Text, Spacer, Icon } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { GrAdd } from 'react-icons/gr'

import { createSupabaseClient } from '../../../lib/supabase'
import type { Page } from '../../../types'
import selectPage from '../hooks/selectPage'
import calcMinutesSinceEdited from '../utils/calcMinutesSinceEdited'

type TopBarProps = {
  isOpenSidebar: boolean
  setIsOpenSidebar: (isOpen: boolean) => void
}

const TopBarComponent = ({ isOpenSidebar, setIsOpenSidebar }: TopBarProps) => {
  const params = useParams()
  const pageId = (params as { pageId?: string }).pageId ?? ''
  const supabase = createSupabaseClient()
  const [page, setPage] = useState<Page | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const getPage = async () => {
      const currentPage = await selectPage(pageId)
      setPage(currentPage)
      setIsFavorite(!!currentPage?.favoritedAt)
    }
    void getPage()
  }, [pageId])

  const handleFavorite = useCallback(
    (isChecked: boolean) => {
      setIsFavorite(isChecked)
      const favorite = async () => {
        const { error } = await supabase
          .from('page')
          .update({ favorited_at: isChecked ? dayjs().format() : null })
          .eq('id', pageId)
        if (error) {
          console.error(error)
        }
      }
      void favorite()
    },
    [supabase, pageId],
  )
  return (
    <HStack h="3vh" bgColor="white" px={2} my="0.5vh" gap={1}>
      {!isOpenSidebar && (
        <Box
          bgColor="white"
          color="gray.500"
          borderRadius="md"
          p={1}
          onClick={() => {
            setIsOpenSidebar(true)
          }}
          _hover={{ bgColor: 'gray.200' }}
        >
          <AiOutlineDoubleRight size={19} />
        </Box>
      )}
      <IconButton variant="solid" size="2xs" bgColor="white" _hover={{ bgColor: 'gray.200' }}>
        <Icon size="md">
          <BsArrowLeft color="gray" />
        </Icon>
      </IconButton>
      <IconButton variant="solid" size="2xs" bgColor="white" _hover={{ bgColor: 'gray.200' }}>
        <Icon size="md">
          <BsArrowRight color="gray" />
        </Icon>
      </IconButton>
      <IconButton variant="solid" size="2xs" bgColor="white" _hover={{ bgColor: 'gray.200' }}>
        <Icon size="md">
          <GrAdd color="gray" />
        </Icon>
      </IconButton>
      {page && (
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" w="14vw" ml={1}>
          {page.title !== '' ? page.title : '新規ページ'}
        </Text>
      )}
      <Spacer />
      <Text color="gray" fontSize="sm">
        {calcMinutesSinceEdited(page ?? null)}
      </Text>
      {page && (
        <IconButton
          variant="solid"
          size="2xs"
          bgColor="white"
          _hover={{ bgColor: 'gray.200' }}
          onClick={() => {
            handleFavorite(!isFavorite)
          }}
        >
          <Icon size="sm">
            {isFavorite ? <FaStar color="orange" /> : <FaRegStar color="gray" />}
          </Icon>
        </IconButton>
      )}
    </HStack>
  )
}
const TopBar = React.memo(TopBarComponent)
export default TopBar
