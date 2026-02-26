import type { Job } from '@/lib/types'

interface StatsCardsProps {
  jobs: Job[]
  districtCount?: number
  movieCount?: number
}

export function StatsCards({ jobs, districtCount = 0, movieCount = 0 }: StatsCardsProps) {
  const running     = jobs.filter(j => j.status === 'running').length
  const done        = jobs.filter(j => j.status === 'done').length
  const failed      = jobs.filter(j => j.status === 'failed').length
  const successRate = jobs.length > 0 ? Math.round((done / jobs.length) * 100) : 0

  const cards = [
    {
      value: districtCount.toString(),
      label: 'District Pages',
      sub: 'All setup_done',
      color: '#f97316',
      bar: 100,
    },
    {
      value: movieCount.toString(),
      label: 'Movie Pages',
      sub: 'Total created',
      color: '#a855f7',
      bar: Math.min((movieCount / 20) * 100, 100),
    },
    {
      value: running > 0 ? running.toString() : '—',
      label: 'Running Now',
      sub: running > 0 ? 'Jobs in progress' : 'Queue is idle',
      color: running > 0 ? '#3b82f6' : '#3f3f46',
      bar: 0,
    },
    {
      value: `${successRate}%`,
      label: 'Success Rate',
      sub: `${done} done · ${failed} failed`,
      color: successRate >= 70 ? '#22c55e' : successRate >= 40 ? '#eab308' : '#ef4444',
      bar: successRate,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ value, label, sub, color, bar }) => (
        <div
          key={label}
          className="card-glow group relative rounded-xl border border-white/[0.07] bg-[#0f0f11] p-5 overflow-hidden cursor-default"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

          {/* Value */}
          <p className="text-[32px] font-bold tracking-tight leading-none" style={{ color }}>{value}</p>

          {/* Label */}
          <p className="text-[13px] font-medium text-white/70 mt-2">{label}</p>
          <p className="text-[11px] text-[#52525b] mt-0.5">{sub}</p>

          {/* Progress bar */}
          {bar > 0 && (
            <div className="mt-4 h-px w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${bar}%`, background: color, opacity: 0.6 }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
