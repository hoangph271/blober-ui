import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useKeyup } from '../hooks'
import { OptionalClassname } from '../interfaces'
import { noOp } from '../utils'

type FullviewDialogProps = {
  open: boolean
  onEscPressed?(): void
} & OptionalClassname
const FullviewDialog: FunctionComponent<FullviewDialogProps> = (props) => {
  const { open, children, className, onEscPressed = noOp } = props
  useKeyup({ key: 'Escape', onKeypressed: onEscPressed })

  return (
    <dialog
      open={open}
      className={className}
    >
      <div className="dialog-content">
        {children}
      </div>
    </dialog>
  )
}

const StyledFullviewDialog = styled(FullviewDialog)`
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.65);
  height: 100vh;
  width: 100vw;
  border: none;
  padding: 0;
  margin: 0;
  position: absolute;
  z-index: 1;
  justify-content: center;
  gap: 1rem;
  padding: 0.6rem;
  top: 0;

  .dialog-content {
    display: flex;
    flex-direction: column;
  }
`

export { StyledFullviewDialog as FullviewDialog }
