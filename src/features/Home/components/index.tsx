import { Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'

import useUser from '@/common/useUser'

import type {} from '../../../types'

const HomeComponent = () => {
  const user = useUser()
  return (
    <Flex
      w="100%"
      h="80vh"
      justifyContent="center"
      alignItems="center"
      fontWeight="bold"
      fontSize={26}
      cursor="checkbox"
    >
      <HStack gap={0}>
        <Text>こんにちは、</Text>
        <Text px={2} py={0} borderRadius="md" _hover={{ bgColor: 'gray.100' }}>
          {user?.identity_data?.displayName}
        </Text>
        <Text>さん</Text>
      </HStack>
    </Flex>
  )
}
const Home = React.memo(HomeComponent)
export default Home
