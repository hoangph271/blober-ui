import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FSItem, OptionalClassname } from '../../interfaces'
import { basename, hash } from '../../utils'

type FSNameId = {
  _id: string
  name: string
}
type PathBreadcrumbProps = {
  fsItem: FSItem
} & OptionalClassname
const PathBreadcrumb = (props: PathBreadcrumbProps) => {
  const { fsItem, className } = props
  const { fullPath, path } = fsItem
  const seperator = path.charAt(0)

  const [fsNameIds, setFsNameIds] = useState<FSNameId[]>([])

  const calculateFSNameIds = useCallback(async () => {
    const rootPath = fullPath.replace(path, '')
    // ? Starts with `seperator`
    const ancestorNames = path.split(seperator).slice(1)
    const ancestorPaths = ancestorNames.map((_, i) => {
      const subPath = ancestorNames.slice(0, i + 1).join(seperator)
      return [rootPath, subPath].join(seperator)
    })

    const fsNameIds = [
      ...path ? [{
        _id: await hash(rootPath), name: `${basename(rootPath)}${seperator}`
      }] : [],
      ...await Promise.all(ancestorPaths.map(async path => ({
        _id: await hash(path),
        name: `${basename(path)}${seperator}`
      })))
    ]

    setFsNameIds(fsNameIds)
  }, [])

  useEffect(() => { calculateFSNameIds() }, [calculateFSNameIds])

  return (
    <div className={className}>
      {fullPath !== '' && (
        <Link to="/files" key="" className="root-link" />
      )}
      {fsNameIds.map(({ _id, name }) => (
        <Link
          key={_id}
          to={`/files/${_id}`}
          className="sub-link"
        >
          {name}
        </Link>
      ))}
    </div>
  )
}

const StyledPathBreadcrum = styled(PathBreadcrumb)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.4rem;

  .sub-link {
    color: black;
    text-decoration: none;
  }
  .sub-link:hover {
    font-weight: bold;
  }

  .root-link {
    width: 2rem;
    height: 2rem;
    display: inline-block;
    background-size: 160%;
    background-position: center;
    background-image: url('/icons/3d.svg');

    &:hover {
      transform: scale(1.2);
    }
  }
`

export { StyledPathBreadcrum as PathBreadcrumb }
