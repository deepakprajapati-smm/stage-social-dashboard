import type {
  Job,
  DistrictsMap,
  MoviePagesMap,
  CreateMovieRequest,
  CreateMovieResponse,
  SetupDistrictResponse,
  ChromeStatus,
} from './types'

function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('stage_api_url')
    if (stored) return stored
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? 'stage-social-2026'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY, ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${path} → ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ── Status ────────────────────────────────────────────────────

export function getStatus(): Promise<ChromeStatus> {
  return apiFetch<ChromeStatus>('/api/status')
}

// ── Districts ─────────────────────────────────────────────────

export function getDistricts(): Promise<DistrictsMap> {
  return apiFetch<DistrictsMap>('/api/districts')
}

export function setupDistrict(districtKey: string): Promise<SetupDistrictResponse> {
  return apiFetch<SetupDistrictResponse>(`/api/districts/${districtKey}/setup`, {
    method: 'POST',
  })
}

// ── Movies ────────────────────────────────────────────────────

export function getMovies(): Promise<MoviePagesMap> {
  return apiFetch<MoviePagesMap>('/api/movies')
}

export function createMoviePage(req: CreateMovieRequest): Promise<CreateMovieResponse> {
  return apiFetch<CreateMovieResponse>('/api/movies', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

// ── Jobs ──────────────────────────────────────────────────────

export function getJobs(): Promise<Job[]> {
  return apiFetch<Job[]>('/api/jobs')
}

export function getJob(jobId: string): Promise<Job> {
  return apiFetch<Job>(`/api/jobs/${jobId}`)
}

export function getJobStreamUrl(jobId: string): string {
  return `${getApiUrl()}/api/jobs/${jobId}/stream`
}
