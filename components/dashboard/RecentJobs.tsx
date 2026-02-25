import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { Job } from '@/lib/types'

interface RecentJobsProps {
  jobs: Job[]
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  const recent = jobs.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-200">Recent Jobs</h2>
        <Link href="/jobs" className="text-xs text-zinc-500 hover:text-zinc-300">
          View all →
        </Link>
      </div>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-500 text-xs">Title</TableHead>
              <TableHead className="text-zinc-500 text-xs">Type</TableHead>
              <TableHead className="text-zinc-500 text-xs">Status</TableHead>
              <TableHead className="text-zinc-500 text-xs">FB Page</TableHead>
              <TableHead className="text-zinc-500 text-xs">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-600 py-6">
                  No jobs yet
                </TableCell>
              </TableRow>
            )}
            {recent.map((job) => (
              <TableRow key={job.id} className="border-zinc-800">
                <TableCell className="text-zinc-200 font-medium text-sm">
                  {job.title_name}
                </TableCell>
                <TableCell className="text-zinc-500 text-xs capitalize">
                  {job.job_type ?? 'legacy'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  {job.fb_url ? (
                    <a
                      href={job.fb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-600 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-600 text-xs">
                  {new Date(job.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
