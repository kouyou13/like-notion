import { Heading, Flex, Box, Text, Input, Separator, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'

import { errorToast } from '@/common/toast'

import { createSupabaseClient } from '../../../lib/supabase'

const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const supabase = createSupabaseClient()
  const router = useRouter()

  const handleLogin = useCallback(() => {
    const login = async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        errorToast('メールアドレスかパスワードが異なります')
        return
      }
      router.push('/')
    }
    void login()
  }, [email, password, supabase, router])

  return (
    <>
      <Flex justify="center" h="100vh" w="100vw" mt="30vh">
        <Box textAlign="left">
          <Box py={5}>
            <Heading>Think it. Make it.</Heading>
            <Heading color="gray">Notionアカウントにログイン</Heading>
          </Box>
          <Separator />
          <Box py={5}>
            <Text fontSize="xs">メールアドレス</Text>
            <Input
              size="xs"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              type="email"
            />
            <Text fontSize="xs" mt={4}>
              パスワード
            </Text>
            <Input
              size="xs"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              type="password"
            />
            <Button
              bgColor="white"
              color="black"
              border="1px solid black"
              w="100%"
              size="xs"
              mt={5}
              onClick={handleLogin}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  )
}
const Login = React.memo(LoginComponent)
export default Login
