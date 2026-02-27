'use client'

import { usePathname } from 'next/navigation'

const TITLES: Record<string, { label: string; desc: string }> = {
  '/':          { label: 'Overview',       desc: 'Automation stats and recent activity' },
  '/districts': { label: 'Ready to Use Pages', desc: 'All district Facebook pages — live and ready' },
  '/movies':    { label: 'Movie Pages',    desc: 'Create and manage movie FB pages' },
  '/jobs':      { label: 'Job History',    desc: 'All automation runs and logs' },
}

export function TopBar() {
  const path  = usePathname()
  const meta  = TITLES[path] ?? TITLES['/']
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#09090b]/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
      <div className="flex items-baseline gap-3">
        <h1 className="text-[15px] font-semibold text-white tracking-tight">{meta.label}</h1>
        <span className="text-[12px] text-[#52525b] hidden md:block">{meta.desc}</span>
      </div>
      <p className="text-[12px] text-[#3f3f46]">{today}</p>
    </header>
  )
}
