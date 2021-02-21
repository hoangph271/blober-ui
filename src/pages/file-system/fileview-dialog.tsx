import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import filesize from 'filesize'
import { FSItem, OptionalClassname } from '../../interfaces'
import { FullviewDialog } from '../../components'
import { basename, getRawUrl } from '../../utils'

type DetailLineProps = {
  label: string
  detail: string | number
} & OptionalClassname
const DetailLine = styled((props: DetailLineProps) => {
  const { label, detail, className } = props

  return (
    <tr className={className}>
      <th className="label">{label}</th>
      <td className="detail">{detail}</td>
    </tr>
  )
})`
  .label {
    display: flex;
    text-align: right;
  }

  .detail {
    word-break: break-word;
  }
`

type FileDetailProps = {
  fsItem: FSItem
} & OptionalClassname
const FileDetail = styled((props: FileDetailProps) => {
  const { fsItem, className } = props
  const location = fsItem.fullPath.slice(0, -(basename(fsItem.fullPath).length))

  return (
    <table className={className}>
      <DetailLine label="Location:" detail={location} />
      {fsItem.mime && <DetailLine label="Type:" detail={fsItem.mime} />}
      {fsItem.size && <DetailLine label="Size:" detail={filesize(fsItem.size)} />}
    </table>
  )
})`
`

type FileViewerProps = {
  fsItem: FSItem
}
const FileViewer = (props: FileViewerProps) => {
  const { fsItem } = props

  if (fsItem.mime?.startsWith('video/')) {
    return (
      <video
        muted
        controls
        autoPlay
        style={{ maxWidth: '100%' }}
        src={getRawUrl(fsItem._id)}
      />
    )
  }

  return (
    <div>
      {`File can't be viewed...! :"(`}
    </div>
  )
}

type FileviewDialogProps = {
  fsItem?: FSItem
} & OptionalClassname
const FileviewDialog = (props: FileviewDialogProps) => {
  const { className, fsItem } = props
  const { search, pathname } = useLocation()
  const history = useHistory()

  const handleCloseFile = useCallback(() => {
    const nextSearch = new URLSearchParams(search)
    nextSearch.delete('openItemId')

    history.push({
      pathname,
      search: nextSearch.toString()
    })
  }, [history, search])

  return fsItem ? (
    <FullviewDialog
      open
      className={className}
      onRequestClose={handleCloseFile}
    >
      <div className="title-bar">
        <div className="title">{basename(fsItem.fullPath)}</div>
        <button className="close-button" onClick={handleCloseFile}>
          {'❌'}
        </button>
      </div>
      <FileViewer fsItem={fsItem} />
      <FileDetail fsItem={fsItem} />
      <a
        href={getRawUrl(fsItem._id)}
        className="download-link"
        download={basename(fsItem.fullPath)}
      >
        {'Download'}
      </a>
    </FullviewDialog>
  ) : null
}

const StyledFileViewDialog = styled(FileviewDialog)`
  .dialog-content {
    padding: 0.4rem;
    padding-top: 0;
    background-color: white;
    border-radius: 0.4rem;
  }

  .title-bar {
    display: flex;
    max-width: 100%;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    padding: 0.1rem 0.4rem;

    .title {
      text-overflow: ellipsis;
      overflow: hidden;
      flex-basis: 0;
      flex-grow: 1;
      white-space: nowrap;
      word-break: break-all;
    }

    .close-button {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;

      :hover {
        transform: scale(1.2)
      }
    }
  }

  .download-link {
    text-align: center;
  }
`

export { StyledFileViewDialog as FileViewDialog }
