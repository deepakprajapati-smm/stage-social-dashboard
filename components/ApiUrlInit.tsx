'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function ApiUrlInit() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const apiUrl = searchParams.get('api')
    if (apiUrl) {
      localStorage.setItem('stage_api_url', apiUrl)
      // Clean URL without reload
      const url = new URL(window.location.href)
      url.searchParams.delete('api')
      window.history.replaceState({}, '', url)
    }
  }, [searchParams])

  return null
}
