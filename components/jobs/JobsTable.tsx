'use client'

import { ExternalLink, Terminal, Film, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Job } from '@/lib/types'

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  movie:          { icon: <Film className="w-3.5 h-3.5" />,   label: 'Movie',    color: 'text-purple-400 bg-purple-500/10' },
  district_setup: { icon: <MapPin className="w-3.5 h-3.5" />, label: 'District', color: 'text-orange-400 bg-orange-500/10' },
  legacy:         { icon: <Clock className="w-3.5 h-3.5" />,  label: 'Legacy',   color: 'text-zinc-400 bg-zinc-700/40' },
}

interface JobsTableProps {
  jobs: Job[]
  onViewLogs: (job: Job) => void
}

export function JobsTable({ jobs, onViewLogs }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-white/[0.06]">
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
          <Clock className="w-6 h-6 text-zinc-600" />
        </div>
        <p className="text-zinc-500 text-sm">No jobs found</p>
        <p className="text-zinc-700 text-xs mt-1">Jobs will appear here once created</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_100px_110px_130px_90px_80px] gap-3 px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
        {['Title', 'Type', 'Status', 'Created', 'FB Page', 'Logs'].map((h) => (
          <p key={h} className="text-[11px] font-medium text-zinc-600 uppercase tracking-wide">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.03]">
        {jobs.map((job) => {
          const tc = TYPE_CONFIG[job.job_type ?? 'legacy'] ?? TYPE_CONFIG.legacy
          return (
            <div
              key={job.id}
              className="grid grid-cols-[2fr_100px_110px_130px_90px_80px] gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors items-center"
            >
              {/* Title */}
              <p className="text-zinc-200 text-sm font-medium truncate">{job.title_name}</p>

              {/* Type */}
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full w-fit ${tc.color}`}>
                {tc.icon}
                {tc.label}
              </span>

              {/* Status */}
              <div><StatusBadge status={job.status} /></div>

              {/* Created */}
              <p className="text-zinc-600 text-xs">{timeAgo(job.created_at)}</p>

              {/* FB */}
              {job.fb_url ? (
                <a
                  href={job.fb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </a>
              ) : (
                <span className="text-zinc-800 text-xs">—</span>
              )}

              {/* Logs button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.05] w-fit"
                onClick={() => onViewLogs(job)}
              >
                <Terminal className="w-3 h-3 mr-1" />
                Logs
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
