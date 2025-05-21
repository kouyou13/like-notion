'use client'

import { Button, HStack, Box, Heading, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const App = () => {
  const router = useRouter()
  return (
    <Flex justifyContent="center" w="100vw" h="100vh" mt="30vh">
      <Box>
        <Box py={5} textAlign="left">
          <Heading>Think it. Make it.</Heading>
          <Heading color="gray">Notionアカウントにログイン</Heading>
        </Box>
        <HStack>
          <Button
            onClick={() => {
              router.push('/login')
            }}
          >
            ログイン
          </Button>
          <Button
            onClick={() => {
              router.push('/logon')
            }}
          >
            ログオン
          </Button>
        </HStack>
      </Box>
    </Flex>
  )
}
export default App
