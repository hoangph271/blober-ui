import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

const API_ROOT = 'http://192.168.0.102:3000'
const useApiState = <T extends any>(initRun?: boolean) => {
  const [isLoading, setIsLoading] = useState(Boolean(initRun))
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  return {
    isLoading,
    setIsLoading,
    data,
    setData,
    error,
    setError,
  }
}
type HttpMethods = 'GET' | 'POST' | 'DELETE' | 'PATCH'
type useFetchOptionsParam = {
  body?: string | ArrayBuffer | object,
  method: HttpMethods,
  contentType?: string,
  withAuth?: boolean,
}
const useFetchOptions = (initParams: useFetchOptionsParam) => {
  const { method, } = initParams
  const { token } = useAuth()

  const createOptions = useCallback((params: useFetchOptionsParam) => {
    const { body, contentType, withAuth = true } = {
      ...initParams,
      ...params,
    }

  
    const contentTypeHeader = contentType
      || (method !== 'GET' && { 'Content-Type': 'application/json' })
    const authHeader = (withAuth && token) && { 'Authorization': `Bearer ${token}` }

    const options: RequestInit = {
      body: typeof body === 'object' ? JSON.stringify(body) : body,
      method,
      headers: {
        ...typeof contentTypeHeader === 'object' && contentTypeHeader,
        ...typeof authHeader === 'object' && authHeader,
      }
    }

    return options
  }, [initParams, method, token])

  return { createOptions }
}
type useApiParams = {
  initRun?: boolean,
  url: string,
  raw?: boolean,
  contentType?: string,
  method?: HttpMethods,
  body?: string | ArrayBuffer | object,
  withAuth?: boolean,
}

export const useApi = <T extends any>(params: useApiParams) => {
  const { initRun = false, raw = false, method = 'GET', withAuth = true } = params;
  const { isLoading, setIsLoading, error, setError, data, setData } = useApiState<T>(initRun)
  const [started, setStarted] = useState(false)

  const { createOptions } = useFetchOptions({ method, withAuth })

  const fetchApi = useCallback(async (overloadParams?: useApiParams): Promise<{ data: T | null, error: T | null }> => {
    try {
      const { body, url } = {
        ...params,
        ...overloadParams,
      }

      setIsLoading(true)

      const res = await fetch(`${API_ROOT}/${url}`, createOptions({
        body,
        method
      }))
      const data = await (raw ? res.blob() : res.json())

      if (!res.ok) {
        setError(data)
        return { data: null, error: data }
      }

      setData(data)
      return { data, error: null }
    } catch (error) {
      console.error(error)
      setError(error)
      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }, [createOptions, method, raw, setData, setError, setIsLoading, params])

  useEffect(() => {
    if (started) return

    if (initRun) {
      setStarted(true)
      fetchApi(params)
    }
  }, [initRun, fetchApi, setStarted, started, params])

  return {
    isLoading,
    data,
    error,
    fetchApi,
  }
}
