'use client'

import { useState } from 'react'
import { ExternalLink, RotateCw } from 'lucide-react'
import { setupDistrict } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { DistrictsMap, MoviePagesMap } from '@/lib/types'

interface UnifiedPage {
  key: string
  name: string
  pageName: string
  pageUrl: string | null
  status: string
  type: 'district' | 'movie'
}

function buildPages(districts: DistrictsMap, movies: MoviePagesMap): UnifiedPage[] {
  const districtPages: UnifiedPage[] = Object.entries(districts).map(([key, acc]) => ({
    key,
    name: acc.district_name,
    pageName: acc.facebook?.page_name ?? '—',
    pageUrl: acc.facebook?.page_url ?? null,
    status: acc.facebook?.status ?? 'pending',
    type: 'district',
  }))

  const moviePages: UnifiedPage[] = Object.entries(movies).map(([key, page]) => ({
    key,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    pageName: page.page_name ?? '—',
    pageUrl: page.page_url ?? null,
    status: 'setup_done',
    type: 'movie',
  }))

  return [...districtPages, ...moviePages]
}

export function AllPagesGrid({
  districts,
  movies,
  onJobCreated,
}: {
  districts: DistrictsMap
  movies: MoviePagesMap
  onJobCreated: (jobId: string, label: string) => void
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const pages = buildPages(districts, movies)

  async function handleSetup(key: string, name: string) {
    setLoading(key)
    try {
      const res = await setupDistrict(key)
      onJobCreated(res.job_id, name)
    } catch (e) { console.error(e) }
    finally { setLoading(null) }
  }

  if (!pages.length) return (
    <div className="py-20 text-center text-[#52525b] text-[13px]">No pages yet</div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {pages.map((page) => {
        const done = page.status === 'setup_done'
        const spin = loading === page.key
        const isDistrict = page.type === 'district'

        return (
          <div
            key={`${page.type}-${page.key}`}
            className={cn(
              'card-glow rounded-xl border bg-[#0f0f11] p-4 flex flex-col gap-3 relative overflow-hidden',
              done ? 'border-emerald-500/[0.15]' : 'border-white/[0.07]',
            )}
          >
            {/* Top accent */}
            {done && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />}

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white tracking-tight truncate">{page.name}</p>
                <p className="text-[11px] text-[#52525b] mt-0.5 truncate">{page.pageName}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                  done
                    ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20'
                    : 'text-[#71717a] bg-white/[0.04] border-white/[0.08]',
                )}>
                  {done ? '✓ Ready' : 'Pending'}
                </span>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full border',
                  isDistrict
                    ? 'text-blue-400 bg-blue-500/[0.08] border-blue-500/20'
                    : 'text-purple-400 bg-purple-500/[0.08] border-purple-500/20',
                )}>
                  {isDistrict ? 'District' : 'Movie'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2">
              {page.pageUrl ? (
                <a
                  href={page.pageUrl}
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
              {isDistrict && (
                <button
                  onClick={() => handleSetup(page.key, page.name)}
                  disabled={spin}
                  title="Refresh Setup"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#52525b] hover:text-white/80 transition-all disabled:opacity-50 shrink-0"
                >
                  <RotateCw className={cn('w-3.5 h-3.5', spin && 'animate-spin')} />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
