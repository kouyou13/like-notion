import { HStack, Box } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineDoubleRight } from 'react-icons/ai'

type TopBarProps = {
  isOpenSidebar: boolean
  setIsOpenSidebar: (isOpen: boolean) => void
}

const TopBarComponent = ({ isOpenSidebar, setIsOpenSidebar }: TopBarProps) => {
  return (
    <HStack h="3vh" bgColor="white" px={2} py={1}>
      {!isOpenSidebar && (
        <Box
          bgColor="white"
          color="gray.500"
          _hover={{ bgColor: 'gray.200' }}
          onClick={() => {
            setIsOpenSidebar(true)
          }}
          borderRadius="md"
        >
          <AiOutlineDoubleRight size={21} />
        </Box>
      )}
    </HStack>
  )
}
const TopBar = React.memo(TopBarComponent)
export default TopBar
