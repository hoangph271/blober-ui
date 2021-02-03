import { useCallback, useEffect, useState } from "react"
import { useAuth } from "."

export enum ApiStates {
  NOT_STARTED,
  STARTED,
  RUNNING,
  FINISHED,
  ERROR,
}

const API_ROOT = 'http://192.168.0.102:3000'

type useGetParams = {
  url: string,
  initRun?: boolean,
}
export const useGet = <T extends any>(params: useGetParams) => {
  const [apiState, setApiState] = useState<ApiStates>(params.initRun ? ApiStates.STARTED : ApiStates.NOT_STARTED)
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { token } = useAuth();

  const getApi = useCallback(async () => {
    const { url } = params

    return fetch(`${API_ROOT}/${url}`, {
      headers: {
        ...token && { 'Authorization': `Bearer ${token}` },
      }
    })
  }, [params, token])

  useEffect(() => {
    if (apiState !== ApiStates.STARTED) return;

    setApiState(ApiStates.RUNNING)

    getApi()
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text())
        }

        const contentType = res.headers.get('content-type');
        switch (true) {
          case contentType?.startsWith('application/json;'): {
            return setData(await res.json())
          }
          default: {
            setData(await res.blob() as T)
          }
        }
        setApiState(ApiStates.FINISHED)
      })
      .catch((error: Error) => {
        setError(error)
        setApiState(ApiStates.ERROR)
      })
  }, [getApi, apiState])

  const startFetching = useCallback(() => setApiState(ApiStates.STARTED), [])

  return {
    startFetching,
    apiState,
    error,
    data,
  }
}
