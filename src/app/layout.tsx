import type { Metadata } from 'next'
import '../styles/globals.css'
import type React from 'react'

export const metadata: Metadata = {
  title: '都道府県別の総人口推移グラフ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  )
}
