import { ComponentType } from 'react'
import { Link } from 'react-router-dom'

export const withDefaultHeader = (Component?: ComponentType<any>) => {
  return (
    <div>
      <header>
        <Link to="/profile">
          Profile
        </Link>
      </header>
      {Component && <Component />}
    </div>
  )
}
