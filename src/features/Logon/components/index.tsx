import { Heading, Flex, Box, Text, Input, Separator, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { v4 } from 'uuid'

import { errorToast } from '@/common/toast'

import { createSupabaseClient } from '../../../lib/supabase'

const LogonComponent = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const supabase = createSupabaseClient()
  const router = useRouter()

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleLogin = useCallback(() => {
    if (username === '') {
      errorToast('ユーザー名を入力してください')
      return
    } else if (email === '') {
      errorToast('メールアドレスを入力してください')
      return
    } else if (password === '') {
      errorToast('パスワードを入力してください')
      return
    } else if (confirmPassword === '') {
      errorToast('確認用パスワードを入力してください')
      return
    } else if (password !== confirmPassword) {
      errorToast('パスワードと確認用パスワードが異なります')
      return
    } else if (!validateEmail(email)) {
      errorToast('有効なメールアドレスではありません')
      return
    }
    const login = async () => {
      try {
        const { data: userdata, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          if (error.message.includes('User already registered')) {
            // 既にそのメールアドレスのアカウントが存在する
            errorToast('このメールアドレスは既に登録されています')
            return
          }
          console.error(error.message)
          errorToast('アカウントの作成に失敗しました')
          return
        }
        if (userdata.user) {
          const { error: infoError } = await supabase.from('user_information').insert({
            id: v4(),
            user_id: userdata.user.id,
            name: username,
          })
          if (infoError) {
            console.error(infoError.message)
            errorToast('アカウントの作成に失敗しました')
            return
          }
        }
        router.push('/home')
        return
      } catch (error) {
        console.error('ログオンに失敗しました: ', error)
      }
    }
    void login()
  }, [username, email, password, confirmPassword, supabase, router])

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
            <Text fontSize="xs">ユーザー名</Text>
            <Input
              size="xs"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            <Text fontSize="xs" mt={4}>
              メールアドレス
            </Text>
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
            <Text fontSize="xs" mt={4}>
              確認用パスワード
            </Text>
            <Input
              size="xs"
              placeholder="パスワードを再入力"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
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
              アカウント作成
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  )
}
const Logon = React.memo(LogonComponent)
export default Logon
