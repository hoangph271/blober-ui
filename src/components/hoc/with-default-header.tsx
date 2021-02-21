import { ComponentType, FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { OptionalClassname } from '../../interfaces'
import { ProfileButton } from '../profile-button'

const headerNavs = [
  { to: '/files', title: 'Files' },
  { to: '/albums', title: 'Albums' }
]
type DefaultHeaderProps = {} & OptionalClassname
const DefaultHeader: FunctionComponent<DefaultHeaderProps> = (props) => {
  const { className } = props

  return (
    <header className={`${className} inset-shadow`}>
      <ul className="nav-bar">
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
      </ul>
      <ProfileButton />
    </header>
  )
}
const StyledDefaultHeader = styled(DefaultHeader)`
  display: flex;
  justify-content: space-around;
  padding: 0.4rem;

  .nav-bar {
    flex-basis: 0;
    flex-grow: 1;
    display: flex;
    justify-content: space-evenly;

    .nav-url {
      color: black;
      font-weight: bold;  
    }
    .nav-url.active {
      color: darkgray;
      text-decoration: none;
      cursor: default;
    }
  }
`

const ViewWithHeader: FunctionComponent<OptionalClassname> = (props) => {
  const { children, className } = props
  return (
    <div className={className}>
      <StyledDefaultHeader className="header" />
      {children}
    </div>
  )
}
const StyledViewWithHeader = styled(ViewWithHeader)`
  display: flex;
  flex-direction: column;

  .header {
    height: 4rem;
    align-items: center;
  }

  & > :not(.header) {
    height: calc(100vh - 4rem);
  }
`

export const withDefaultHeader = <T extends any>(Component: ComponentType<T>) => {
  return (props: T) => (
    <StyledViewWithHeader>
      <Component {...props as any } />
    </StyledViewWithHeader>
  )
}
