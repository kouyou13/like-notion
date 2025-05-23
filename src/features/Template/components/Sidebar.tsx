import { Box, HStack, Spacer, Text, Skeleton } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { AiOutlineDoubleLeft } from 'react-icons/ai'
import { GrHomeRounded, GrMore, GrAdd } from 'react-icons/gr'

import PageTab from './PageTab'
import type { Page } from '../../../types'

type SidebarContentsProps = {
  setIsOpenSidebar: (isOpen: boolean) => void
  isLoading: boolean
  pages: Page[]
  favoritePages: Page[]
  handleAddPage: () => Promise<void>
}
const SidebarContents = ({
  setIsOpenSidebar,
  isLoading,
  pages,
  favoritePages,
  handleAddPage,
}: SidebarContentsProps) => {
  const router = useRouter()
  const pathnames = usePathname().split('/').slice(1)
  const pageId = pathnames[0]
  const [isHoverFavorite, setIsHoverFavorite] = useState(false)
  const [isHoverPrivate, setIsHoverPrivate] = useState(false)
  return (
    <>
      <Box w="13vw" bgColor="gray.100" minH="100vh" px={1} py={0}>
        <HStack mb={1} h="3vh" my="1vh">
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
              router.push('/home')
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
          {/* お気に入り */}
          {favoritePages.length > 0 && (
            <>
              <HStack
                gap={1}
                borderRadius="md"
                pl={1}
                pr={2}
                _hover={{ bgColor: 'gray.200' }}
                onMouseEnter={() => {
                  setIsHoverFavorite(true)
                }}
                onMouseLeave={() => {
                  setIsHoverFavorite(false)
                }}
              >
                <Text fontSize="xs" color="gray.600" py={1}>
                  お気に入り
                </Text>
                <Spacer />
                {isHoverFavorite && (
                  <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
                    <GrMore color="gray" size={13} />
                  </Box>
                )}
              </HStack>
              <Skeleton loading={isLoading}>
                {favoritePages.map((page) => (
                  <PageTab key={`favorite-${String(page.id)}`} pageId={pageId} page={page} />
                ))}
              </Skeleton>
            </>
          )}
          {/* プライベート */}
          <HStack
            gap={1}
            borderRadius="md"
            mt={5}
            pl={1}
            pr={2}
            _hover={{ bgColor: 'gray.200' }}
            onMouseEnter={() => {
              setIsHoverPrivate(true)
            }}
            onMouseLeave={() => {
              setIsHoverPrivate(false)
            }}
          >
            <Text fontSize="xs" color="gray.600" py={1}>
              プライベート
            </Text>
            <Spacer />
            {isHoverPrivate && (
              <>
                <Box borderRadius="md" p={1} _hover={{ bgColor: 'gray.300' }}>
                  <GrMore color="gray" size={13} />
                </Box>
                <Box
                  borderRadius="md"
                  p={1}
                  _hover={{ bgColor: 'gray.300' }}
                  onClick={handleAddPage}
                >
                  <GrAdd color="gray" size={13} />
                </Box>
              </>
            )}
          </HStack>
          <Skeleton loading={isLoading}>
            {pages.map((page) => (
              <PageTab key={`private-${String(page.id)}`} pageId={pageId} page={page} />
            ))}
          </Skeleton>
          {pages.length < 3 && (
            <HStack
              gap={1}
              borderRadius="md"
              px={2}
              py={1}
              _hover={{ bgColor: 'gray.200' }}
              cursor="pointer"
            >
              <GrAdd size={16} color="gray" />
              <Text color="gray.400" fontSize="sm" fontWeight="bold" ml={2} onClick={handleAddPage}>
                新規ページを追加
              </Text>
            </HStack>
          )}
        </Box>
      </Box>
    </>
  )
}

type SidebarProps = {
  isOpenSidebar: boolean
  setIsOpenSidebar: (isOpen: boolean) => void
  isLoading: boolean
  pages: Page[]
  favoritePages: Page[]
  handleAddPage: () => Promise<void>
}
const SidebarComponent = ({
  isOpenSidebar,
  setIsOpenSidebar,
  isLoading,
  pages,
  favoritePages,
  handleAddPage,
}: SidebarProps) => {
  const MotionBox = motion(Box)
  return (
    <AnimatePresence>
      {isOpenSidebar && (
        <MotionBox
          initial={{ transform: 'translateX(-100%)', opacity: 0 }}
          animate={{ transform: 'translateX(0%)', opacity: 1 }}
          exit={{ transform: 'translateX(-100%)', opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <SidebarContents
            setIsOpenSidebar={setIsOpenSidebar}
            isLoading={isLoading}
            pages={pages}
            favoritePages={favoritePages}
            handleAddPage={handleAddPage}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
const Sidebar = React.memo(SidebarComponent)
export default Sidebar
