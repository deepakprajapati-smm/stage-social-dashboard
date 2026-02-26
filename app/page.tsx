'use client'

import useSWR from 'swr'
import { getJobs, getDistricts, getMovies } from '@/lib/api'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentJobs } from '@/components/dashboard/RecentJobs'
import type { Job, DistrictsMap, MoviePagesMap } from '@/lib/types'

export default function DashboardPage() {
  const { data: jobs = [] }      = useSWR<Job[]>('/api/jobs', getJobs, { refreshInterval: 5000 })
  const { data: districts = {} } = useSWR<DistrictsMap>('/api/districts', getDistricts)
  const { data: movies = {} }    = useSWR<MoviePagesMap>('/api/movies', getMovies)

  const districtCount = Object.keys(districts).length
  const movieCount    = Object.keys(movies).length

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
        <p className="text-zinc-600 text-xs pb-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <StatsCards jobs={jobs} districtCount={districtCount} movieCount={movieCount} />
      <RecentJobs jobs={jobs} />
    </div>
  )
}
