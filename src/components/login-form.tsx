import { useEffect, useState } from "react"
import { useApi, useAuth } from "../hooks"

export const LoginForm = () => {
  const [username, setUsername] = useState('username')
  const [password, setPassword] = useState('password')
  const { startFetching, data } = useApi({ url: 'auth', method: 'POST' })
  const { storeToken } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startFetching({ username, password })
  }

  useEffect(() => {
    data && storeToken((data as any).token)
  }, [data, storeToken])

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button type="submit">
        {'Login'}
      </button>
    </form>
  )
}