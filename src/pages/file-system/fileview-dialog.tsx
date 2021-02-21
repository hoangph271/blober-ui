import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { API_ROOT } from '../../constants'
import { OptionalClassname } from '../../interfaces'
import { FullviewDialog } from '../../components'

type FileviewDialogProps = {} & OptionalClassname
const FileviewDialog = (props: FileviewDialogProps) => {
  const { className } = props
  const { search, pathname } = useLocation()
  const openItemId = new URLSearchParams(search).get('openItemId')
  const history = useHistory()

  const handleCloseFile = useCallback(() => {
    const nextSearch = new URLSearchParams(search)

    nextSearch.delete('openItemId')
    history.push({
      pathname,
      search: nextSearch.toString()
    })
  }, [history, search])

  return openItemId ? (
    <FullviewDialog
      open
      className={className}
      onEscPressed={handleCloseFile}
    >
      <button onClick={handleCloseFile}>
        {'Close'}
      </button>
      <video
        muted
        controls
        autoPlay
        style={{ maxWidth: '100%' }}
        src={`${API_ROOT}/files/raw/${openItemId}`}
      />
    </FullviewDialog>
  ) : null
}

const StyledFileViewDialog = styled(FileviewDialog)`
  
`

export { StyledFileViewDialog as FileViewDialog }
