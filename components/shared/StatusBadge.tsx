import type { JobStatus } from '@/lib/types'

const C: Record<JobStatus, { label: string; dot: string; cls: string }> = {
  queued:  { label: 'Queued',  dot: '#52525b', cls: 'text-[#71717a] bg-white/[0.05] border-white/[0.08]' },
  running: { label: 'Running', dot: '#60a5fa', cls: 'text-blue-400 bg-blue-500/[0.08] border-blue-500/20' },
  done:    { label: 'Done',    dot: '#4ade80', cls: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' },
  failed:  { label: 'Failed',  dot: '#f87171', cls: 'text-red-400 bg-red-500/[0.08] border-red-500/20' },
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const c = C[status] ?? C.queued
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${c.cls}`}>
      <span
        className={status === 'running' ? 'live-pulse' : ''}
        style={{ width: 5, height: 5, borderRadius: '99px', background: c.dot, display: 'inline-block', flexShrink: 0 }}
      />
      {c.label}
    </span>
  )
}
