import { HStack, Text, Spacer, Box } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { GrMore, GrAdd } from 'react-icons/gr'

import type { Page } from '../../../types'

type PageTabProps = {
  page: Page
}
const PageTabComponent = ({ page }: PageTabProps) => {
  const router = useRouter()
  const [isHover, setIsHover] = useState(false)
  return (
    <HStack
      gap={1}
      borderRadius="md"
      px={2}
      py={1}
      _hover={{ bgColor: 'gray.200' }}
      onClick={() => {
        router.push(`/${page.id}`)
      }}
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
      >
        {page.title}
      </Text>
      <Spacer />
      {isHover && (
        <>
          <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
            <GrMore color="gray" size={13} />
          </Box>
          <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
            <GrAdd color="gray" size={13} />
          </Box>
        </>
      )}
    </HStack>
  )
}
const PageTab = React.memo(PageTabComponent)
export default PageTab
