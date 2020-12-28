import React, { useCallback, useContext, useEffect, useState } from 'react';
import './App.css';

const API_ROOT = 'http://localhost:3000'
const useApiState = <T extends any>(initRun?: boolean) => {
  const [isLoading, setIsLoading] = useState(initRun)
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
const useApi = <T extends any>(params: useApiParams) => {
  const { initRun = false, url, raw = false, method = 'GET', withAuth = true } = params;
  const { isLoading, setIsLoading, error, setError, data, setData } = useApiState<T>(initRun)
  const [started, setStarted] = useState(false)

  const { createOptions } = useFetchOptions({ method, withAuth })

  const startFetching = useCallback(async (body?: string | object) => {
    try {
      setIsLoading(true)

      const res = await fetch(`${API_ROOT}/${url}`, createOptions({ body, method }))
      const data = await (raw ? res.blob() : res.json())

      setData(data)
      return data
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [createOptions, method, raw, setData, setError, setIsLoading, url])

  useEffect(() => {
    if (started) return

    if (initRun) {
      setStarted(true)
      startFetching()
    }
  }, [initRun, startFetching, setStarted, started])

  return {
    isLoading,
    data,
    error,
    startFetching,
  }
}

type AuthContextProviderProps = {
  children: React.ReactChildren | React.ReactChild
}
type AuthContextValue = {
  token: string | null,
  storeToken(token: string): void,
  clearToken(): void,
  isAuthed: boolean,
}
const STORAGE_TOKEN_KEY = 'STORAGE_TOKEN_KEY'
const AuthContext = React.createContext<AuthContextValue>((null as unknown) as AuthContextValue)
const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(STORAGE_TOKEN_KEY))

  const storeToken = (token: string) => {
    setToken(token)
    localStorage.setItem(STORAGE_TOKEN_KEY, token)
  }

  const clearToken = () => {
    setToken(null)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
  }


  const value: AuthContextValue = {
    token,
    storeToken,
    clearToken,
    isAuthed: Boolean(token),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
const useAuth = () => {
  return useContext<AuthContextValue>(AuthContext)
}
type Pic = {
  uuid: string,
  title: string,
  blobUuid: string,
}
type Album = {
  uuid: string,
  title: string,
  picsCount: number,
  pics: Pic[]
}
const LoginForm = () => {
  const [username, setUsername] = useState('username')
  const [password, setPassword] = useState('password')
  const { startFetching, data } = useApi({ url: 'auth', method: 'POST' })
  const { storeToken } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startFetching({ username, password })
  }

  useEffect(() => {
    data && storeToken((data as any).token)
  }, [data, storeToken])

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button type="submit">
        {'Login'}
      </button>
    </form>
  )
}

type AuthedImgProps = {
  url: string,
  alt?: string
}
const AuthedImg = ({ url, alt = '' }: AuthedImgProps) => {
  const { data } = useApi<Blob>({ url, raw: true, initRun: true })
  // TODO: Handle error...?

  if (!data) return (
    <div>
      {'Loading...!'}
    </div>
  )

  return (
    <img 
      alt={alt}
      src={URL.createObjectURL(data)}
      style={{
        maxWidth: '100%',
      }}
    />
  )
}

type AlbumResponse = {
  albums: Album[],
}
const Albums = () => {
  const { data, isLoading } = useApi<AlbumResponse>({ url: 'albums', initRun: true })

  return (
    <div>
      {isLoading ? (
        <div>{'Loading...'}</div>
      ) : (
        <ul style={{
          listStyle: 'none',
          margin: 0,
          display: 'flex',
          padding: 0,
          maxWidth: '100vw',
          boxSizing: 'border-box',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
          {data?.albums.map(album => (
            <li key={album.uuid} style={{
              width: '400px',
            }}>
              <div>
                {album.title} - {album.picsCount}
              </div>
              <AuthedImg
                url={`blobs/raw/${album.pics[0].blobUuid}?size=400`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function App() {
  const { isAuthed } = useAuth()

  return (
    <div className="App">
      {isAuthed ? (
        <Albums />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

const AppWithContext = () => {
  return (
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  )
}

export default AppWithContext;
