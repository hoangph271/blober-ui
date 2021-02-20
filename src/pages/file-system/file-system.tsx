import { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { FullGrowLoader, withAuthRequired, withDefaultHeader } from '../../components'
import { useGet } from '../../hooks/use-apis'
import { API_ROOT } from '../../constants'
import { FSList } from './fs-list'
import { FSItem, OptionalClassname } from '../../interfaces'
import { FSGrid } from './fs-grid'
import { PathBreadcrumb } from './path-breadcrumb'

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

  return (
    <>
      {openId && (
        <dialog
          open={!!openId}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            border: 'none',
            padding: 0,
            margin: 0,
            position: 'absolute',
            zIndex: 1,
            justifyContent: 'center',
            gap: '1rem',
            top: 0
          }}
        >
          <button onClick={(e) => setOpenId('')}>
            {'Close'}
          </button>
          <video
            muted
            controls
            autoPlay
            className={className}
            style={{ maxWidth: '100%' }}
            src={`${API_ROOT}/files/raw/${openId}`}
          />
        </dialog>
      )}
      {displayType === 'GRID' ? (
        <FSGrid fsItem={fsItem} onClick={handleItemClicked} className={className} />
      ) : (
        <FSList fsItems={fsItem.children ?? []} onClick={handleItemClicked} />
      )}
    </>
  )
})`
`

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
  display: flex;
  flex-direction: column;
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
