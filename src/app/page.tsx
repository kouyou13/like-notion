'use client'

import { Flex, Button, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const App = () => {
  const router = useRouter()
  return (
    <Flex justifyContent="center" w="100vw" h="100vh">
      <HStack>
        <Button
          onClick={() => {
            router.push('/login')
          }}
        >
          ログイン
        </Button>
        <Button>ログオン</Button>
      </HStack>
    </Flex>
  )
}
export default App
