import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Card, ScrollableGrid } from '../../components'
import { FSItem, OptionalClassname } from '../../interfaces'
import { basename, getPreviewUrls } from '../../utils'

type FSItemCardProps = {
  fsItem: FSItem
  onClick?(_id: string): void
} & OptionalClassname
const FSItemCard = (props: FSItemCardProps) => {
  const { fsItem, className, onClick } = props
  const history = useHistory()

  return (
    <Card
      className={`${className} file-card`}
      title={basename(fsItem.path)}
      coverUrls={getPreviewUrls(fsItem)}
      onClick={() => {
        fsItem.isDir
          ? history.push(`/files/${fsItem._id}`)
          : onClick?.(fsItem._id)
      }}
    />
  )
}

const StyledFSItemCard = styled(FSItemCard)`
`

type FSGridProps = {
  fsItem: FSItem
} & OptionalClassname
const FSGrid = (props: FSGridProps) => {
  const { className, fsItem } = props
  const history = useHistory()
  const { search, pathname } = useLocation()

  const childFSItems = [
    ...fsItem.children?.filter(fsItem => fsItem.isDir) || [],
    ...fsItem.children?.filter(fsItem => !fsItem.isDir) || []
  ]

  return (
    <div className={className}>
      <ScrollableGrid>
        {childFSItems.map(fsItem => (
          <StyledFSItemCard
            key={fsItem._id}
            fsItem={fsItem}
            onClick={() => {
              const nextSearch = new URLSearchParams(search)
              nextSearch.set('openItemId', fsItem._id)

              history.replace({
                pathname,
                search: nextSearch.toString()
              })
            }}
          />
        ))}
      </ScrollableGrid>
    </div>
  )
}

const StyledFSGrid = styled(FSGrid)`
  display: flex;
  min-height: 0px;
`
export { StyledFSGrid as FSGrid }
