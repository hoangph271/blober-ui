import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { FullGrowLoader } from '../components'
import { useGet } from '../hooks/use-apis'

type FSItem = {
  isDir: boolean
  itemPath: string
}

const basename = (itemPath: string) => {
  if (itemPath.startsWith('/')) {
    return itemPath.split('/').pop()
  }

  return itemPath.split('\\').pop()
}

export const FileSystem = () => {
  const { search } = useLocation()
  const path = new URLSearchParams(search).get('path') || ''
  const { data, isLoading } = useGet<FSItem[]>({
    url: `/files?path=${encodeURIComponent(path)}`,
    initRun: true
  })

  if (isLoading) return <FullGrowLoader />

  return (
    <ul>
      {data?.map(fsItem => (
        <li key={fsItem.itemPath}>
          {fsItem.isDir ? (
            <Link to={`?path=${encodeURIComponent(fsItem.itemPath)}`}>
              {basename(fsItem.itemPath)}
            </Link>
          ) : (
            <div>
              {basename(fsItem.itemPath)}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
