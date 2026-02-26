import { ExternalLink } from 'lucide-react'
import type { MoviePagesMap } from '@/lib/types'

export function MovieTable({ movies }: { movies: MoviePagesMap }) {
  const entries = Object.entries(movies)

  if (!entries.length) return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0f0f11] py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
        <span className="text-[20px]">🎬</span>
      </div>
      <p className="text-[13px] text-[#52525b]">No movie pages yet</p>
      <p className="text-[11px] text-[#3f3f46] mt-1">Click &ldquo;+ Create New&rdquo; to get started</p>
    </div>
  )

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0f0f11] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1.2fr_1.5fr_160px_1fr] gap-4 px-5 py-3 border-b border-white/[0.05]">
        {['Title', 'Page Name', 'FB Page', 'Bio'].map(h => (
          <p key={h} className="text-[11px] font-semibold text-[#3f3f46] uppercase tracking-wider">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div>
        {entries.map(([slug, page], i) => (
          <div
            key={slug}
            className="grid grid-cols-[1.2fr_1.5fr_160px_1fr] gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors items-center"
            style={{ borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
          >
            <p className="text-[13px] font-medium text-white/90 capitalize">{slug.replace(/_/g, ' ')}</p>
            <p className="text-[13px] text-[#71717a] truncate">{page.page_name || '—'}</p>
            {page.page_url ? (
              <a
                href={page.page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] text-[#52525b] hover:text-blue-400 transition-colors w-fit"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                Open Page
              </a>
            ) : (
              <span className="text-[12px] text-[#3f3f46]">—</span>
            )}
            <p className="text-[11px] text-[#3f3f46] truncate">{page.bio || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
