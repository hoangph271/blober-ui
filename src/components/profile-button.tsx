import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type ProfileButtonProps = {} & OptionalClassname
const ProfileButton = (props: ProfileButtonProps) => {
  const { className } = props
  // ! FIXME: Use user URL
  const AVATAR_URL = 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png'

  return (
    <Link
      to="/profile"
      className={className}
      style={{
        backgroundImage: `url(${AVATAR_URL})`
      }}
    >
    </Link>
  )
}

const StyledProfileButton = styled(ProfileButton)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-size: contain;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.62);
`

export { StyledProfileButton as ProfileButton }
