import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { AuthedImage } from '../../components';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Album, ListResponseWithCount } from '../../interfaces';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { useGet } from '../../hooks/use-apis';
import Loader from 'react-loader-spinner';

const camoUrl = '';
// const camoUrl = 'https://i.redd.it/2bkwu2l10n331.jpg';

type AlbumsListProps = {
  className?: string,
}
const breakpointCols = {
  'default': 5,
  '1550': 4,
  '1250': 3,
  '950': 2,
  '650': 1
}
const usePageParam = () => {
  const { search } = useLocation()
  const pageParam = new window.URLSearchParams(search).get('page') || ''
  const [page, setPage] = useState(Number.parseInt(pageParam))

  useEffect(() => {
    const pageParam = new window.URLSearchParams(search).get('page') || ''
    setPage(Number.parseInt(pageParam))
  }, [search])

  const { data, error, startFetching } = useGet<ListResponseWithCount<Album>>({ url: 'albums?take=0&skip=0' })
  useEffect(() => {
    if (Number.isNaN(page)) {
      startFetching()
    }
  }, [page, startFetching])

  useEffect(() => {
    if (error) {
      console.error(error);
      // TODO: HandleError
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
const PAGE_LIMIT = 8
const AlbumsList = styled(({ className = '' }: AlbumsListProps) => {
  const { search } = useLocation()
  const { page } = usePageParam();
  const [pageCount, setPageCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([])
  const { data, startFetching } = useGet<ListResponseWithCount<Album>>({
    url: `albums?take=${PAGE_LIMIT}&skip=${(page - 1) * PAGE_LIMIT}`,
  })

  useEffect(() => {
    if (Number.isNaN(page)) return;
    startFetching()
  }, [page, startFetching])

  useEffect(() => {
    if (!data) return

    const { itemCount, items } = data
    setPageCount(Math.ceil(itemCount / PAGE_LIMIT))
    setAlbums(items)
  }, [data])

  if (Number.isNaN(page)) {
    return (
      <Loader
        type="Oval"
        color="#00BFFF"
        height="2.6rem"
        width="2.6rem"
      />
    )
  } else if (!new window.URLSearchParams(search).get('page')) {
    return (
      <Redirect to={`/albums?page=${page}`} />
    )
  }

  return (
    <div className={className}>
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid albums-list"
        columnClassName="my-masonry-grid_column">
        {albums.map(album => <AlbumCard key={album._id} album={album} />)}
      </Masonry>
      {pageCount && (
        <Pager
          className="pager"
          pageCount={pageCount}
          currentPage={page}
        />
      )}
    </div>
  )
})`
  max-height: 100vh;
`
type PagerProps = {
  pageCount: number,
  currentPage: number,
  className?: string,
}
const Pager = styled((props: PagerProps) => {
  const { currentPage, pageCount, className = '' } = props
  const pages = Array.from({ length: pageCount })
    .map((_, i) => i + 1)

  return (
    <div className={className}>
      {pages.map(page => page === currentPage ? (
        <button key={page} disabled className="page-button">
          {page}
        </button>
      ) : (
          <Link key={page} to={`/albums?page=${page}`} className="page-button">
            {page}
          </Link>
        ))}
    </div>
  )
})`
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  margin: 0.3rem 0;
  flex-wrap: wrap;

  .page-button {
    border: 1px solid gray;
    border-radius: 2px;
    width: 1.4rem;
    height: 1.4rem;
    text-decoration: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: medium;
    box-sizing: border-box;
    color: black;
  }
  .page-button[disabled] {
    background-color: gray;
  }
`
// type BottomLoaderType = {
//   isLoading: boolean,
//   onLoadMore(): void,
// }
// const BottomLoader = (props: BottomLoaderType) => {
//   const { isLoading } = props
//   const indicatorRef = useRef<HTMLDivElement>(null)

//   return (
//     <div ref={indicatorRef}>
//       {isLoading && (
//         <Loader
//           type="Oval"
//           color="#00BFFF"
//           height="2.6rem"
//           width="2.6rem"
//         />
//       )}
//     </div>
//   )
// }

type AlbumCardProps = {
  album: Album
}
const AlbumCard = ({ album }: AlbumCardProps) => {
  const { _id, title, pics } = album
  return (
    <div style={{ width: '300px' }}>
      <Link className="album-title" to={`albums/${_id}`}>
        {camoUrl ? `Camo #${_id}` : title}
      </Link>
      <AuthedImage
        className="album-avatar"
        url={camoUrl || `blobs/raw/${pics[0].blobId}`}
      />
    </div>
  )
}

const StyledAlbumview = styled(AlbumsList)`
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;

  .albums-list {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .my-masonry-grid {
    display: flex;
    width: 100%;
    max-width: 100%;
  }
  .my-masonry-grid_column {
    background-clip: padding-box;
  }

  .my-masonry-grid_column > div {
    margin: auto;
  }

  .album-title {
    height: 1.6rem;
  }
  .album-avatar {
    max-height: calc(100vh - 1.6rem);
  }
`

export { StyledAlbumview as AlbumsList }
