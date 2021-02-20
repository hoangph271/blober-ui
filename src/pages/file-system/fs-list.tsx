import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ScrollableList } from '../../components'
import { basename } from '../../utils'
import { FSItem, OptionalClassname } from '../../interfaces'

type FSListProps = {
  fsItems: FSItem[]
  onClick?(itemPath: string): void
} & OptionalClassname
const FSList = (props: FSListProps) => {
  const { fsItems, className, onClick } = props

  return (
    <ScrollableList className={className}>
      {fsItems.map(fsItem => (
        <li key={fsItem._id} className="fs-item">
          <img
            className="generic-icon"
            src={''}
          />
          {fsItem.isDir ? (
            <Link
              to={`/files/${fsItem._id}`}
            >
              {basename(fsItem.path)}
            </Link>
          ) : (
            <div onClick={() => onClick?.(fsItem._id)}>
              {basename(fsItem.path)}
            </div>
          )}
        </li>
      ))}
    </ScrollableList>
  )
}

const StyledFSList = styled(FSList)`
  .fs-item {
    display: flex;
    align-items: center;

    .generic-icon {
      width: 2rem;
    }
  }
`

export { StyledFSList as FSList }
