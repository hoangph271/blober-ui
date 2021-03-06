import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { API_ROOT, CAMO_URL } from '../../constants'
import { Card, ScrollableGrid, FullGrowLoader, Pager, withDefaultHeader } from '../../components'
import { usePagedList } from '../../hooks/use-paged-list'
import { Album } from '../../interfaces'

type AlbumsListProps = {
  className?: string,
}
const PAGE_LIMIT = 12
const AlbumsList = ({ className = '' }: AlbumsListProps) => {
  const [pageCount, setPageCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([])
  const albumListRef = useRef<HTMLDivElement>(null)
  const history = useHistory()

  const handleRefreshed = () => {
    albumListRef.current?.scrollTo(0, 0)
  }
  const { data, isLoading, page } = usePagedList<Album>({
    getUrl: page => `albums?take=${PAGE_LIMIT}&skip=${(page - 1) * PAGE_LIMIT}`,
    onRefreshed: handleRefreshed
  })

  useEffect(() => {
    if (!data) return

    const { itemCount, items } = data
    setPageCount(Math.ceil(itemCount / PAGE_LIMIT))
    setAlbums(items)
  }, [data])

  return (
    <main className={className}>
      {isLoading ? (
        <FullGrowLoader />
      ) : (
        <ScrollableGrid className="albums-list">
          {albums.map(album => (
            <Card
              key={album._id}
              onClick={() => {
                history.push(`albums/${album._id}`)
              }}
              title={album.title}
              className="album-card"
              coverUrls={[CAMO_URL || `${API_ROOT}/blobs/raw/${album.pics[0]?.blobId}`]}
            />
          ))}
        </ScrollableGrid>
      )}
      <Pager
        className="pager"
        pageCount={pageCount}
        getUrl={(page: number) => `albums?page=${page}`}
        currentPage={page}
      />
    </main>
  )
}

const StyledAlbumList = styled(withDefaultHeader(AlbumsList))`
  height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
`

export { StyledAlbumList as AlbumsList }
