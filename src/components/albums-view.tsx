import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { useApi } from '../hooks';
import { AuthedImage } from './';

const camoUrl = 'https://i.redd.it/2bkwu2l10n331.jpg';

type Pic = {
  uuid: string,
  title: string,
  blobUuid: string,
}
type Album = {
  uuid: string,
  title: string,
  picsCount: number,
  pics: Pic[]
}
type AlbumResponse = {
  albums: Album[],
}
type AlbumsViewProps = {
  className?: string,
}
const AlbumsView = ({ className = '' }: AlbumsViewProps) => {
  const { data, isLoading } = useApi<AlbumResponse>({ url: 'albums?take=100', initRun: true })

  return (
    <div className={className}>
      {isLoading ? (
        <div>{'Loading...'}</div>
      ) : (
        <Masonry
          breakpointCols={{
            'default': 5,
            '1550': 4,
            '1250': 3,
            '950': 2,
            '650': 1
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
            {data?.albums.map(album => (
              <div key={album.uuid} style={{
                width: '300px',
              }}>
                <div>
                  {camoUrl ? 'Camo #URL' :album.title}
                </div>
                <AuthedImage
                  url={camoUrl || `blobs/raw/${album.pics[0].blobUuid}`}
                />
              </div>
            ))}
        </Masonry>
      )}
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
