import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type CardProps = {
  title: string
  coverUrl: string
  onClick?(): void
} & OptionalClassname
const Card = (props: CardProps) => {
  const { className, title, coverUrl, onClick } = props

  return (
    <figure
      onClick={onClick}
      className={className}
      style={{
        backgroundImage: `url(${coverUrl})`
      }}
    >
      <figcaption className="card-title">
        {title}
      </figcaption>
    </figure>
  )
}

const StyledCard = styled(Card)`
  width: 300px;
  height: 300px;
  background-size: cover;
  background-position-x: center;
  background-position-y: top;
  position: relative;
  margin: 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  border-radius: 0.1rem;

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
    transform: scale(1.04);
  }

  .card-title {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.65);
    padding: 0.2rem 0;
    bottom: 0;
    top: unset;
  }
`

export { StyledCard as Card }
