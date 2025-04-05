import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Inovera',
  description: '',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Head>
        <title>Inovera</title>
      </Head>
      <html lang="en">
        <body>{children}</body>
      </html>
    </>
  )
}
