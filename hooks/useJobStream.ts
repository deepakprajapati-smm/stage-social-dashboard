'use client'

import { useState, useEffect, useRef } from 'react'
import { getJobStreamUrl } from '@/lib/api'
import type { SSELogEvent } from '@/lib/types'

export type StreamStatus = 'idle' | 'running' | 'done' | 'error'

export interface UseJobStreamResult {
  logs: string[]
  status: StreamStatus
  fbUrl: string | null
}

export function useJobStream(jobId: string | null): UseJobStreamResult {
  const [logs, setLogs] = useState<string[]>([])
  const [status, setStatus] = useState<StreamStatus>('idle')
  const [fbUrl, setFbUrl] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!jobId) return

    // Reset state
    setLogs([])
    setStatus('running')
    setFbUrl(null)

    const url = getJobStreamUrl(jobId)
    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as SSELogEvent

        if (data.heartbeat) return

        if (data.log) {
          setLogs((prev) => [...prev, data.log!])
        }

        if (data.done) {
          setStatus(data.status === 'success' ? 'done' : 'error')
          if (data.fb_url) setFbUrl(data.fb_url)
          es.close()
        }
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      setStatus('error')
      es.close()
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [jobId])

  return { logs, status, fbUrl }
}
