import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Album, ArrayResponse } from '../../interfaces'
import { Link, Redirect, useLocation } from 'react-router-dom'
import { useGet } from '../../hooks/use-apis'
import { API_ROOT } from '../../constants'
import { Card, FlexList, FullGrowLoader, Pager } from '../../components'

type AlbumsListProps = {
  className?: string,
}
const PAGE_LIMIT = 12
const AlbumsList = ({ className = '' }: AlbumsListProps) => {
  const { search } = useLocation()
  const [pageCount, setPageCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([])
  const albumListRef = useRef<HTMLDivElement>(null)
  const page = Number.parseInt(new URLSearchParams(search).get('page') || '1')

  const { data, startFetching, isLoading } = useGet<ArrayResponse<Album>>({
    url: `albums?take=${PAGE_LIMIT}&skip=${(page - 1) * PAGE_LIMIT}`
  })

  useLayoutEffect(() => {
    if (typeof page === 'number') {
      albumListRef.current?.scrollTo(0, 0)
    }
  }, [page])

  useEffect(() => {
    if (Number.isNaN(page)) return
    startFetching()
  }, [page, startFetching])

  useEffect(() => {
    if (!data) return

    const { itemCount, items } = data
    setPageCount(Math.ceil(itemCount / PAGE_LIMIT))
    setAlbums(items)
  }, [data])

  if (!new window.URLSearchParams(search).get('page')) {
    return (
      <Redirect to={`/albums?page=${1}`} />
    )
  }

  return (
    <main className={className}>
      {isLoading ? (
        <FullGrowLoader />
      ) : (
        <FlexList className="albums-list">
          {albums.map(album => (
            <Link
              to={`albums/${album._id}`}
              key={album._id}
            >
              <Card
                title={album.title}
                className="album-card"
                coverUrl={`${API_ROOT}/blobs/raw/${album.pics[0]?.blobId}`}
              />
            </Link>
          ))}
        </FlexList>
      )}
      <Pager
        className="pager"
        pageCount={pageCount}
        getUrl={page => `albums?page=${page}`}
        currentPage={page}
      />
    </main>
  )
}

const StyledAlbumList = styled(AlbumsList)`
  height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;

  .album-card {
    height: 400px;
  }
`

export { StyledAlbumList as AlbumsList }
