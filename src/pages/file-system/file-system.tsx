import { useState } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, ScrollableGrid, FullGrowLoader, withAuthRequired } from '../../components'
import { useGet } from '../../hooks/use-apis'
import { API_ROOT, devices } from '../../constants'
import { FSList } from './fs-list'
import { basename } from '../../utils'
import { FSItem, OptionalClassname } from '../../interfaces'

const _getGenericPreviewFile = (fsItem: FSItem) => {
  fsItem.mime = fsItem.mime ?? ''

  switch (true) {
    case fsItem.mime.startsWith('video/'):
      return 'video.svg'
    case fsItem.mime === 'application/pdf':
      return 'file-pdf.svg'
    default:
      return 'file-binary.svg'
  }
}
const _getGenericPreviewUrl = (fsItem: FSItem) => `/icons/${_getGenericPreviewFile(fsItem)}`
const _getPreviewUrl = (itemPath: string) => {
  return `${API_ROOT}/files/preview?path=${encodeURIComponent(itemPath)}`
}
const getPreviewUrls = (fsItem: FSItem) => {
  if (fsItem.isDir) {
    return ['/icons/folder.svg']
  }

  return [
    _getPreviewUrl(fsItem.itemPath),
    _getGenericPreviewUrl(fsItem)
  ]
}

const getRawUrl = (itemPath: string) => {
  return `${API_ROOT}/files/raw?path=${encodeURIComponent(itemPath)}`
}

type FSItemCardProps = {
  fsItem: FSItem
  onClick?(itemPath: string): void
} & OptionalClassname
const FSItemCard = (props: FSItemCardProps) => {
  const { fsItem, className } = props
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    switch (true) {
      case fsItem.mime.startsWith('video/'):
        return (
          <Card
            className={`${className} file-card`}
            title={basename(fsItem.itemPath)}
            coverUrls={[]}
          >
            <video
              style={{
                maxWidth: '100%'
              }}
              muted
              controls
              autoPlay
              src={getRawUrl(fsItem.itemPath)}
            />
          </Card>
        )
    }
  }

  if (fsItem.isDir) {
    return (
      <Link
        className={className}
        to={`/files/${encodeURIComponent(fsItem.itemPath)}`}
      >
        <Card
          className="folder-card"
          title={basename(fsItem.itemPath)}
          coverUrls={getPreviewUrls(fsItem)}
        />
      </Link>
    )
  }

  return (
    <Card
      className={`${className} file-card`}
      title={basename(fsItem.itemPath)}
      onClick={() => {
        setIsOpen(true)
      }}
      coverUrls={getPreviewUrls(fsItem)}
    >
      <a
        onClick={e => e.stopPropagation()}
        className="download-link"
        download
        href={`${API_ROOT}/files/raw?path=${encodeURIComponent(fsItem.itemPath)}`}
      >
        {'Download'}
      </a>
    </Card>
  )
}

const StyledFSItemCard = styled(FSItemCard)`
  color: black;
  text-decoration: none;

  &:hover, &:visited {
    color: black;
  }

  &.file-card, .folder-card, .preview-card {
    width: 8rem;
    height: 8rem;
  }

  @media ${devices.tablet} {
    &.file-card, .folder-card, .preview-card {
      width: 12rem;
      height: 12rem;
    }
  }

  &.file-card {
    position: relative;

    .download-link {
      position: absolute;
      top:  0;
    }
  }
`

type DISPLAY_TYPE = 'GRID' | 'LIST'
type AdaptiveFolderViewProps = {
  displayType: DISPLAY_TYPE
  fsItem: FSItem
} & OptionalClassname
const AdaptiveFolderView = (props: AdaptiveFolderViewProps) => {
  const { displayType, fsItem } = props
  const [openUrl, setOpenUrl] = useState('')

  const handleItemClicked = (itemPath: string) => {
    setOpenUrl(itemPath)
  }

  if (openUrl) {
    switch (true) {
      case fsItem.mime.startsWith('video/'):
        return (
          <video
            muted
            controls
            autoPlay
            src={`${API_ROOT}/files/raw?path=${encodeURIComponent(openUrl)}`}
          />
        )
    }
  }

  if (displayType === 'GRID') {
    return (
      <ScrollableGrid>
        {(fsItem.children ?? []).map(fsItem => (
          <StyledFSItemCard key={fsItem.itemPath} fsItem={fsItem} />
        ))}
      </ScrollableGrid>
    )
  }

  return (
    <FSList fsItems={fsItem.children ?? []} onClick={handleItemClicked} />
  )
}

type FolderViewProps = {
  path: string,
} & OptionalClassname
const FolderView = (props: FolderViewProps) => {
  const { path, className } = props
  const [displayType] = useState<DISPLAY_TYPE>('GRID')
  const { data, isLoading } = useGet<FSItem>({
    url: `/files?path=${encodeURIComponent(path)}`,
    initRun: true
  })

  return isLoading ? (
    <FullGrowLoader />
  ) : (
    <main className={className}>
      <AdaptiveFolderView displayType={displayType} fsItem={data as FSItem} />
    </main>
  )
}

const StyledFolderView = styled(FolderView)`
`

export const FileSystem = withAuthRequired(() => {
  const { pathname } = useLocation()
  const path = pathname === '/files'
    ? ''
    : pathname.replace('/files/', '')

  return (
    <StyledFolderView
      key={pathname}
      path={decodeURIComponent(path)}
    />
  )
})
