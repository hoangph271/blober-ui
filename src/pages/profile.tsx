import { Redirect } from 'react-router'
import { withDefaultHeader } from '../components'
import { useAuth } from '../hooks'

const Profile = () => {
  const { isAuthed, signOut } = useAuth()

  return isAuthed ? (
    <section>
      <button onClick={signOut}>
        {'Sign out'}
      </button>
    </section>
  ) : (
    <Redirect to="/login" />
  )
}

const ProfileWithHeader = withDefaultHeader(Profile)

export { ProfileWithHeader as Profile }
