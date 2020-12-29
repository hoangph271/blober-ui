import styled from 'styled-components';
import { AuthContextProvider, useAuth } from './hooks';
import { LoginForm } from './components';
import { AlbumsView, CameraView } from './pages';
import { useState } from 'react';

type AppProps = {
  className?: string,
}
function App({ className = '' }: AppProps) {
  const { isAuthed } = useAuth()
  // const [showWebcam, setShowWebcam] = useState(false);
  // const [imageUrl, setImageUrl] = useState('')

  // if (imageUrl) return <img src={imageUrl} alt="image" />

  // if (showWebcam) {
  //   return (
  //     <CameraView onCapture={setImageUrl} />
  //   )
  // } else {
  //   return (
  //     <button onClick={() => setShowWebcam(true)}>
  //       {'Go'}
  //     </button>
  //   )
  // }

  return (
    <div className={`App ${className}`}>
      {isAuthed ? (
        <AlbumsView />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}


const StyledApp = styled(App)`
  width: 100vw;
`;

const AppRoot = () => {
  return (
    <AuthContextProvider>
      <StyledApp />
    </AuthContextProvider>
  )
}
export default AppRoot;
