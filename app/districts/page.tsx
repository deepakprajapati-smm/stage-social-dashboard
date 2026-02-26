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
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Rajasthan</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">District Pages</h1>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <span className="text-xs text-zinc-600">{done}/{count} ready</span>
          <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: count > 0 ? `${(done / count) * 100}%` : '0%' }}
            />
          </div>
        </div>
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
