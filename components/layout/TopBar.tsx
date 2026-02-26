'use client'

import useSWR from 'swr'
import { getStatus } from '@/lib/api'
import { Zap, ZapOff } from 'lucide-react'
import type { ChromeStatus } from '@/lib/types'

export function TopBar() {
  const { data } = useSWR<ChromeStatus>('/api/status', getStatus, {
    refreshInterval: 10000,
  })

  const ready     = data?.chrome_ready
  const isLoading = ready === undefined

  return (
    <header className="h-13 border-b border-white/[0.06] bg-[#0e0e0e]/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">

      {/* Left — Page context (empty, pages fill this) */}
      <div />

      {/* Right — Chrome status */}
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse" />
            Checking...
          </div>
        ) : ready ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <Zap className="w-3 h-3 text-green-400 fill-green-400" />
            <span className="text-green-400 text-xs font-medium">Chrome Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <ZapOff className="w-3 h-3 text-red-400" />
            <span className="text-red-400 text-xs font-medium">Chrome Offline</span>
            <span className="text-zinc-600 text-xs hidden sm:inline">· run start-local.sh</span>
          </div>
        )}
      </div>
    </header>
  )
}
