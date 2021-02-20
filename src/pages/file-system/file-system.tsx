import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, ScrollableGrid, FullGrowLoader, withAuthRequired, withDefaultHeader } from '../../components'
import { useGet } from '../../hooks/use-apis'
import { API_ROOT, devices } from '../../constants'
import { FSList } from './fs-list'
import { basename } from '../../utils'
import { FSItem, OptionalClassname } from '../../interfaces'

const _getGenericPreviewFile = (fsItem: FSItem) => {
  if (fsItem.mime) {
    switch (true) {
      case fsItem.mime.startsWith('video/'):
        return 'video.svg'
      case fsItem.mime === 'application/pdf':
        return 'file-pdf.svg'
    }
  }

  return 'file-binary.svg'
}
const _getGenericPreviewUrl = (fsItem: FSItem) => `/icons/${_getGenericPreviewFile(fsItem)}`
const _getPreviewUrl = (_id: string) => `${API_ROOT}/files/preview/${_id}`

const getPreviewUrls = (fsItem: FSItem) => {
  if (fsItem.isDir) {
    return ['/icons/folder.svg']
  }

  return [
    _getPreviewUrl(fsItem._id),
    _getGenericPreviewUrl(fsItem)
  ]
}

// TODO: Use template...?
const getRawUrl = (_id: string) => `${API_ROOT}/files/raw/${_id}`

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
              style={{
                maxWidth: '100%'
              }}
              muted
              controls
              autoPlay
              src={getRawUrl(fsItem._id)}
            />
          </Card>
        )
    }
  }

  if (fsItem.isDir) {
    return (
      <Link
        className={className}
        to={`/files/${fsItem._id}`}
      >
        <Card
          className="folder-card"
          title={basename(fsItem.path)}
          coverUrls={getPreviewUrls(fsItem)}
        />
      </Link>
    )
  }

  return (
    <Card
      className={`${className} file-card`}
      title={basename(fsItem.path)}
      onClick={() => {
        setIsOpen(true)
      }}
      coverUrls={getPreviewUrls(fsItem)}
    >
    </Card>
  )
}

const StyledFSItemCard = styled(FSItemCard)`
  color: black;
  text-decoration: none;

  &:hover, &:visited {
    color: black;
  }

  &.file-card, .folder-card, .preview-card {
    width: 8rem;
    height: 8rem;
  }

  @media ${devices.tablet} {
    &.file-card, .folder-card, .preview-card {
      width: 12rem;
      height: 12rem;
    }
  }
`

type DISPLAY_TYPE = 'GRID' | 'LIST'
type AdaptiveFolderViewProps = {
  displayType: DISPLAY_TYPE
  fsItem: FSItem
} & OptionalClassname
const AdaptiveFolderView = styled((props: AdaptiveFolderViewProps) => {
  const { displayType, fsItem, className } = props
  const [openId, setOpenId] = useState('')

  const handleItemClicked = (_id: string) => {
    setOpenId(_id)
  }

  if (openId) {
    switch (true) {
      case fsItem.mime?.startsWith('video/'):
        return (
          <video
            muted
            controls
            autoPlay
            className={className}
            src={`${API_ROOT}/files/raw/${openId}`}
          />
        )
    }
  }

  if (displayType === 'GRID') {
    const childFSItems = fsItem.children
      ? [
          ...fsItem.children.filter(fsItem => fsItem.isDir),
          ...fsItem.children.filter(fsItem => !fsItem.isDir)
        ]
      : []

    return (
      <ScrollableGrid className={className}>
        {childFSItems.map(fsItem => (
          <StyledFSItemCard key={fsItem._id} fsItem={fsItem} />
        ))}
      </ScrollableGrid>
    )
  }

  return (
    <FSList fsItems={fsItem.children ?? []} onClick={handleItemClicked} />
  )
})`
  max-height: 100vh;
`

// const ab2str = (buffer: ArrayBuffer) => {
//   const codes = new Uint16Array(buffer)
//   return String.fromCharCode(...(codes as any))
// }
const str2ab = (inStr: string) => {
  const blob = new Blob([inStr], { type: 'text/plain' })

  return blob.arrayBuffer()
}

const hexEncode = (buffer: ArrayBuffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

const hash = async (inStr: string) => {
  const buffer = await window.crypto.subtle.digest('SHA-256', await str2ab(inStr))
  return hexEncode(buffer)
}

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

    const fsNameIds = path
      ? [
          { _id: await hash(rootPath), name: basename(rootPath) }
        ]
      : [
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

type FolderViewProps = {
  _id: string,
} & OptionalClassname
const FolderView = (props: FolderViewProps) => {
  const { _id, className } = props
  const [displayType] = useState<DISPLAY_TYPE>('GRID')
  const { data, isLoading } = useGet<FSItem>({ url: `/files/${_id}`, initRun: true })

  return isLoading ? (
    <FullGrowLoader />
  ) : (
    <main className={className}>
      <PathBreadcrumb fsItem={data as FSItem} />
      <AdaptiveFolderView displayType={displayType} fsItem={data as FSItem} />
    </main>
  )
}

const StyledFolderView = styled(FolderView)`
`

export const FileSystem = withDefaultHeader(withAuthRequired((props: any) => {
  const { _id = '' } = useParams() as any

  return (
    <StyledFolderView
      { ...props }
      _id={_id}
      key={_id}
    />
  )
}))
