import { ComponentType } from 'react'
import { Redirect } from 'react-router'
import { useAuth } from '../../hooks'
import { FullGrowLoader } from '../full-grow-loader'

export const withAuthRequired = <T extends any>(Component: ComponentType<T>) => {
  return (props: T) => {
    const { isAuthed, isLoading } = useAuth()

    if (isLoading) {
      return <FullGrowLoader />
    }

    return isAuthed ? (
      <Component {...props as any} />
    ) : (
      <Redirect to="login" />
    )
  }
}
