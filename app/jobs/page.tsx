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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#52525b]">
          <span className="text-white/70 font-semibold">{jobs.length}</span> total jobs
        </p>
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
