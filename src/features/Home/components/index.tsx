import { Flex, HStack, Text, Popover, Portal, Input } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import useUser from '@/common/useUser'

import { createSupabaseClient } from '../../../lib/supabase'

const HomeComponent = () => {
  const supabase = createSupabaseClient()
  const user = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [debouncedUsername] = useDebounce(username, 1000)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('user_information')
        .select('*')
        .eq('user_id', user?.id ?? '')
        .single()
      if (error) {
        console.error(error)
        return
      }
      setUsername(String(data.name))
    }
    if (user) {
      void fetchUser()
    }
  }, [supabase, user])

  useEffect(() => {
    const updateUsername = async () => {
      const { error } = await supabase
        .from('user_information')
        .update({ name: debouncedUsername })
        .eq('user_id', user?.id ?? '')
      if (error) {
        console.error(error)
      }
    }
    if (user && debouncedUsername !== '') {
      void updateUsername()
    }
  }, [debouncedUsername, supabase, user])

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
        <Popover.Root
          open={isOpen}
          onOpenChange={(e) => {
            setIsOpen(e.open)
          }}
        >
          <Popover.Trigger>
            <Text
              px={2}
              py={0}
              borderRadius="md"
              _hover={{ bgColor: 'gray.100' }}
              onClick={() => {
                setIsOpen(true)
              }}
            >
              {username}
            </Text>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body p={3}>
                  <Text mb={2} fontWeight="bold" color="gray.400">
                    ニックネームを編集
                  </Text>
                  <Input
                    size="xs"
                    fontSize="md"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                    }}
                  />
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
        <Text>さん</Text>
      </HStack>
    </Flex>
  )
}
const Home = React.memo(HomeComponent)
export default Home
