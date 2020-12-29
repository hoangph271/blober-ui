import styled from 'styled-components';
import { AuthContextProvider, useAuth } from './hooks';
import { AlbumsView, LoginForm } from './components';

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
`;

const AppRoot = () => {
  return (
    <AuthContextProvider>
      <StyledApp />
    </AuthContextProvider>
  )
}
export default AppRoot;
