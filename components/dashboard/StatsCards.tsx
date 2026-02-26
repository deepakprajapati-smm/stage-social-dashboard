import { Layers, Play, CheckCircle2, XCircle } from 'lucide-react'
import type { Job } from '@/lib/types'

interface StatsCardsProps {
  jobs: Job[]
  districtCount?: number
  movieCount?: number
}

export function StatsCards({ jobs, districtCount = 0, movieCount = 0 }: StatsCardsProps) {
  const running = jobs.filter((j) => j.status === 'running').length
  const done    = jobs.filter((j) => j.status === 'done').length
  const failed  = jobs.filter((j) => j.status === 'failed').length
  const successRate = jobs.length > 0 ? Math.round((done / jobs.length) * 100) : 0

  const stats = [
    {
      label: 'District Pages',
      value: `${districtCount}`,
      sub: 'All ready',
      icon: <CheckCircle2 className="w-4 h-4" />,
      accent: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      label: 'Movie Pages',
      value: `${movieCount}`,
      sub: 'Total created',
      icon: <Layers className="w-4 h-4" />,
      accent: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Jobs Running',
      value: `${running}`,
      sub: running > 0 ? 'In progress' : 'All idle',
      icon: <Play className="w-4 h-4" />,
      accent: running > 0 ? 'text-blue-400' : 'text-zinc-500',
      bg: running > 0 ? 'bg-blue-500/10' : 'bg-zinc-500/10',
      border: running > 0 ? 'border-blue-500/20' : 'border-zinc-500/20',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      sub: `${done} done · ${failed} failed`,
      icon: <CheckCircle2 className="w-4 h-4" />,
      accent: successRate >= 80 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400',
      bg: successRate >= 80 ? 'bg-green-500/10' : successRate >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10',
      border: successRate >= 80 ? 'border-green-500/20' : successRate >= 50 ? 'border-yellow-500/20' : 'border-red-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, sub, icon, accent, bg, border }) => (
        <div
          key={label}
          className={`rounded-xl border ${border} ${bg} p-4 flex flex-col gap-3`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} border ${border} ${accent}`}>
            {icon}
          </div>
          <div>
            <p className={`text-2xl font-bold tracking-tight ${accent}`}>{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">{label}</p>
            <p className="text-[11px] text-zinc-700 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
