import styled from "styled-components"
import { useApi } from "../hooks"

type AuthedImageProps = {
  url: string,
  alt?: string,
  className?: string,
}
const AuthedImage = ({ url, alt = '', className = '' }: AuthedImageProps) => {
  const { data } = useApi<Blob>({ url, raw: true, initRun: !url.startsWith('http') })

  if (url.startsWith('http')) {
    return (
      <div
        className={className}
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${url})`,
          maxWidth: '100%',
          height: 350 + 200 * Math.random(),
        }}
      />
    )
  }

  if (!data) return (
    <div>
      {'Loading...!'}
    </div>
  )

  return (
    <img 
      alt={alt}
      src={URL.createObjectURL(data)}
      style={{
        maxWidth: '100%',
      }}
    />
  )
}

const StyledAuthedImage = styled(AuthedImage)`

`

export { StyledAuthedImage as AuthedImage }
