import { ExternalLink } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { MoviePagesMap } from '@/lib/types'

interface MovieTableProps {
  movies: MoviePagesMap
}

export function MovieTable({ movies }: MovieTableProps) {
  const entries = Object.entries(movies)

  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500 text-xs">Title</TableHead>
            <TableHead className="text-zinc-500 text-xs">Page Name</TableHead>
            <TableHead className="text-zinc-500 text-xs">FB Page</TableHead>
            <TableHead className="text-zinc-500 text-xs">Bio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-600 py-8">
                No movie pages created yet. Click &quot;+ Create New&quot; to start.
              </TableCell>
            </TableRow>
          )}
          {entries.map(([slug, page]) => (
            <TableRow key={slug} className="border-zinc-800">
              <TableCell className="text-zinc-200 font-medium text-sm capitalize">
                {slug.replace(/_/g, ' ')}
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">{page.page_name}</TableCell>
              <TableCell>
                {page.page_url ? (
                  <a
                    href={page.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                ) : (
                  <span className="text-zinc-600 text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="text-zinc-600 text-xs max-w-xs truncate">
                {page.bio}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
