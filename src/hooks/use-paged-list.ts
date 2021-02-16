import { useLayoutEffect, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrayResponse } from '../interfaces'
import { useGet } from './use-apis'

type usePagedListParams = {
  getUrl(page: number): string,
  onRefreshed?(): void
}
export const usePagedList = <T extends any>(params: usePagedListParams) => {
  const { onRefreshed, getUrl } = params
  const { search } = useLocation()
  const page = Number.parseInt(new URLSearchParams(search).get('page') || '1')
  const { data, startFetching, isLoading } = useGet<ArrayResponse<T>>({
    url: getUrl(page)
  })

  useLayoutEffect(() => {
    if (typeof page === 'number') onRefreshed?.()
  }, [page])

  useEffect(() => {
    if (Number.isNaN(page)) return
    // TODO: Reject previous fetch...?
    startFetching()
  }, [page, startFetching])

  return {
    page,
    data,
    isLoading
  }
}
