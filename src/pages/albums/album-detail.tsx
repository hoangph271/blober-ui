import Loader from "react-loader-spinner"
import { useParams } from "react-router-dom"
import { useApi } from "../../hooks"
import { Album } from "../../interfaces"

type AlbumDetailRouteParams = {
  id: string,
}
export const AlbumDetail = () => {
  const { id } = useParams<AlbumDetailRouteParams>()
  const { isLoading, data } = useApi<Album>({ url: `albums/${id}`, initRun: true })

  if (isLoading) return (
    <Loader
    />
  )

  return (
    <div>
      {`#${id} - @WIP`}
    </div>
  )
}
