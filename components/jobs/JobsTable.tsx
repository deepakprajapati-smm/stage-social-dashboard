'use client'

import { ExternalLink, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { Job } from '@/lib/types'

interface JobsTableProps {
  jobs: Job[]
  onViewLogs: (job: Job) => void
}

export function JobsTable({ jobs, onViewLogs }: JobsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500 text-xs">Title</TableHead>
            <TableHead className="text-zinc-500 text-xs">Type</TableHead>
            <TableHead className="text-zinc-500 text-xs">Status</TableHead>
            <TableHead className="text-zinc-500 text-xs">FB Page</TableHead>
            <TableHead className="text-zinc-500 text-xs">Created</TableHead>
            <TableHead className="text-zinc-500 text-xs">Logs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-600 py-10">
                No jobs found
              </TableCell>
            </TableRow>
          )}
          {jobs.map((job) => (
            <TableRow key={job.id} className="border-zinc-800">
              <TableCell className="text-zinc-200 font-medium text-sm">
                {job.title_name}
              </TableCell>
              <TableCell>
                <span className="text-xs text-zinc-500 capitalize bg-zinc-800 px-1.5 py-0.5 rounded">
                  {job.job_type ?? 'legacy'}
                </span>
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
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                ) : (
                  <span className="text-zinc-700 text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="text-zinc-600 text-xs">
                {new Date(job.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-zinc-500 hover:text-zinc-200"
                  onClick={() => onViewLogs(job)}
                >
                  <Terminal className="w-3.5 h-3.5 mr-1" />
                  Logs
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
