'use client'

import { useEffect, useRef } from 'react'
import type { StreamStatus } from '@/hooks/useJobStream'

interface LogTerminalProps {
  logs: string[]
  status: StreamStatus
  fbUrl?: string | null
}

export function LogTerminal({ logs, status, fbUrl }: LogTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-black rounded-lg border border-zinc-700 font-mono text-xs overflow-hidden flex flex-col h-80">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-zinc-500 text-[11px]">
          {status === 'running' ? '● Live' : status === 'done' ? '✓ Done' : status === 'error' ? '✗ Failed' : 'Terminal'}
        </span>
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {logs.length === 0 && status === 'running' && (
          <p className="text-zinc-500 animate-pulse">Waiting for output...</p>
        )}
        {logs.map((line, i) => (
          <div
            key={i}
            className={`leading-5 whitespace-pre-wrap break-all ${
              line.includes('SUCCESS') || line.includes('✅')
                ? 'text-green-400'
                : line.includes('FAILED') || line.includes('❌') || line.includes('[ERR]') || line.includes('ERROR')
                ? 'text-red-400'
                : line.includes('⚠️')
                ? 'text-yellow-400'
                : 'text-zinc-300'
            }`}
          >
            {line}
          </div>
        ))}
        {status === 'done' && fbUrl && (
          <div className="mt-2 text-green-400">
            FB Page:{' '}
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-300"
            >
              {fbUrl}
            </a>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
