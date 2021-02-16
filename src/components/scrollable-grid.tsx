import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type ScrollableGridProps = {
} & OptionalClassname
const ScrollableGrid: FunctionComponent<ScrollableGridProps> = (props) => {
  const { className, children } = props

  return (
    <section className={className}>
      {children}
    </section>
  )
}

const StyledScrollableGrid = styled(ScrollableGrid)`
  display: flex;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100vw;
`

export { StyledScrollableGrid as ScrollableGrid }
