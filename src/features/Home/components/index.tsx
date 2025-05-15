import { Box } from '@chakra-ui/react'
import React from 'react'

const HomeComponent = () => {
  return (
    <>
      <Box>ホーム</Box>
    </>
  )
}
const Home = React.memo(HomeComponent)
export default Home
