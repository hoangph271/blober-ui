import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useGet, usePost } from './use-apis'

type AuthResponse = {
  token: string
}

type AuthContextProviderProps = {
  children: ReactChildren | ReactChild
}
type AuthContextValue = {
  isAuthed: boolean
  isLoading: boolean
  revokeAuth(): void
  attemptLogin(username: string, password: string): void
}
const AuthContext = createContext<AuthContextValue>((null as unknown) as AuthContextValue)
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuthed, setIsAuthed] = useState(false)
  const getAuth = useGet({ url: 'auth', initRun: true })
  const postAuth = usePost<AuthResponse>({ url: 'auth', initRun: false })

  const revokeAuth = useCallback(() => {
    getAuth.startFetching()
  }, [getAuth])

  useEffect(() => {
    if (postAuth.isLoading) return

    if (postAuth.data) {
      const { token } = postAuth.data
      document.cookie = `Authentication=${token}`
      revokeAuth()
    }
  }, [postAuth, revokeAuth])

  useEffect(() => {
    if (getAuth.isLoading) return
    setIsAuthed(!!getAuth.data)
  }, [getAuth])

  const value: AuthContextValue = {
    isAuthed,
    isLoading: getAuth.isLoading || postAuth.isLoading,
    revokeAuth,
    attemptLogin (username: string, password: string) {
      const body = JSON.stringify({ username, password })
      postAuth.startFetching(body)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  return useContext<AuthContextValue>(AuthContext) || {}
}
