import { useState } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, ScrollableGrid, FullGrowLoader, withAuthRequired } from '../../components'
import { useGet } from '../../hooks/use-apis'
import { API_ROOT } from '../../constants'
import { FSList } from './fs-list'
import { basename } from '../../utils'
import { FSItem, OptionalClassname } from '../../interfaces'

const getPreviewUrl = (itemPath: string) => {
  return `${API_ROOT}/files/preview?path=${encodeURIComponent(itemPath)}`
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
    return (
      <video
        muted
        controls
        autoPlay
        style={{
          width: '300px',
          height: '300px',
          margin: '1rem'
        }}
        src={getRawUrl(fsItem.itemPath)}
      />
    )
  }

  if (fsItem.isDir) {
    return (
      <Link
        className={className}
        to={`?path=${encodeURIComponent(fsItem.itemPath)}`}
      >
        <Card
          className="folder-card"
          title={basename(fsItem.itemPath)}
          coverUrl={getPreviewUrl(fsItem.itemPath)}
        />
      </Link>
    )
  }

  return (
    <Card
      className={`${className} file-card`}
      title={basename(fsItem.itemPath)}
      onClick={() => setIsOpen(true)}
      coverUrl={getPreviewUrl(fsItem.itemPath)}
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
  .folder-card {
    background-size: 5rem;
    background-position: center;
  }

  .file-card {
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
  fsItems: FSItem[]
} & OptionalClassname
const AdaptiveFolderView = (props: AdaptiveFolderViewProps) => {
  const { displayType, fsItems } = props
  const [openUrl, setOpenUrl] = useState('')

  const handleItemClicked = (itemPath: string) => {
    setOpenUrl(itemPath)
  }

  if (openUrl) {
    return (
      <video
        muted
        controls
        autoPlay
        src={`${API_ROOT}/files/raw?path=${encodeURIComponent(openUrl)}`}
      />
    )
  }

  if (displayType === 'GRID') {
    return (
      <ScrollableGrid>
        {fsItems.map(fsItem => (
          <StyledFSItemCard key={fsItem.itemPath} fsItem={fsItem} />
        ))}
      </ScrollableGrid>
    )
  }

  return (
    <FSList fsItems={fsItems} onClick={handleItemClicked} />
  )
}

type FolderViewProps = {
  path: string,
} & OptionalClassname
const FolderView = (props: FolderViewProps) => {
  const { path, className } = props
  const [displayType] = useState<DISPLAY_TYPE>('GRID')
  const { data = [], isLoading } = useGet<FSItem[]>({
    url: `/files?path=${encodeURIComponent(path)}`,
    initRun: true
  })

  return isLoading ? (
    <FullGrowLoader />
  ) : (
    <section className={className}>
      <AdaptiveFolderView displayType={displayType} fsItems={data} />
    </section>
  )
}

const StyledFolderView = styled(FolderView)`
`

export const FileSystem = withAuthRequired(() => {
  const { search } = useLocation()
  const path = new URLSearchParams(search).get('path') || ''

  return <StyledFolderView path={path} key={path} />
})
