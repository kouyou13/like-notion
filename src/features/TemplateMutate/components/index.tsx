'use client'

import { Box, HStack, Spacer, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiOutlineDoubleLeft } from 'react-icons/ai'
import { FaRegFileAlt } from 'react-icons/fa'
import { GrHomeRounded, GrMore, GrAdd } from 'react-icons/gr'

import { useJsonStore } from '../../../stores/useJsonStore'
import TopBar from '../../TopBarMutate/components'

import { useRouter } from 'next/navigation'

type TemplateProps = {
  children: React.ReactNode
}

const Template = ({ children }: TemplateProps) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true)
  const { pages, addPage } = useJsonStore()
  const router = useRouter()
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
            {/* プライベート */}
            <HStack gap={1} borderRadius="md" p={1} _hover={{ bgColor: 'gray.200' }}>
              <Text fontSize="xs" color="gray.600">
                プライベート
              </Text>
              <Spacer />
              <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
                <GrMore color="gray" size={13} />
              </Box>
              <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }} onClick={addPage}>
                <GrAdd color="gray" size={13} />
              </Box>
            </HStack>
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
            <HStack gap={1} borderRadius="md" p={1} _hover={{ bgColor: 'gray.200' }}>
              <GrAdd size={16} color="gray" />
              <Text color="gray.800" fontSize="sm" ml={2} onClick={addPage}>
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
