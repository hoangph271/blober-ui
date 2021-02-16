import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type ScrollableListProps = {
} & OptionalClassname
const ScrollableList: FunctionComponent<ScrollableListProps> = (props) => {
  const { className, children } = props

  return (
    <ul className={className}>
      {children}
    </ul>
  )
}

const StyledScrollableList = styled(ScrollableList)`
  padding: 0;
  display: flex;
  flex-direction: column;
`

export { StyledScrollableList as ScrollableList }
