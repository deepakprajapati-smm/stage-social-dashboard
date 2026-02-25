'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, Film, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/districts',  label: 'Districts',  icon: MapPin },
  { href: '/movies',     label: 'Movies',     icon: Film },
  { href: '/jobs',       label: 'Jobs',       icon: Briefcase },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <span className="text-white font-bold text-lg tracking-tight">STAGE</span>
        <span className="ml-1.5 text-xs text-zinc-500">Social</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-3 border-t border-zinc-800 text-[11px] text-zinc-600">
        v3.0.0
      </div>
    </aside>
  )
}
