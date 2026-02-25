'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getDistricts } from '@/lib/api'
import { DistrictGrid } from '@/components/districts/DistrictGrid'
import { LogDrawer } from '@/components/jobs/LogDrawer'
import { getJob } from '@/lib/api'
import type { DistrictsMap, Job } from '@/lib/types'

export default function DistrictsPage() {
  const { data: districts = {}, isLoading } = useSWR<DistrictsMap>(
    '/api/districts',
    getDistricts,
    { refreshInterval: 30000 },
  )
  const [activeJob, setActiveJob]   = useState<Job | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  async function handleJobCreated(jobId: string, label: string) {
    // Optimistically open drawer with a minimal job object
    const job = await getJob(jobId).catch(() => null)
    if (job) {
      setActiveJob(job)
      setDrawerOpen(true)
    }
  }

  const count = Object.keys(districts).length
  const done  = Object.values(districts).filter(
    (d) => d.facebook?.status === 'setup_done'
  ).length

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">District Pages</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {done}/{count} pages ready
        </p>
      </div>

      {isLoading ? (
        <p className="text-zinc-600 text-sm">Loading...</p>
      ) : (
        <DistrictGrid districts={districts} onJobCreated={handleJobCreated} />
      )}

      {drawerOpen && (
        <LogDrawer
          job={activeJob}
          onClose={() => { setDrawerOpen(false); setActiveJob(null) }}
        />
      )}
    </div>
  )
}
