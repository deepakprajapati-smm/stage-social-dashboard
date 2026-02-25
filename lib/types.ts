// ── Job Types ────────────────────────────────────────────────

export type JobStatus = 'queued' | 'running' | 'done' | 'failed'
export type JobType = 'movie' | 'district_setup' | 'legacy'

export interface Job {
  id: string
  title_name: string
  language: string
  genre: string
  status: JobStatus
  fb_url: string | null
  bio_used: string | null
  pic_url: string | null
  logs: string[]
  created_at: string
  updated_at: string
  job_type: JobType | null
  district_key: string | null
  movie_title: string | null
  page_name: string | null
}

// ── District Types ────────────────────────────────────────────

export interface FacebookAccount {
  page_name: string
  page_url: string
  page_id?: string
  status: 'setup_done' | 'setup_partial' | 'created'
  bio?: string
}

export interface DistrictAccount {
  district_name: string
  facebook: FacebookAccount
  youtube?: Record<string, unknown>
}

export type DistrictsMap = Record<string, DistrictAccount>

// ── Movie Page Types ──────────────────────────────────────────

export interface MoviePage {
  page_name: string
  page_url: string
  bio: string
  created_at?: string
}

export type MoviePagesMap = Record<string, MoviePage>

// ── API Request/Response Types ────────────────────────────────

export interface CreateMovieRequest {
  movie_title: string
  page_name?: string
}

export interface CreateMovieResponse {
  job_id: string
  movie_title: string
  page_name: string | null
  status: JobStatus
  created_at: string
}

export interface SetupDistrictResponse {
  job_id: string
  district_key: string
  status: JobStatus
  created_at: string
}

export interface ChromeStatus {
  chrome_ready: boolean
  browser: string | null
  note: string
}

// ── SSE Stream Types ──────────────────────────────────────────

export interface SSELogEvent {
  log?: string
  done?: boolean
  status?: 'success' | 'error'
  fb_url?: string | null
  heartbeat?: boolean
}
