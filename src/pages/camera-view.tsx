import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useViewportSize } from '../hooks';
import { OptionalClassname } from '../interfaces';

type CameraViewProps = {
  onCapture(url: string): void,
} & OptionalClassname
export const CameraView = styled(({ className = '', onCapture }: CameraViewProps) => {
  const { width, height } = useViewportSize();
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tracks, setTracks] = useState<MediaStreamTrack[]>([])
  const aspectRatio = width / height

  useEffect(() => {
    // TODO: Permissions
    navigator.mediaDevices.getUserMedia({
      video: {
        width,
        height
      },
    })
      .then(stream => {
        if (!videoRef.current) return

        videoRef.current.srcObject = stream
        setTracks(stream.getTracks())
      })
  }, [width, height])

  useEffect(() => {
    setInterval(() => {
      if (!videoRef.current) return
      if (!canvasRef.current) return

      canvasRef.current.width = width
      canvasRef.current.height = height
      const context = canvasRef.current.getContext('2d')

      aspectRatio > 1
        ? context?.drawImage(videoRef.current, 0, 0, height * aspectRatio, height)
        : context?.drawImage(videoRef.current, 0, 0, width, width / aspectRatio)
    }, 100)
  }, [])

  return (
    <div
      onClick={() => {
        if (!canvasRef.current) return
        onCapture(canvasRef.current.toDataURL())
        // tracks.forEach(track => track.close())
      }}
      key={width}
      className={className}
      style={{
        // backgroundImage: `url(${imageUrl})`
      }}
    >
      <video
        autoPlay
        ref={videoRef}
        // style={{
        //   visibility: 'visible'
        // }}
      />
      <canvas
        style={{
          visibility: 'visible'
        }}
        ref={canvasRef}
      />
    </div>
  )
})`
  position: relative;
  height: 100vh;
  width: 100vw;

  canvas, video {
    visibility: hidden;
    position: absolute;
    top: 0;
    height: 100vh;
    width: 100vw;
  }
`
