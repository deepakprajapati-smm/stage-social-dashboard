'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getDistricts, getMovies } from '@/lib/api'
import { AllPagesGrid } from '@/components/districts/AllPagesGrid'
import type { DistrictsMap, MoviePagesMap } from '@/lib/types'

export default function PagesPage() {
  const { data: districts = {}, isLoading: loadingD } = useSWR<DistrictsMap>(
    '/api/districts', getDistricts, { refreshInterval: 30000 },
  )
  const { data: movies = {}, isLoading: loadingM } = useSWR<MoviePagesMap>(
    '/api/movies', getMovies, { refreshInterval: 30000 },
  )

  const totalPages   = Object.keys(districts).length + Object.keys(movies).length
  const districtDone = Object.values(districts).filter(d => d.facebook?.status === 'setup_done').length
  const movieDone    = Object.keys(movies).length
  const totalDone    = districtDone + movieDone

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <p className="text-[13px] text-[#52525b]">
          <span className="text-emerald-400 font-semibold">{totalDone}</span>
          <span className="text-[#3f3f46]">/{totalPages}</span> pages ready
        </p>
        <span className="text-[11px] text-[#3f3f46]">·</span>
        <p className="text-[11px] text-[#3f3f46]">{Object.keys(districts).length} districts · {Object.keys(movies).length} movies</p>
      </div>

      {(loadingD || loadingM) ? (
        <p className="text-zinc-600 text-sm">Loading...</p>
      ) : (
        <AllPagesGrid
          districts={districts}
          movies={movies}
          onJobCreated={() => {}}
        />
      )}
    </div>
  )
}
