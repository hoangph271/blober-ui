import { basename } from 'node:path'
import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FSItem, OptionalClassname } from '../../interfaces'
import { hash } from '../../utils'

type FSNameId = {
  _id: string
  name: string
}
type PathBreadcrumbProps = {
  fsItem: FSItem
} & OptionalClassname
const PathBreadcrumb = (props: PathBreadcrumbProps) => {
  const { fsItem } = props
  const { fullPath, path } = fsItem

  const [fsNameIds, setFsNameIds] = useState<FSNameId[]>([])

  const calculateFSNameIds = useCallback(async () => {
    const rootPath = fullPath.replace(path, '')
    const subPaths = path
      .split(path.charAt(0))
      .slice(1) // ? Starts with a '/' or '\'
    console.info(subPaths)

    const fsNameIds = [
      ...path ? [{ _id: await hash(rootPath), name: basename(rootPath) }] : [],
      ...[]
      // ...subPaths.map(name => )
    ]

    setFsNameIds(fsNameIds)
  }, [])

  useEffect(() => { calculateFSNameIds() }, [calculateFSNameIds])

  return (
    <div>
      <Link to="/files" key="" >{'/'}</Link>
      {fsNameIds.map(({ _id, name }) => (
        <Link
          key={_id}
          to={`/files/${_id}`}
        >
          {name}
        </Link>
      ))}
    </div>
  )
}

const StyledPathBreadcrum = styled(PathBreadcrumb)`
`

export { StyledPathBreadcrum as PathBreadcrumb }
