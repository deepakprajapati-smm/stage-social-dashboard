import Link from 'next/link'
import { ExternalLink, Film, MapPin, Clock } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Job } from '@/lib/types'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  movie:          <Film className="w-3 h-3" />,
  district_setup: <MapPin className="w-3 h-3" />,
  legacy:         <Clock className="w-3 h-3" />,
}

interface RecentJobsProps {
  jobs: Job[]
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  const recent = jobs.slice(0, 6)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-300">Recent Activity</h2>
        <Link href="/jobs" className="text-xs text-zinc-600 hover:text-orange-400 transition-colors">
          View all →
        </Link>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
        {recent.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-zinc-600" />
            </div>
            <p className="text-zinc-600 text-sm">No jobs yet</p>
            <p className="text-zinc-700 text-xs mt-1">Create a movie page or setup a district</p>
          </div>
        )}
        {recent.map((job) => (
          <div key={job.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
            {/* Type icon */}
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500">
              {TYPE_ICON[job.job_type ?? 'legacy'] ?? <Clock className="w-3 h-3" />}
            </div>

            {/* Title + type */}
            <div className="flex-1 min-w-0">
              <p className="text-zinc-200 text-sm font-medium truncate">{job.title_name}</p>
              <p className="text-zinc-600 text-xs capitalize mt-0.5">{(job.job_type ?? 'legacy').replace('_', ' ')}</p>
            </div>

            {/* Status */}
            <StatusBadge status={job.status} />

            {/* FB link */}
            {job.fb_url ? (
              <a
                href={job.fb_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-blue-400 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}

            {/* Time */}
            <p className="text-zinc-700 text-xs shrink-0 w-16 text-right">{timeAgo(job.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
