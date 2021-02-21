import { useEffect, RefObject } from "react"

export const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, onClickOutside: (e: MouseEvent) => void) => {
  useEffect(() => {
    const handleClicked = (e: MouseEvent) => {
      const isClickedOutside = !ref.current?.contains((e.target as any))

      if (isClickedOutside) {
        onClickOutside(e)
      }
    }

    document.addEventListener('click', handleClicked)

    return () => document.removeEventListener('click', handleClicked)
  }, [onClickOutside])
}
