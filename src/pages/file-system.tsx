import { useState } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { Card, FlexList, FullGrowLoader, withAuthRequired } from '../components'
import { useGet } from '../hooks/use-apis'
import { API_ROOT } from '../constants'
import { OptionalClassname } from '../interfaces'
import styled from 'styled-components'

type FSItem = {
  isDir: boolean
  itemPath: string
}

const basename = (itemPath: string) => {
  if (itemPath.startsWith('/')) {
    return itemPath.split('/').pop() || itemPath
  }

  return itemPath.split('\\').pop() || itemPath
}

type FSItemCardProps = {
  fsItem: FSItem
} & OptionalClassname
const FSItemCard = (props: FSItemCardProps) => {
  const { fsItem } = props
  const [open, setOpen] = useState(false)

  const handleItemClicked = () => {
    setOpen(true)
  }

  if (open) {
    return (
      <ReactPlayer
        muted
        playing
        controls
        width="300px"
        height="300px"
        style={{
          margin: '1rem'
        }}
        url={`${API_ROOT}/files/raw?path=${encodeURIComponent(fsItem.itemPath)}`}
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
      onClick={handleItemClicked}
      coverUrl={`${API_ROOT}/files/preview?path=${encodeURIComponent(fsItem.itemPath)}`}
    />
  )
}

type FolderViewProps = {
  path: string,
} & OptionalClassname
const FolderView = (props: FolderViewProps) => {
  const { path, className } = props
  const { data = [], isLoading } = useGet<FSItem[]>({
    url: `/files?path=${encodeURIComponent(path)}`,
    initRun: true
  })

  if (isLoading) return <FullGrowLoader />

  return (
    <ul className={className}>
      <FlexList>
        {data.map(fsItem => <FSItemCard key={fsItem.itemPath} fsItem={fsItem} />)}
      </FlexList>
    </ul>
  )
}

const StyledFolderView = styled(FolderView)`
  padding: 0;
`

export const FileSystem = withAuthRequired(() => {
  const { search } = useLocation()
  const path = new URLSearchParams(search).get('path') || ''

  return <StyledFolderView path={path} key={path} />
})
