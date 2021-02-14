import styled from 'styled-components'
import Loader from 'react-loader-spinner'
import { OptionalClassname } from '../interfaces'

const FullGrowLoader = (props: OptionalClassname) => {
  const { className } = props

  return (
    <div className={className}>
      <Loader type="BallTriangle" color="#00cec9" />
    </div>
  )
}

const StyledFullGrowLoader = styled(FullGrowLoader)`
  
`

export {
  StyledFullGrowLoader as FullGrowLoader
}
