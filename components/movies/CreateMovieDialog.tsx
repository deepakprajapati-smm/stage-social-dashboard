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
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="w-4 h-4 mr-1.5" />
        Create New
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Create Movie FB Page</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Creates a Facebook fan/distribution page for the movie title. Auto-generates
              page name if left blank.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="movie-title" className="text-zinc-300">
                Movie Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="movie-title"
                placeholder="e.g. Saanwari"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="page-name" className="text-zinc-300">
                Page Name{' '}
                <span className="text-zinc-600 font-normal">(optional — auto-generated if empty)</span>
              </Label>
              <Input
                id="page-name"
                placeholder="e.g. Saanwari Fan Page"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-950/40 border border-red-900 rounded px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !movieTitle.trim()}
              >
                {loading ? 'Creating...' : 'Create FB Page'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
