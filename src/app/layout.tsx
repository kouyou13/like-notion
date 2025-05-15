import './globals.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { Metadata } from 'next'

import Template from '../features/Template/components'

export const metadata: Metadata = {
  title: 'like Notion',
  description: 'Notionみたいなサイトです',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ChakraProvider value={defaultSystem}>
          <Template>{children}</Template>
        </ChakraProvider>
      </body>
    </html>
  )
}
