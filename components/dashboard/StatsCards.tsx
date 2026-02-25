import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Job } from '@/lib/types'

interface StatsCardsProps {
  jobs: Job[]
}

export function StatsCards({ jobs }: StatsCardsProps) {
  const total   = jobs.length
  const running = jobs.filter((j) => j.status === 'running').length
  const done    = jobs.filter((j) => j.status === 'done').length
  const failed  = jobs.filter((j) => j.status === 'failed').length

  const stats = [
    { label: 'Total Jobs',  value: total,   color: 'text-white' },
    { label: 'Running',     value: running, color: 'text-blue-400' },
    { label: 'Completed',   value: done,    color: 'text-green-400' },
    { label: 'Failed',      value: failed,  color: 'text-red-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value, color }) => (
        <Card key={label} className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-zinc-500 font-medium">{label}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
