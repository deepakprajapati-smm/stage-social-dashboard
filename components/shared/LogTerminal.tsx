'use client'

import { useEffect, useRef } from 'react'
import type { StreamStatus } from '@/hooks/useJobStream'

interface LogTerminalProps {
  logs: string[]
  status: StreamStatus
  fbUrl?: string | null
}

function lineColor(line: string) {
  if (line.includes('SUCCESS') || line.includes('✅') || line.includes('Done') || line.includes('done'))
    return 'text-green-400'
  if (line.includes('FAILED') || line.includes('❌') || line.includes('[ERR]') || line.includes('ERROR') || line.includes('FATAL'))
    return 'text-red-400'
  if (line.includes('⚠️') || line.includes('warn') || line.includes('WARN'))
    return 'text-yellow-400'
  if (line.startsWith('Starting:') || line.includes('→') || line.includes('Job start'))
    return 'text-blue-400'
  return 'text-zinc-300'
}

export function LogTerminal({ logs, status, fbUrl }: LogTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.07] font-mono text-xs overflow-hidden flex flex-col h-80">
      {/* macOS-style terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-zinc-600 text-[10px] tracking-wide">
          {status === 'running'
            ? '⏳ running...'
            : status === 'done'
            ? '✓ completed'
            : status === 'error'
            ? '✗ failed'
            : 'zsh — magic_button_auto.py'}
        </span>
        <div className="w-14" />
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {logs.length === 0 && status === 'running' && (
          <p className="text-zinc-600 animate-pulse">▊ Waiting for output...</p>
        )}
        {logs.length === 0 && status === 'idle' && (
          <p className="text-zinc-700">No logs yet.</p>
        )}
        {logs.map((line, i) => (
          <div key={i} className={`leading-5 whitespace-pre-wrap break-all ${lineColor(line)}`}>
            <span className="text-zinc-700 select-none mr-2">{String(i + 1).padStart(3, ' ')}</span>
            {line}
          </div>
        ))}
        {status === 'done' && fbUrl && (
          <div className="mt-3 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
            <span className="text-green-600">📎 FB Page → </span>
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300 break-all">
              {fbUrl}
            </a>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
