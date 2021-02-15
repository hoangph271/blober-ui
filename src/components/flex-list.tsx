import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { OptionalClassname } from '../interfaces'

type FlexListProps = {
} & OptionalClassname
const FlexList: FunctionComponent<FlexListProps> = (props) => {
  const { className, children } = props

  return (
    <section className={className}>
      {children}
    </section>
  )
}

const StyledFlexList = styled(FlexList)`
  display: flex;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100vw;
`

export { StyledFlexList as FlexList }
