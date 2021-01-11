import React, { useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { useApi } from '../hooks';
import { AuthedImage } from '../components';
import Loader from 'react-loader-spinner';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const camoUrl = 'https://i.redd.it/2bkwu2l10n331.jpg';

type Pic = {
  _id: string,
  title: string,
  url: string,
}
type Album = {
  _id: string,
  title: string,
  picsCount: number,
  albumPics: Pic[]
}
type AlbumsViewProps = {
  className?: string,
}
const breakpointCols = {
  'default': 5,
  '1550': 4,
  '1250': 3,
  '950': 2,
  '650': 1
}
const AlbumsView = ({ className = '' }: AlbumsViewProps) => {
  const { data: albums = [], isLoading } = useApi<Album[]>({ url: 'albums?take=100', initRun: true })

  return (
    <div className={className}>
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
          {albums?.map(album => <AlbumCard key={album._id} album={album} />)}
      </Masonry>
      <BottomLoader
        isLoading={isLoading}
        // TODO: Paging load...?
        onLoadMore={console.info}
      />
    </div>
  )
}

type BottomLoaderType = {
  isLoading: boolean,
  onLoadMore(): void,
}
const BottomLoader = (props: BottomLoaderType) => {
  const { isLoading } = props
  const indicatorRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={indicatorRef}>
      {isLoading && (
        <Loader
          type="Oval"
          color="#00BFFF"
          height="2.6rem"
          width="2.6rem"
        />
      )}
    </div>
  )
}

type AlbumCardProps = {
  album: Album
}
const AlbumCard = ({ album }: AlbumCardProps) => {
  const { _id, title, albumPics } = album
  return (
    <div style={{ width: '300px' }}>
      <div>
        {camoUrl ? `Camo #${_id}` : title}
      </div>
      <AuthedImage
        url={camoUrl || `${albumPics[0].url}`}
      />
    </div>
  )
}

const StyledAlbumview = styled(AlbumsView)`
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
`

export { StyledAlbumview as AlbumsView }
