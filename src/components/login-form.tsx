import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks'
import { usePost } from '../hooks/use-apis'

export const LoginForm = () => {
  const [username, setUsername] = useState('username')
  const [password, setPassword] = useState('password')
  const { startFetching, data, isLoading } = usePost({ url: 'auth' })
  const { storeToken } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startFetching(JSON.stringify({ username, password }))
  }

  useEffect(() => {
    data && storeToken((data as any).token)
  }, [data, storeToken])

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
