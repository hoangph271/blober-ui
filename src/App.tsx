import { ComponentType } from 'react'
import styled from 'styled-components'
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom'
import { AuthContextProvider, useAuth } from './hooks'
import * as Views from './pages'

const withAuthRequired = (View: ComponentType<any>) => {
  return () => {
    const { isAuthed } = useAuth()

    return isAuthed ? <View /> : <Redirect to="/login" />
  }
}

type AppProps = {
  className?: string,
}
function App ({ className = '' }: AppProps) {
  return (
    <div className={`App ${className}`}>
      <BrowserRouter>
        <Switch>
          <Route path="/albums/:id" component={withAuthRequired(Views.AlbumDetail)} />
          <Route path="/albums" component={withAuthRequired(Views.AlbumsList)} />
          <Route path="/login" component={Views.Login} />
          <Route path="/profile" component={Views.Profile} />
          <Route path="/files/:_id?" component={Views.FileSystem} />
          <Route component={() => <Redirect to="/files" />} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

const StyledApp = styled(App)`
  width: 100vw;
  overflow: hidden;
`

const AppRoot = () => {
  return (
    <AuthContextProvider>
      <StyledApp />
    </AuthContextProvider>
  )
}
export default AppRoot
