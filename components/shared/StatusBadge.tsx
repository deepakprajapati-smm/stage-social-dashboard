import type { JobStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const CONFIG: Record<JobStatus, { label: string; dot: string; text: string; bg: string }> = {
  queued:  { label: 'Queued',  dot: 'bg-zinc-500',              text: 'text-zinc-400',  bg: 'bg-zinc-500/10 border-zinc-500/20' },
  running: { label: 'Running', dot: 'bg-blue-400 status-pulse', text: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20' },
  done:    { label: 'Done',    dot: 'bg-green-400',             text: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  failed:  { label: 'Failed',  dot: 'bg-red-400',               text: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20'  },
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const c = CONFIG[status] ?? CONFIG.queued
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium',
      c.bg, c.text,
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', c.dot)} />
      {c.label}
    </span>
  )
}
