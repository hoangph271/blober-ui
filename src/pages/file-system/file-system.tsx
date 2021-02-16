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

type FSItemCardProps = {
  fsItem: FSItem
  onClick?(itemPath: string): void
} & OptionalClassname
const FSItemCard = (props: FSItemCardProps) => {
  const { fsItem } = props
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
        src={`${API_ROOT}/files/raw?path=${encodeURIComponent(fsItem.itemPath)}`}
      />
    )
  }

  return fsItem.isDir ? (
    <Link
      to={`?path=${encodeURIComponent(fsItem.itemPath)}`}
    >
      <Card
        title={basename(fsItem.itemPath)}
        coverUrl={`${API_ROOT}/files/preview?path=${encodeURIComponent(fsItem.itemPath)}`}
      />
    </Link>
  ) : (
    <Card
      title={basename(fsItem.itemPath)}
      onClick={() => setIsOpen(true)}
      coverUrl={`${API_ROOT}/files/preview?path=${encodeURIComponent(fsItem.itemPath)}`}
    />
  )
}

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
          <FSItemCard key={fsItem.itemPath} fsItem={fsItem} />
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
