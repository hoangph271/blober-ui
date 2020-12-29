import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { useApi } from '../hooks';
import { AuthedImage } from '../components';

const camoUrl = 'https://i.redd.it/2bkwu2l10n331.jpg';

type Pic = {
  uuid: string,
  title: string,
  url: string,
}
type Album = {
  uuid: string,
  title: string,
  picsCount: number,
  albumPics: Pic[]
}
type AlbumsViewProps = {
  className?: string,
}
const AlbumsView = ({ className = '' }: AlbumsViewProps) => {
  const { data: albums, isLoading } = useApi<Album[]>({ url: 'albums?take=100', initRun: true })

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
            {albums?.map(album => (
              <div key={album.uuid} style={{
                width: '300px',
              }}>
                <div>
                  {camoUrl ? 'Camo #URL' :album.title}
                </div>
                <AuthedImage
                  url={camoUrl || `${album.albumPics[0].url}`}
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
