import { useEffect } from 'react'

type useKeyupParams = {
  key: string
  onKeypressed: (e: KeyboardEvent) => void
}
export const useKeyup = (params: useKeyupParams) => {
  const { key, onKeypressed } = params

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      e.key === key && onKeypressed(e)
    }

    window.addEventListener('keyup', handleKeypress)
    return () => window.removeEventListener('keyup', handleKeypress)
  }, [key, onKeypressed])
}
