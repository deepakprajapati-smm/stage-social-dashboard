'use client'

import { useState } from 'react'
import { ExternalLink, RefreshCw, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setupDistrict } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { DistrictsMap } from '@/lib/types'

interface DistrictGridProps {
  districts: DistrictsMap
  onJobCreated: (jobId: string, label: string) => void
}

export function DistrictGrid({ districts, onJobCreated }: DistrictGridProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSetup(key: string) {
    setLoading(key)
    try {
      const res = await setupDistrict(key)
      onJobCreated(res.job_id, `Setup: STAGE ${key.charAt(0).toUpperCase() + key.slice(1)}`)
    } catch (e) {
      console.error('Setup failed:', e)
    } finally {
      setLoading(null)
    }
  }

  const entries = Object.entries(districts)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No districts loaded</p>
        <p className="text-zinc-700 text-xs mt-1">Make sure the API is running</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map(([key, account]) => {
        const fb     = account.facebook
        const isDone = fb?.status === 'setup_done'
        const isLoading = loading === key

        return (
          <div
            key={key}
            className={cn(
              'group rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200',
              isDone
                ? 'border-green-500/15 bg-green-500/[0.03] hover:border-green-500/25'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]',
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  isDone ? 'bg-green-500/15' : 'bg-zinc-800',
                )}>
                  <MapPin className={cn('w-4 h-4', isDone ? 'text-green-400' : 'text-zinc-600')} />
                </div>
                <div>
                  <p className="text-zinc-200 font-semibold text-sm leading-none">{account.district_name}</p>
                  <p className="text-zinc-600 text-[11px] mt-0.5 truncate max-w-[120px]">{fb?.page_name ?? '—'}</p>
                </div>
              </div>

              {/* Status pill */}
              <span className={cn(
                'shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                isDone
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700',
              )}>
                {isDone ? '✓ Ready' : fb?.status ?? 'unknown'}
              </span>
            </div>

            {/* FB Page link */}
            <div className="flex items-center gap-2">
              {fb?.page_url ? (
                <a
                  href={fb.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{fb.page_url.replace('https://www.facebook.com/', 'fb.com/')}</span>
                </a>
              ) : (
                <span className="text-zinc-700 text-xs">No FB page yet</span>
              )}
            </div>

            {/* Setup button */}
            <Button
              variant="ghost"
              size="sm"
              className="mt-auto w-full h-8 text-xs border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200"
              disabled={isLoading}
              onClick={() => handleSetup(key)}
            >
              <RefreshCw className={cn('w-3 h-3 mr-1.5', isLoading && 'animate-spin')} />
              {isLoading ? 'Starting job...' : 'Refresh Setup'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
