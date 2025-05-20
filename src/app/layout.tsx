import './globals.css'
import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import { Providers } from './providers'
import Template from '../features/Template/components'

export const metadata: Metadata = {
  title: 'like Notion',
  description: 'Notionみたいなサイトです',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Toaster />
          <Template>{children}</Template>
        </Providers>
      </body>
    </html>
  )
}
