import { Suspense } from 'react'
import { AppProvider } from './context/AppGlobalState'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Header from './pages/layout/HeaderInfo'
import routes from './routes'
import PageLoading from './component/PageLoading'
import './assets/index.scss'
const urlParams = new URLSearchParams(window.location.search)
const isShare = urlParams.get('share')
export default function App() {
  const pages = routes.map((item, index) => {
    const {compontent:Page,...rest } = item
    return <Route {...rest} key={index} render={routerProps => <Page {...rest} {...routerProps} />} />
  })
  return (
    <Suspense fallback={<PageLoading />}>
      <AppProvider>
        <BrowserRouter>
          {
            !isShare && <Header />
          }
          <Switch>
            <Suspense fallback={<PageLoading />}>
              {pages}
            </Suspense>
          </Switch>
        </BrowserRouter>
      </AppProvider>
    </Suspense>
  )
}
