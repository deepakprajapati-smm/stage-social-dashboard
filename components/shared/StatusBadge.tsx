import { Badge } from '@/components/ui/badge'
import type { JobStatus } from '@/lib/types'

const CONFIG: Record<JobStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  queued:  { label: 'Queued',  variant: 'secondary' },
  running: { label: 'Running', variant: 'default' },
  done:    { label: 'Done',    variant: 'outline' },
  failed:  { label: 'Failed',  variant: 'destructive' },
}

export function StatusBadge({ status }: { status: JobStatus }) {
  const cfg = CONFIG[status] ?? { label: status, variant: 'secondary' as const }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
