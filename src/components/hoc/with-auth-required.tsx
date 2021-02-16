import { ComponentType } from 'react'
import { Redirect } from 'react-router'
import { useAuth } from '../../hooks'

export const withAuthRequired = <T extends any>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isAuthed } = useAuth()

    return isAuthed ? (
      <Component {...props as any} />
    ) : (
      <Redirect to="login" />
    )
  }
}
