'use client'

import useSWR from 'swr'
import { getStatus } from '@/lib/api'
import { Circle } from 'lucide-react'
import type { ChromeStatus } from '@/lib/types'

export function TopBar() {
  const { data } = useSWR<ChromeStatus>('/api/status', getStatus, {
    refreshInterval: 10000,
  })

  const ready = data?.chrome_ready

  return (
    <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-5 shrink-0">
      <span className="text-sm text-zinc-400">STAGE Social Automation Dashboard</span>

      <div className="flex items-center gap-2 text-xs">
        <Circle
          className={`w-2.5 h-2.5 fill-current ${
            ready === undefined
              ? 'text-zinc-600'
              : ready
              ? 'text-green-500'
              : 'text-red-500'
          }`}
        />
        <span className={ready === undefined ? 'text-zinc-500' : ready ? 'text-green-400' : 'text-red-400'}>
          {ready === undefined ? 'Checking Chrome...' : ready ? 'Chrome Ready' : 'Chrome Offline'}
        </span>
        {data?.browser && (
          <span className="text-zinc-600 hidden sm:inline">({data.browser})</span>
        )}
      </div>
    </header>
  )
}
