import { useCallback, useEffect, useState } from 'react'
import { API_ROOT } from '../constants'

/* eslint-disable no-unused-vars */
export enum ApiStates {
  NOT_STARTED,
  STARTED,
  RUNNING,
  FINISHED,
  ERROR,
}

const parseResponseData = async (res: Response) => {
  const contentType = res.headers.get('content-type')
  switch (true) {
    case contentType?.startsWith('application/json;'): {
      return res.json()
    }
    default: {
      return await res.blob()
    }
  }
}

type useGetParams = {
  url: string,
  initRun?: boolean,
}
export const useGet = <T extends any>(params: useGetParams) => {
  const [apiState, setApiState] = useState<ApiStates>(params.initRun ? ApiStates.STARTED : ApiStates.NOT_STARTED)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | undefined>()

  const getApi = useCallback(async () => {
    const { url } = params

    return fetch(`${API_ROOT}/${url}`)
  }, [params])

  useEffect(() => {
    if (apiState !== ApiStates.STARTED) return

    setApiState(ApiStates.RUNNING)

    getApi()
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text())
        }

        setError(null)
        setData(await parseResponseData(res))
        setApiState(ApiStates.FINISHED)
      })
      .catch((error: Error) => {
        setData(undefined)
        setError(error)
        setApiState(ApiStates.ERROR)
      })
  }, [getApi, apiState])

  const startFetching = useCallback(() => setApiState(ApiStates.STARTED), [])

  return {
    isLoading: [ApiStates.RUNNING, ApiStates.STARTED].includes(apiState),
    startFetching,
    apiState,
    error,
    data
  }
}

type HttpBody = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null
type usePostParams = useGetParams & {
  body?: HttpBody,
  contentType?: 'application/json'
}
export const usePost = <T extends any>(params: usePostParams) => {
  const [apiState, setApiState] = useState<ApiStates>(params.initRun ? ApiStates.STARTED : ApiStates.NOT_STARTED)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)
  const [body, setBody] = useState(params.body)

  const postApi = useCallback(async () => {
    const { url, contentType = 'application/json' } = params

    return fetch(`${API_ROOT}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType
      },
      body
    })
  }, [params, body])

  useEffect(() => {
    if (apiState !== ApiStates.STARTED) return

    setApiState(ApiStates.RUNNING)

    postApi()
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text())
        }

        setError(null)
        setData(await parseResponseData(res))
        setApiState(ApiStates.FINISHED)
      })
      .catch((error: Error) => {
        setData(null)
        setError(error)
        setApiState(ApiStates.ERROR)
      })
  }, [postApi, apiState])

  const startFetching = useCallback((body?: HttpBody) => {
    setBody(body)
    setApiState(ApiStates.STARTED)
  }, [])

  return {
    startFetching,
    apiState,
    isLoading: [ApiStates.RUNNING, ApiStates.STARTED].includes(apiState),
    error,
    data
  }
}
