import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Toaster } from '@/components/ui/sonner'
import { ApiUrlInit } from '@/components/ApiUrlInit'
import { RunningJobMonitor } from '@/components/RunningJobMonitor'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'STAGE Social Dashboard',
  description: 'Automation dashboard for STAGE Social Media',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-[#fafafa] min-h-screen`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto bg-dot-grid">
              <div className="p-8 max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Suspense fallback={null}><ApiUrlInit /></Suspense>
        <RunningJobMonitor />
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
