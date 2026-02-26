import { ExternalLink, Film } from 'lucide-react'
import type { MoviePagesMap } from '@/lib/types'

interface MovieTableProps {
  movies: MoviePagesMap
}

export function MovieTable({ movies }: MovieTableProps) {
  const entries = Object.entries(movies)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-white/[0.06]">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
          <Film className="w-6 h-6 text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No movie pages yet</p>
        <p className="text-zinc-700 text-xs mt-1">Click &ldquo;+ Create New&rdquo; to create your first movie FB page</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1.5fr_140px_1fr] gap-4 px-4 py-2.5 bg-white/[0.02]">
        <p className="text-xs font-medium text-zinc-600">Title</p>
        <p className="text-xs font-medium text-zinc-600">Page Name</p>
        <p className="text-xs font-medium text-zinc-600">FB Page</p>
        <p className="text-xs font-medium text-zinc-600">Bio</p>
      </div>

      {entries.map(([slug, page]) => (
        <div
          key={slug}
          className="grid grid-cols-[1fr_1.5fr_140px_1fr] gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors items-center"
        >
          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
              <Film className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-zinc-200 text-sm font-medium capitalize truncate">
              {slug.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Page name */}
          <p className="text-zinc-400 text-sm truncate">{page.page_name}</p>

          {/* FB URL */}
          {page.page_url ? (
            <a
              href={page.page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors w-fit"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">Open Page</span>
            </a>
          ) : (
            <span className="text-zinc-700 text-xs">—</span>
          )}

          {/* Bio */}
          <p className="text-zinc-600 text-xs truncate">{page.bio}</p>
        </div>
      ))}
    </div>
  )
}
