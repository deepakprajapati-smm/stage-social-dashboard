'use client'

import { useState } from 'react'
import { ExternalLink, RotateCw } from 'lucide-react'
import { setupDistrict } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { DistrictsMap } from '@/lib/types'

export function DistrictGrid({ districts, onJobCreated }: {
  districts: DistrictsMap
  onJobCreated: (jobId: string, label: string) => void
}) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSetup(key: string) {
    setLoading(key)
    try {
      const res = await setupDistrict(key)
      onJobCreated(res.job_id, `STAGE ${key.charAt(0).toUpperCase() + key.slice(1)}`)
    } catch (e) { console.error(e) }
    finally { setLoading(null) }
  }

  const entries = Object.entries(districts)
  if (!entries.length) return (
    <div className="py-20 text-center text-[#52525b] text-[13px]">No districts loaded — check API</div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {entries.map(([key, acc]) => {
        const fb     = acc.facebook
        const done   = fb?.status === 'setup_done'
        const spin   = loading === key

        return (
          <div
            key={key}
            className={cn(
              'card-glow group rounded-xl border bg-[#0f0f11] p-4 flex flex-col gap-3 relative overflow-hidden',
              done ? 'border-emerald-500/[0.15]' : 'border-white/[0.07]',
            )}
          >
            {/* Top accent */}
            {done && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />}

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold text-white tracking-tight">{acc.district_name}</p>
                <p className="text-[11px] text-[#52525b] mt-0.5">{fb?.page_name ?? '—'}</p>
              </div>
              <span className={cn(
                'shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                done
                  ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20'
                  : 'text-[#71717a] bg-white/[0.04] border-white/[0.08]',
              )}>
                {done ? '✓ Ready' : 'Pending'}
              </span>
            </div>

            {/* URL */}
            {fb?.page_url ? (
              <a
                href={fb.page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-[#52525b] hover:text-blue-400 transition-colors w-fit"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[180px]">{fb.page_url.replace('https://www.facebook.com/', 'fb.com/')}</span>
              </a>
            ) : (
              <p className="text-[11px] text-[#3f3f46]">No page URL yet</p>
            )}

            {/* Button */}
            <button
              onClick={() => handleSetup(key)}
              disabled={spin}
              className="mt-auto w-full flex items-center justify-center gap-2 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] text-[12px] text-[#71717a] hover:text-white/80 transition-all disabled:opacity-50"
            >
              <RotateCw className={cn('w-3 h-3', spin && 'animate-spin')} />
              {spin ? 'Starting...' : 'Refresh Setup'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
