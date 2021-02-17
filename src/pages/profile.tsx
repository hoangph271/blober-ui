import { useCallback } from 'react'
import { Redirect } from 'react-router'
import { useAuth } from '../hooks'

export const Profile = () => {
  const { isAuthed, revokeAuth } = useAuth()
  const handleSignOut = useCallback(() => {
    document.cookie = ''
    console.info(document.cookie)
    revokeAuth()
  }, [])

  if (!isAuthed) return <Redirect to="login" />

  return (
    <section>
      <button onClick={handleSignOut}>Sign out</button>
    </section>
  )
}
