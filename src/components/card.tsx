import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { devices } from '../constants'
import { OptionalClassname } from '../interfaces'

type CardProps = {
  title: string
  coverUrls: string[]
  onClick?(): void
} & OptionalClassname
const Card: FunctionComponent<CardProps> = (props) => {
  const { className, title, coverUrls, onClick, children } = props
  const backgroundImage = coverUrls.map((url) => `url("${url}")`).join(', ')

  return (
    <figure
      onClick={onClick}
      className={`${className} inset-shadow`}
    >
      <div
        className="card-cover"
        style={{ backgroundImage }}
      >
        {children}
      </div>
      <figcaption className="card-title">
        {title}
      </figcaption>
    </figure>
  )
}

const StyledCard = styled(Card)`
  margin: 1rem;
  display: flex;
  border-radius: 0.4rem;
  flex-direction: column;
  width: 10rem;
  height: 10rem;
  max-width: calc(50% - 1rem);
  margin: 0.4rem;

  @media ${devices.mobileL} {
    width: 14rem;
    height: 14rem;
  }

  @media ${devices.tablet} {
    width: 18rem;
    height: 18rem;
    margin: 1rem;
  }

  .card-cover {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .card-title {
    word-break: break-all;
    background-color: rgba(125, 125, 125, 0.25);
    text-align: center;
    line-height: 2rem;
    height: 2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0.2rem 0.5rem;
    border-bottom-left-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
    border-top:1px solid rgba(0, 0, 0, 0.62);
  }

  &:hover {
    cursor: pointer;
    transform: scale(1.04);

    .card-title {
      text-decoration: underline;
      font-weight: bold;
    }
  }
`

export { StyledCard as Card }
