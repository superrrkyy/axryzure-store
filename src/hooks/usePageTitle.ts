import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — AXRYZURE Store` : 'AXRYZURE Store — Premium Digital Goods for Creators'
  }, [title])
}
