import { Box } from '@chakra-ui/react'
import React from 'react'

const HomeMutateComponent = () => {
  return (
    <>
      <Box border="1px red solid" m={5} minH={500}>
        ホーム
      </Box>
    </>
  )
}
const Home = React.memo(HomeMutateComponent)
export default Home
