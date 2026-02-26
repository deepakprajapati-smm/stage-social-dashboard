'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getMovies, getJobs, getJob } from '@/lib/api'
import { MovieTable } from '@/components/movies/MovieTable'
import { CreateMovieDialog } from '@/components/movies/CreateMovieDialog'
import { LogDrawer } from '@/components/jobs/LogDrawer'
import { LogTerminal } from '@/components/shared/LogTerminal'
import { useJobStream } from '@/hooks/useJobStream'
import type { MoviePagesMap, Job } from '@/lib/types'

function LiveJobPanel({ jobId, title, onClose }: { jobId: string; title: string; onClose: () => void }) {
  const { logs, status, fbUrl } = useJobStream(jobId)
  return (
    <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-300 font-medium">
          Creating: <span className="text-zinc-100">{title}</span>
        </p>
        {(status === 'done' || status === 'error') && (
          <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300">
            Dismiss
          </button>
        )}
      </div>
      <LogTerminal logs={logs} status={status} fbUrl={fbUrl} />
      {fbUrl && (
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
        >
          Open Facebook Page →
        </a>
      )}
    </div>
  )
}

export default function MoviesPage() {
  const { data: movies = {}, mutate } = useSWR<MoviePagesMap>(
    '/api/movies',
    getMovies,
    { refreshInterval: 10000 },
  )
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string>('')

  function handleJobCreated(jobId: string, title: string) {
    setActiveJobId(jobId)
    setActiveTitle(title)
    // Refresh movies list after a delay once job might be done
    setTimeout(() => mutate(), 5000)
    setTimeout(() => mutate(), 15000)
    setTimeout(() => mutate(), 30000)
  }

  const movieCount = Object.keys(movies).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#52525b]">
          <span className="text-white/70 font-semibold">{movieCount}</span> pages created
        </p>
        <CreateMovieDialog onJobCreated={handleJobCreated} />
      </div>

      {activeJobId && (
        <LiveJobPanel
          jobId={activeJobId}
          title={activeTitle}
          onClose={() => { setActiveJobId(null); mutate() }}
        />
      )}

      <MovieTable movies={movies} />
    </div>
  )
}
