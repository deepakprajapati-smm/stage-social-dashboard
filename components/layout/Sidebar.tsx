'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, Film, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/districts', label: 'Districts', icon: MapPin },
  { href: '/movies',    label: 'Movies',    icon: Film },
  { href: '/jobs',      label: 'Jobs',      icon: Briefcase },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0e0e0e] border-r border-white/[0.06]">

      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          {/* STAGE brand mark */}
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs tracking-tighter leading-none">S</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-wide">STAGE</p>
            <p className="text-zinc-500 text-[10px] leading-none mt-0.5 tracking-widest uppercase">Social</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-orange-500/10 text-orange-400'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]',
              )}
            >
              {/* Active indicator bar */}
              <span
                className={cn(
                  'absolute left-0 w-0.5 h-5 rounded-r-full bg-orange-500 transition-all duration-200',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              />
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  active ? 'text-orange-400' : 'text-zinc-600 group-hover:text-zinc-400',
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[11px] text-zinc-600">v3.0.0 · Running</span>
        </div>
      </div>
    </aside>
  )
}
