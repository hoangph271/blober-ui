import { ComponentType } from 'react'
import { Link } from 'react-router-dom'

export const withDefaultHeader = <T extends any>(Component: ComponentType<T>) => {
  return (props: T) => (
    <div>
      <header>
        <Link to="/profile">
          Profile
        </Link>
      </header>
      <Component {...props as any} />
    </div>
  )
}
