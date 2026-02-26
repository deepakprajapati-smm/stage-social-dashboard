'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getJobs } from '@/lib/api'
import { JobsTable } from '@/components/jobs/JobsTable'
import { LogDrawer } from '@/components/jobs/LogDrawer'
import type { Job } from '@/lib/types'

export default function JobsPage() {
  const { data: jobs = [], isLoading } = useSWR<Job[]>(
    '/api/jobs',
    getJobs,
    { refreshInterval: 5000 },
  )
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Automation</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Job History</h1>
          <p className="text-zinc-600 text-sm mt-1">{jobs.length} total jobs</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-zinc-600 text-sm">Loading...</p>
      ) : (
        <JobsTable
          jobs={jobs}
          onViewLogs={(job) => setSelectedJob(job)}
        />
      )}

      {selectedJob && (
        <LogDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}
