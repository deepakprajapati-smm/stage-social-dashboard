'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMoviePage } from '@/lib/api'

interface CreateMovieDialogProps {
  onJobCreated: (jobId: string, title: string) => void
}

export function CreateMovieDialog({ onJobCreated }: CreateMovieDialogProps) {
  const [open, setOpen]         = useState(false)
  const [movieTitle, setMovieTitle] = useState('')
  const [pageName, setPageName] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!movieTitle.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await createMoviePage({
        movie_title: movieTitle.trim(),
        page_name: pageName.trim() || undefined,
      })
      onJobCreated(res.job_id, movieTitle.trim())
      setOpen(false)
      setMovieTitle('')
      setPageName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-lg shadow-orange-500/20"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Create New
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#111] border-white/[0.08] text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create Movie FB Page</DialogTitle>
            <DialogDescription className="text-zinc-500 text-sm">
              Creates a Facebook fan page for the movie. Page name auto-generated if left blank.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label htmlFor="movie-title" className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
                Movie Title <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="movie-title"
                placeholder="e.g. Saanwari"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="bg-zinc-900 border-white/[0.08] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-orange-500/20"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="page-name" className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
                Page Name <span className="text-zinc-700 normal-case">(optional)</span>
              </Label>
              <Input
                id="page-name"
                placeholder="e.g. Saanwari Fan Page — auto if empty"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="bg-zinc-900 border-white/[0.08] text-zinc-100 placeholder:text-zinc-700 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠ {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !movieTitle.trim()}
                className="bg-orange-500 hover:bg-orange-400 text-white border-0 disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating...
                  </span>
                ) : 'Create FB Page'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
