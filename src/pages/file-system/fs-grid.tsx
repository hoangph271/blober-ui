import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card, ScrollableGrid } from '../../components'
import { devices } from '../../constants'
import { FSItem, OptionalClassname } from '../../interfaces'
import { basename, getPreviewUrls, getRawUrl } from '../../utils'

type FSItemCardProps = {
  fsItem: FSItem
  onClick?(itemPath: string): void
} & OptionalClassname
const FSItemCard = (props: FSItemCardProps) => {
  const { fsItem, className } = props
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    switch (true) {
      case fsItem.mime?.startsWith('video/'):
        return (
          <Card
            className={`${className} file-card`}
            title={basename(fsItem.path)}
            coverUrls={[]}
          >
            <video
              muted
              controls
              autoPlay
              src={getRawUrl(fsItem._id)}
              style={{ maxWidth: '100%' }}
            />
          </Card>
        )
    }
  }

  return fsItem.isDir ? (
    <Link
      style={{ color: 'black' }}
      to={`/files/${fsItem._id}`}
    >
      <Card
        className={`${className} folder-card`}
        title={basename(fsItem.path)}
        coverUrls={getPreviewUrls(fsItem)}
      />
    </Link>
  ) : (
    <Card
      className={`${className} file-card`}
      title={basename(fsItem.path)}
      coverUrls={getPreviewUrls(fsItem)}
      onClick={() => { setIsOpen(true) }}
    />
  )
}

const StyledFSItemCard = styled(FSItemCard)`
  text-decoration: none;
  margin: 0.4rem;

  &.file-card, &.folder-card, .preview-card {
    width: 11rem;
    height: 11rem;
  }

  @media ${devices.tablet} {
    &.file-card, &.folder-card, .preview-card {
      width: 14rem;
      height: 14rem;
      margin: 1rem;
    }
  }
`

type FSGridProps = {
  fsItem: FSItem
} & OptionalClassname
const FSGrid = (props: FSGridProps) => {
  const { className, fsItem } = props
  const childFSItems = fsItem.children
    ? [
        ...fsItem.children.filter(fsItem => fsItem.isDir),
        ...fsItem.children.filter(fsItem => !fsItem.isDir)
      ]
    : []

  return (
    <div className={className}>
      <ScrollableGrid>
        {childFSItems.map(fsItem => (
          <StyledFSItemCard key={fsItem._id} fsItem={fsItem} />
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
