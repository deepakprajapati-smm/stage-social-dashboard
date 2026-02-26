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
    <div className="space-y-5">
      <StatsCards jobs={jobs} districtCount={districtCount} movieCount={movieCount} />
      <RecentJobs jobs={jobs} />
    </div>
  )
}
