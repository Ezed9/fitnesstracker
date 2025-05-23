import { ReactNode } from 'react'
import Head from 'next/head'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title = 'FitTrack', description = 'Track your fitness journey' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
