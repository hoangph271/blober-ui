import { ComponentType, FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { OptionalClassname } from '../../interfaces'

const headerNavs = [
  { to: '/', title: 'Files' },
  { to: '/albums', title: 'Albums' },
  { to: '/profile', title: 'Profile' }
]
type DefaultHeaderProps = {} & OptionalClassname
const DefaultHeader: FunctionComponent<DefaultHeaderProps> = (props) => {
  const { className } = props

  return (
    <header className={className}>
      {headerNavs.map(nav => (
        <NavLink
          exact
          to={nav.to}
          key={nav.to}
          className="nav-url"
          activeClassName="active"
        >
          {nav.title}
        </NavLink>
      ))}
    </header>
  )
}
const StyledDefaultHeader = styled(DefaultHeader)`
  display: flex;
  justify-content: space-around;

  .nav-url {
    color: black;
    font-weight: bold;  
  }
  .nav-url.active {
    color: darkgray;
    text-decoration: none;
    cursor: default;
  }
`
export const withDefaultHeader = <T extends any>(Component: ComponentType<T>) => {
  return (props: T) => (
    <div>
      <StyledDefaultHeader />
      <Component {...props as any} />
    </div>
  )
}
