import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Album, ArrayResponse, OptionalClassname } from '../../interfaces';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useGet } from '../../hooks/use-apis';
import Loader from 'react-loader-spinner';
import { API_ROOT, CAMO_URL } from '../../constants';
import { Pager } from '../../components';

type AlbumsListProps = {
  className?: string,
}
const usePageParam = () => {
  const { search } = useLocation()
  const pageParam = new window.URLSearchParams(search).get('page') || ''
  const [page, setPage] = useState(Number.parseInt(pageParam))

  useEffect(() => {
    const pageParam = new window.URLSearchParams(search).get('page') || ''
    setPage(Number.parseInt(pageParam))
  }, [search])

  const { data, error, startFetching } = useGet<ArrayResponse<Album>>({ url: 'albums?take=0&skip=0' })
  useEffect(() => {
    if (Number.isNaN(page)) {
      startFetching()
    }
  }, [page, startFetching])

  useEffect(() => {
    if (error) {
      console.error(error);
      setPage(1)
      return;
    }

    if (data) {
      const pageCount = Math.ceil(data.itemCount / PAGE_LIMIT);
      setPage(pageCount)
    }
  }, [data, error, page])

  return { page }
}
const PAGE_LIMIT = 12
const AlbumsList = styled(({ className = '' }: AlbumsListProps) => {
  const { search } = useLocation()
  const { page } = usePageParam();
  const [pageCount, setPageCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([])
  const albumListRef = useRef<HTMLDivElement>(null)
  const { data, startFetching, isLoading } = useGet<ArrayResponse<Album>>({
    url: `albums?take=${PAGE_LIMIT}&skip=${(page - 1) * PAGE_LIMIT}`,
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
      <Redirect to={`/albums?page=${page}`} />
    )
  }

  if (Number.isNaN(page)) {
    return (
      <Loader
        type="Oval"
        color="#00BFFF"
        height="2.6rem"
        width="2.6rem"
      />
    )
  }

  return (
    <div className={className}>
      {isLoading ? (
        <Loader />
      ) : (
        <section>
          <div className="albums" ref={albumListRef}>
            {albums.map(album => <AlbumCard key={album._id} album={album} />)}
          </div>
          <Pager
            className="pager"
            pageCount={pageCount}
            getUrl={page => `albums?page=${page}`}
            currentPage={page}
          />
        </section>
      )}
    </div>
  )
})`
  max-height: 100vh;
  section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .albums {
    flex-basis: 0;
    flex-grow: 1;
    display: flex;
    overflow-y: auto;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
`

type AlbumCardProps = {
  album: Album
} & OptionalClassname
const AlbumCard = styled(({ album, className }: AlbumCardProps) => {
  const { _id, title, pics } = album
  return (
    <Link
      to={`albums/${_id}`}
      className={className}
      style={{
        backgroundImage: CAMO_URL
          ? `url(${CAMO_URL})`
          : `url(${API_ROOT}/blobs/raw/${pics[0]?.blobId})`,
      }}
    >
      <div className="album-title">
        {CAMO_URL ? _id : title}
      </div>
    </Link>
  )
})`
  width: 300px;
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin: 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  border-radius: 0.1rem;

  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
    transform: scale(1.04);
  }

  .album-title {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.65);
    padding: 0.2rem 0;
    bottom: 0;
    top: unset;
  }
`

const StyledAlbumview = styled(AlbumsList)`
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;

  .albums-list {
    flex-grow: 1;
    overflow-y: scroll;
  }
`

export { StyledAlbumview as AlbumsList }
