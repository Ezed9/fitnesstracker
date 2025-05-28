import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from '../Navbar/index'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>FitTrack - Your Fitness Companion</title>
        <meta name="description" content="Track your fitness journey with FitTrack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-[#121212] text-white">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </>
  )
}
