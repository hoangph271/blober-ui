import { FunctionComponent } from 'react'
import styled from 'styled-components'
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
      className={className}
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
  width: 20rem;
  height: 20rem;
  display: flex;
  border-radius: 0.4rem;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);

  .card-cover {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .card-title {
    background-color: rgba(125, 125, 125, 0.25);
    text-align: center;
    line-height: 2rem;
    height: 2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0.2rem 0.5rem;
    border-bottom-left-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
    transform: scale(1.04);

    .card-title {
      text-decoration: underline;
      font-weight: bold;
    }
  }
`

export { StyledCard as Card }
