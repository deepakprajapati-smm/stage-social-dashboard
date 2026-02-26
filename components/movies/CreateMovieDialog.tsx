'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMoviePage } from '@/lib/api'

export function CreateMovieDialog({ onJobCreated }: { onJobCreated: (jobId: string, title: string) => void }) {
  const [open, setOpen]         = useState(false)
  const [movieTitle, setMovie]  = useState('')
  const [pageName, setPage]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!movieTitle.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await createMoviePage({ movie_title: movieTitle.trim(), page_name: pageName.trim() || undefined })
      onJobCreated(res.job_id, movieTitle.trim())
      setOpen(false); setMovie(''); setPage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3.5 rounded-lg text-[13px] font-medium text-white transition-all"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.25)' }}
      >
        <Plus className="w-3.5 h-3.5" />
        Create New
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0f0f11] border-white/[0.08] text-white max-w-[420px] p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[16px] font-semibold">Create Movie Page</DialogTitle>
            <DialogDescription className="text-[13px] text-[#71717a]">
              Creates a Facebook fan page. Page name is auto-generated if left blank.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-[#52525b] uppercase tracking-widest">
                Movie Title <span className="text-orange-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Saanwari"
                value={movieTitle}
                onChange={e => setMovie(e.target.value)}
                className="h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#3f3f46] text-[13px] focus-visible:ring-orange-500/30 focus-visible:border-orange-500/40"
                autoFocus required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-[#52525b] uppercase tracking-widest">
                Page Name <span className="text-[#3f3f46] normal-case font-normal">(optional)</span>
              </Label>
              <Input
                placeholder="Auto-generated if empty"
                value={pageName}
                onChange={e => setPage(e.target.value)}
                className="h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#3f3f46] text-[13px] focus-visible:ring-orange-500/30 focus-visible:border-orange-500/40"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}
                className="h-8 px-3 text-[13px] text-[#52525b] hover:text-white/70 hover:bg-white/[0.04]">
                Cancel
              </Button>
              <button
                type="submit"
                disabled={loading || !movieTitle.trim()}
                className="flex items-center gap-2 h-8 px-4 rounded-lg text-[13px] font-medium text-white disabled:opacity-40 transition-all"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                {loading
                  ? <><span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />Creating...</>
                  : 'Create FB Page'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
