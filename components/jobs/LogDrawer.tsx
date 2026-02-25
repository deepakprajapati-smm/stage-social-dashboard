'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LogTerminal } from '@/components/shared/LogTerminal'
import { useJobStream } from '@/hooks/useJobStream'
import type { Job } from '@/lib/types'

interface LogDrawerProps {
  job: Job | null
  onClose: () => void
}

export function LogDrawer({ job, onClose }: LogDrawerProps) {
  const { logs, status, fbUrl } = useJobStream(
    job && (job.status === 'running' || job.status === 'queued') ? job.id : null
  )

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!job) return null

  // For already-finished jobs, show stored logs; for running jobs use SSE
  const displayLogs = status === 'idle' ? job.logs : logs
  const displayStatus =
    status === 'idle'
      ? job.status === 'done' ? 'done' : job.status === 'failed' ? 'error' : 'idle'
      : status
  const displayUrl = fbUrl ?? job.fb_url ?? undefined

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <p className="text-zinc-200 font-semibold text-sm">{job.title_name}</p>
            <p className="text-zinc-600 text-xs mt-0.5 font-mono">{job.id.slice(0, 8)}…</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={job.status} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Job meta */}
        <div className="px-5 py-3 border-b border-zinc-800 flex gap-4 text-xs text-zinc-500 shrink-0">
          <span>Type: <span className="text-zinc-400 capitalize">{job.job_type ?? 'legacy'}</span></span>
          <span>Created: <span className="text-zinc-400">{new Date(job.created_at).toLocaleString()}</span></span>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-hidden p-5">
          <LogTerminal
            logs={displayLogs}
            status={displayStatus as 'idle' | 'running' | 'done' | 'error'}
            fbUrl={displayUrl}
          />
        </div>

        {/* Footer */}
        {displayUrl && (
          <div className="px-5 pb-5 shrink-0">
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Open Facebook Page →
            </a>
          </div>
        )}
      </aside>
    </>
  )
}
