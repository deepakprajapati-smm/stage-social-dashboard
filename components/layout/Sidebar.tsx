'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, Film, Clock, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import useSWR from 'swr'
import { getStatus } from '@/lib/api'
import type { ChromeStatus } from '@/lib/types'

const NAV = [
  { href: '/',          label: 'Overview',  icon: LayoutDashboard },
  { href: '/districts', label: 'Pages',     icon: MapPin },
  { href: '/movies',    label: 'Movies',    icon: Film },
  { href: '/jobs',      label: 'Jobs',      icon: Clock },
]

export function Sidebar() {
  const path  = usePathname()
  const { data } = useSWR<ChromeStatus>('/api/status', getStatus, { refreshInterval: 10000 })
  const ready = data?.chrome_ready

  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0c0c0e]">

      {/* Logo area */}
      <div className="px-4 h-14 flex items-center border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
            style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}
          >
            S
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-semibold text-white tracking-tight">STAGE</p>
            <p className="text-[10px] text-[#52525b] mt-0.5">Social Automation</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-widest px-2 mb-2">Navigation</p>
        <div className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-100 group',
                  active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/[0.04]',
                )}
              >
                <Icon className={cn('w-[15px] h-[15px] shrink-0', active ? 'text-white' : 'text-[#52525b] group-hover:text-[#71717a]')} />
                {label}
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-white opacity-60" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer — Chrome status */}
      <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
        <div className={cn(
          'flex items-center gap-2 px-2.5 py-2 rounded-md text-[12px]',
          ready === true ? 'bg-emerald-500/[0.08]' : ready === false ? 'bg-red-500/[0.08]' : '',
        )}>
          <Activity className={cn(
            'w-3.5 h-3.5 shrink-0',
            ready === undefined ? 'text-[#52525b]' : ready ? 'text-emerald-400' : 'text-red-400',
          )} />
          <div className="leading-none">
            <p className={cn(
              'font-medium',
              ready === undefined ? 'text-[#52525b]' : ready ? 'text-emerald-400' : 'text-red-400',
            )}>
              {ready === undefined ? 'Connecting...' : ready ? 'Chrome Ready' : 'Chrome Offline'}
            </p>
          </div>
          {ready === true && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse" />}
        </div>
      </div>
    </aside>
  )
}
