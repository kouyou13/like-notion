import { Box } from '@chakra-ui/react'
import React from 'react'

const HomeMutateComponent = () => {
  return (
    <>
      <Box>ホーム</Box>
    </>
  )
}
const Home = React.memo(HomeMutateComponent)
export default Home
