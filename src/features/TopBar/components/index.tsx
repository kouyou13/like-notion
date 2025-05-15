import { HStack, Box, IconButton, Text, Spacer } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { GrAdd } from 'react-icons/gr'

import type { Page } from '../../../types'
import calcMinutesSinceEdited from '../utils/calcMinutesSinceEdited'

type TopBarProps = {
  isOpenSidebar: boolean
  setIsOpenSidebar: (isOpen: boolean) => void
  pages: Page[]
}

const TopBarComponent = ({ isOpenSidebar, setIsOpenSidebar, pages }: TopBarProps) => {
  const { pageId }: { pageId?: string } = useParams()
  const targetPage = useMemo(() => pages.find((page) => page.id === pageId), [pageId, pages])
  return (
    <HStack h="3vh" bgColor="white" px={2} my={1} gap={1}>
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
        <BsArrowLeft color="gray" />
      </IconButton>
      <IconButton variant="solid" size="2xs" bgColor="white" _hover={{ bgColor: 'gray.200' }}>
        <BsArrowRight color="gray" />
      </IconButton>
      <IconButton variant="solid" size="xs" bgColor="white" _hover={{ bgColor: 'gray.200' }}>
        <GrAdd color="gray" />
      </IconButton>
      {targetPage && (
        <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" w="14vw">
          {targetPage.title !== '' ? targetPage.title : '新規ページ'}
        </Text>
      )}
      <Spacer />
      <Text color="gray" fontSize="sm">
        {calcMinutesSinceEdited(targetPage)}
      </Text>
    </HStack>
  )
}
const TopBar = React.memo(TopBarComponent)
export default TopBar
