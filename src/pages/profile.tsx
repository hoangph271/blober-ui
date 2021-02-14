import { useCallback } from 'react'
import { Redirect } from 'react-router'
import { useAuth } from '../hooks'

export const Profile = () => {
  const { clearToken, isAuthed } = useAuth()
  const handleSignOut = useCallback(() => {
    clearToken()
  }, [clearToken])

  if (!isAuthed) return <Redirect to="login" />

  return (
    <section>
      <button onClick={handleSignOut}>Sign out</button>
    </section>
  )
}
