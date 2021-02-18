import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from 'react'
import { useGet, usePost } from './use-apis'
import Cookies from 'js-cookie'

type AuthResponse = {
  token: string
}

type AuthContextProviderProps = {
  children: ReactChildren | ReactChild
}
type AuthContextValue = {
  signOut(): void
  isAuthed: boolean
  isLoading: boolean
  signIn(username: string, password: string): void
}
const AuthContext = createContext<AuthContextValue>((null as unknown) as AuthContextValue)
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuthed, setIsAuthed] = useState(!!Cookies.get('Authentication'))
  const getAuth = useGet({ url: 'auth', initRun: isAuthed })
  const postAuth = usePost<AuthResponse>({ url: 'auth', initRun: false })

  useEffect(() => {
    if (getAuth.isLoading) return
    setIsAuthed(!!getAuth.data)
  }, [getAuth.isLoading, getAuth.data])

  useEffect(() => {
    if (postAuth.isLoading) return

    setIsAuthed(!!postAuth.data)
    Cookies.set('Authentication', postAuth.data?.token ?? '')
  }, [postAuth.isLoading, postAuth.data])

  const signOut = useCallback(() => {
    Cookies.remove('Authentication')
    setIsAuthed(false)
  }, [])

  const signIn = useCallback((username: string, password: string) => {
    const body = JSON.stringify({ username, password })
    postAuth.startFetching(body)
  }, [postAuth.startFetching])

  const value: AuthContextValue = {
    signIn,
    signOut,
    isAuthed,
    isLoading: getAuth.isLoading || postAuth.isLoading
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
