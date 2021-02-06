import { useEffect, useState } from 'react'

export const useViewportSize = () => {
  const [size, setSize] = useState({
    width: document.body.offsetWidth,
    height: document.body.offsetHeight
  })

  useEffect(() => {
    const handleBodyResized = () => {
      setSize({
        width: document.body.offsetWidth,
        height: document.body.offsetHeight
      })
    }

    document.body.addEventListener('resize', handleBodyResized)

    return () => document.body.removeEventListener('resize', handleBodyResized)
  }, [setSize])

  return size
}
