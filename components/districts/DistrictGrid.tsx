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

            {/* Buttons row */}
            <div className="mt-auto flex gap-2">
              {fb?.page_url ? (
                <a
                  href={fb.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  Open on Facebook
                </a>
              ) : (
                <div className="flex-1 flex items-center justify-center h-8 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] text-[#3f3f46]">
                  No page yet
                </div>
              )}
              <button
                onClick={() => handleSetup(key)}
                disabled={spin}
                title="Refresh Setup"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#52525b] hover:text-white/80 transition-all disabled:opacity-50 shrink-0"
              >
                <RotateCw className={cn('w-3.5 h-3.5', spin && 'animate-spin')} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
