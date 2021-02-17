import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks'
export const LoginForm = () => {
  const [username, setUsername] = useState('username')
  const [password, setPassword] = useState('password')
  const { isLoading, attemptLogin } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    attemptLogin(username, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button type="submit" disabled={isLoading}>
        {'Login'}
      </button>
    </form>
  )
}
