import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, FlexList, FullGrowLoader } from '../components'
import { useGet } from '../hooks/use-apis'
import { API_ROOT } from '../constants'
import { OptionalClassname } from '../interfaces'

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

  const handleItemClicked = () => {
    console.info(`TODO: Play ${fsItem.itemPath}`)
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
  const { path } = props
  const { data = [], isLoading } = useGet<FSItem[]>({
    url: `/files?path=${encodeURIComponent(path)}`,
    initRun: true
  })

  if (isLoading) return <FullGrowLoader />

  return (
    <ul>
      <FlexList>
        {data.map(fsItem => <FSItemCard key={fsItem.itemPath} fsItem={fsItem} />)}
      </FlexList>
    </ul>
  )
}

export const FileSystem = () => {
  const { search } = useLocation()
  const path = new URLSearchParams(search).get('path') || ''

  return <FolderView path={path} key={path} />
}
