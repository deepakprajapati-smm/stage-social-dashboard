'use client'

import { ExternalLink, Terminal } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Job } from '@/lib/types'

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

const TYPE_STYLE: Record<string, { label: string; color: string }> = {
  movie:          { label: 'Movie',    color: '#a855f7' },
  district_setup: { label: 'District', color: '#f97316' },
  legacy:         { label: 'Legacy',   color: '#52525b' },
}

export function JobsTable({ jobs, onViewLogs }: { jobs: Job[]; onViewLogs: (job: Job) => void }) {
  if (!jobs.length) return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0f0f11] py-16 text-center">
      <p className="text-[13px] text-[#52525b]">No jobs found</p>
    </div>
  )

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0f0f11] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_90px_110px_100px_80px_60px] gap-4 px-5 py-3 border-b border-white/[0.05]">
        {['Title', 'Type', 'Status', 'Created', 'FB Page', ''].map(h => (
          <p key={h} className="text-[11px] font-semibold text-[#3f3f46] uppercase tracking-wider">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div>
        {jobs.map((job, i) => {
          const t = TYPE_STYLE[job.job_type ?? 'legacy'] ?? TYPE_STYLE.legacy
          return (
            <div
              key={job.id}
              className="grid grid-cols-[2fr_90px_110px_100px_80px_60px] gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors items-center"
              style={{ borderBottom: i < jobs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <p className="text-[13px] font-medium text-white/85 truncate">{job.title_name}</p>

              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full border w-fit"
                style={{ color: t.color, background: `${t.color}14`, borderColor: `${t.color}30` }}
              >
                {t.label}
              </span>

              <div><StatusBadge status={job.status} /></div>

              <p className="text-[12px] text-[#52525b]">{timeAgo(job.created_at)}</p>

              {job.fb_url
                ? <a href={job.fb_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[12px] text-[#52525b] hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-3 h-3" /> Open
                  </a>
                : <span className="text-[#3f3f46] text-[12px]">—</span>
              }

              <button
                onClick={() => onViewLogs(job)}
                className="flex items-center gap-1 text-[11px] text-[#52525b] hover:text-white/70 transition-colors"
              >
                <Terminal className="w-3 h-3" />
                Logs
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
