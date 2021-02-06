import Loader from "react-loader-spinner"
import { useParams } from "react-router-dom"
import { API_ROOT, CAMO_URL } from "../../constants"
import { useGet } from "../../hooks/use-apis"
import { Album } from "../../interfaces"

type AlbumDetailRouteParams = {
  id: string,
}
export const AlbumDetail = () => {
  const { id } = useParams<AlbumDetailRouteParams>()
  const { isLoading, data } = useGet<Album>({ url: `albums/${id}`, initRun: true })

  if (isLoading) return <Loader />

  return (
    <div>
      {data?.pics.map(pic => (
        <img
          key={pic._id}
          src={CAMO_URL || `${API_ROOT}/blobs/raw/${pic.blobId}`}
          alt={data?.title}
        />
      ))}
    </div>
  )
}
