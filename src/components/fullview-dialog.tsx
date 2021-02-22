import { FunctionComponent, useRef } from 'react'
import styled from 'styled-components'
import { devices } from '../constants'
import { useClickOutside, useKeyup } from '../hooks'
import { OptionalClassname } from '../interfaces'
import { noOp } from '../utils'

type FullviewDialogProps = {
  open: boolean
  onRequestClose?(): void
} & OptionalClassname
const FullviewDialog: FunctionComponent<FullviewDialogProps> = (props) => {
  const { open, children, className, onRequestClose = noOp } = props
  const contentRef = useRef<HTMLDivElement>(null)

  useClickOutside(contentRef, onRequestClose)
  useKeyup({ key: 'Escape', onKeypressed: onRequestClose })

  return (
    <dialog
      open={open}
      className={className}
    >
      <div
        ref={contentRef}
        className="dialog-content inset-shadow"
      >
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
  align-items: center;
  gap: 1rem;
  padding: 0.6rem;
  top: 0;

  .dialog-content {
    display: flex;
    flex-direction: column;
  }

  @media ${devices.tablet} {
    .dialog-content {
      width: 80%;
    }
  }
`

export { StyledFullviewDialog as FullviewDialog }
