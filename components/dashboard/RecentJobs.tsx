import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Job } from '@/lib/types'

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60)  return 'just now'
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

const TYPE_DOT: Record<string, string> = {
  movie: '#a855f7',
  district_setup: '#f97316',
  legacy: '#3f3f46',
}

export function RecentJobs({ jobs }: { jobs: Job[] }) {
  const recent = jobs.slice(0, 7)

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0f0f11] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <p className="text-[13px] font-semibold text-white/80">Recent Activity</p>
        <Link href="/jobs" className="text-[12px] text-[#52525b] hover:text-white/60 transition-colors">
          View all →
        </Link>
      </div>

      {/* Rows */}
      {recent.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[13px] text-[#3f3f46]">No jobs yet</p>
        </div>
      ) : (
        <div>
          {recent.map((job, i) => (
            <div
              key={job.id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
              style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Type dot */}
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: TYPE_DOT[job.job_type ?? 'legacy'] ?? '#3f3f46' }}
              />

              {/* Name */}
              <p className="text-[13px] text-white/80 font-medium flex-1 truncate">{job.title_name}</p>

              {/* Type pill */}
              <span className="text-[11px] text-[#52525b] capitalize hidden sm:block shrink-0">
                {(job.job_type ?? 'legacy').replace('_', ' ')}
              </span>

              {/* Status */}
              <StatusBadge status={job.status} />

              {/* FB link */}
              {job.fb_url
                ? <a href={job.fb_url} target="_blank" rel="noopener noreferrer" className="text-[#3f3f46] hover:text-blue-400 transition-colors shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                : <span className="w-3.5 h-3.5 shrink-0" />
              }

              {/* Time */}
              <p className="text-[11px] text-[#3f3f46] shrink-0 w-14 text-right">{timeAgo(job.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
