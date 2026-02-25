'use client'

import { useState } from 'react'
import { ExternalLink, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { setupDistrict } from '@/lib/api'
import type { DistrictsMap } from '@/lib/types'

interface DistrictGridProps {
  districts: DistrictsMap
  onJobCreated: (jobId: string, label: string) => void
}

export function DistrictGrid({ districts, onJobCreated }: DistrictGridProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSetup(key: string) {
    setLoading(key)
    try {
      const res = await setupDistrict(key)
      onJobCreated(res.job_id, `Setup: STAGE ${key.charAt(0).toUpperCase() + key.slice(1)}`)
    } catch (e) {
      console.error('Setup failed:', e)
    } finally {
      setLoading(null)
    }
  }

  const entries = Object.entries(districts)

  if (entries.length === 0) {
    return (
      <p className="text-zinc-600 text-sm py-10 text-center">
        No districts loaded. Make sure the API is running.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([key, account]) => {
        const fb = account.facebook
        const isDone = fb?.status === 'setup_done'
        return (
          <div
            key={key}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-200 font-semibold text-sm">{account.district_name}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{fb?.page_name ?? '—'}</p>
              </div>
              <Badge
                variant={isDone ? 'outline' : 'secondary'}
                className={isDone ? 'text-green-400 border-green-800' : ''}
              >
                {isDone ? '✓ Ready' : fb?.status ?? 'unknown'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {fb?.page_url ? (
                <a
                  href={fb.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  FB Page
                </a>
              ) : (
                <span className="text-zinc-600 text-xs">No FB page yet</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-auto border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 w-full"
              disabled={loading === key}
              onClick={() => handleSetup(key)}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              {loading === key ? 'Starting...' : 'Setup / Refresh'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
