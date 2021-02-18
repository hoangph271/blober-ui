import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LoginForm } from '../components'
import { useAuth } from '../hooks'

export const Login = () => {
  const history = useHistory()
  const { isAuthed } = useAuth()

  useEffect(() => {
    if (isAuthed) return history.push('/')
  }, [isAuthed, history])

  return <LoginForm />
}
