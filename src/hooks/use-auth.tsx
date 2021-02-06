import { createContext, ReactChild, ReactChildren, useContext, useState } from 'react'

type AuthContextProviderProps = {
  children: ReactChildren | ReactChild
}
type AuthContextValue = {
  token: string | null,
  storeToken(token: string): void,
  clearToken(): void,
  isAuthed: boolean,
}
const STORAGE_TOKEN_KEY = 'STORAGE_TOKEN_KEY'
const AuthContext = createContext<AuthContextValue>((null as unknown) as AuthContextValue)
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(STORAGE_TOKEN_KEY))

  const storeToken = (token: string) => {
    setToken(token)
    localStorage.setItem(STORAGE_TOKEN_KEY, token)
    document.cookie = `Authentication=${token}`
  }

  const clearToken = () => {
    setToken(null)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
  }

  const value: AuthContextValue = {
    token,
    storeToken,
    clearToken,
    isAuthed: Boolean(token)
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
