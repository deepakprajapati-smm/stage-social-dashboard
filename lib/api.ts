import type {
  Job,
  DistrictsMap,
  MoviePagesMap,
  CreateMovieRequest,
  CreateMovieResponse,
  SetupDistrictResponse,
  ChromeStatus,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
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
  return `${API_URL}/api/jobs/${jobId}/stream`
}
