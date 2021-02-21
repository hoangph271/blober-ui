import { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { FullGrowLoader, withAuthRequired, withDefaultHeader } from '../../components'
import { useGet } from '../../hooks/use-apis'
import { FSList } from './fs-list'
import { FSItem, OptionalClassname } from '../../interfaces'
import { FSGrid } from './fs-grid'
import { PathBreadcrumb } from './path-breadcrumb'
import { FileViewDialog } from './fileview-dialog'
import { useLocation } from 'react-router-dom'

type DISPLAY_TYPE = 'GRID' | 'LIST'
type AdaptiveFolderViewProps = {
  displayType: DISPLAY_TYPE
  fsItem: FSItem
} & OptionalClassname
const AdaptiveFolderView = styled((props: AdaptiveFolderViewProps) => {
  const { displayType, fsItem, className } = props
  const { search } = useLocation()
  const openItemId = new URLSearchParams(search).get('openItemId')

  return (
    <>
      <FileViewDialog
        fsItem={fsItem.children?.find(item => item._id === openItemId)}
      />
      {displayType === 'GRID' ? (
        <FSGrid fsItem={fsItem} className={className} />
      ) : (
        <FSList fsItems={fsItem.children ?? []} />
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

  if (isLoading) {
    return <FullGrowLoader />
  }

  return (
    <main className={className}>
      {data ? (
        <>
          <PathBreadcrumb fsItem={data} />
          <AdaptiveFolderView displayType={displayType} fsItem={data} />
        </>
      ) : (
        <div>{'404 | Not Found'}</div>
      )}
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
