import { Redirect } from 'react-router'
import { useAuth } from '../hooks'

export const Profile = () => {
  const { isAuthed, signOut } = useAuth()

  return isAuthed ? (
    <section>
      <button onClick={signOut}>
        {'Sign out'}
      </button>
    </section>
  ) : (
    <Redirect to="login" />
  )
}
