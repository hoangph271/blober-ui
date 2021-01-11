import styled from 'styled-components';
import { AuthContextProvider, useAuth } from './hooks';
import { LoginForm } from './components';
import { AlbumsView } from './pages';

type AppProps = {
  className?: string,
}
function App({ className = '' }: AppProps) {
  const { isAuthed } = useAuth()

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
