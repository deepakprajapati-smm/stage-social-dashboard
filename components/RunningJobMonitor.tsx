'use client'

import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { X, ExternalLink } from 'lucide-react'
import { getJobs } from '@/lib/api'
import { useJobStream } from '@/hooks/useJobStream'
import { LogTerminal } from '@/components/shared/LogTerminal'
import type { Job } from '@/lib/types'

export function RunningJobMonitor() {
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [dismissed, setDismissed] = useState<string | null>(null)
  const prevJobIdRef = useRef<string | null>(null)

  const { data: jobs = [] } = useSWR<Job[]>('/api/jobs', getJobs, {
    refreshInterval: 3000,
  })

  // Auto-detect new running job
  useEffect(() => {
    const running = jobs.find((j) => j.status === 'running' || j.status === 'queued')
    if (running && running.id !== dismissed) {
      // New job started — auto-open
      if (prevJobIdRef.current !== running.id) {
        prevJobIdRef.current = running.id
        setActiveJob(running)
      }
    }
  }, [jobs, dismissed])

  // SSE stream for the active job
  const isLive = activeJob?.status === 'running' || activeJob?.status === 'queued'
  const { logs, status, fbUrl } = useJobStream(isLive ? activeJob?.id ?? null : null)

  // Keep activeJob in sync with latest data from polling
  useEffect(() => {
    if (!activeJob) return
    const updated = jobs.find((j) => j.id === activeJob.id)
    if (updated && updated.status !== activeJob.status) {
      setActiveJob(updated)
    }
  }, [jobs, activeJob])

  // Auto-close after completion (10s delay)
  useEffect(() => {
    if (status === 'done' || status === 'error') {
      const t = setTimeout(() => setActiveJob(null), 10000)
      return () => clearTimeout(t)
    }
  }, [status])

  if (!activeJob) return null

  const displayLogs = isLive ? logs : activeJob.logs ?? []
  const displayStatus =
    status !== 'idle'
      ? status
      : activeJob.status === 'done'
      ? 'done'
      : activeJob.status === 'failed'
      ? 'error'
      : 'running'
  const displayUrl = fbUrl ?? activeJob.fb_url ?? undefined

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[460px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-xl border border-white/[0.1] bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          {displayStatus === 'running' && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          )}
          {displayStatus === 'done' && (
            <span className="w-2 h-2 rounded-full bg-green-400" />
          )}
          {displayStatus === 'error' && (
            <span className="w-2 h-2 rounded-full bg-red-400" />
          )}
          <span className="text-white text-sm font-semibold">
            {activeJob.title_name || activeJob.movie_title || 'Running Job'}
          </span>
          <span className="text-zinc-600 text-xs font-mono">{activeJob.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-2">
          {displayStatus === 'done' && displayUrl && (
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
            >
              Open FB Page <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={() => {
              setDismissed(activeJob.id)
              setActiveJob(null)
            }}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="p-3">
        <LogTerminal
          logs={displayLogs}
          status={displayStatus as 'idle' | 'running' | 'done' | 'error'}
          fbUrl={displayUrl}
        />
      </div>

      {displayStatus === 'done' && (
        <div className="px-4 pb-3 text-[11px] text-zinc-600 text-center">
          Auto-closing in 10s · <button onClick={() => setActiveJob(null)} className="underline hover:text-zinc-400">Close now</button>
        </div>
      )}
    </div>
  )
}
