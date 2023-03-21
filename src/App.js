// import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom'
// import {AppProvider} from './context/AppGlobalState'
// import Chat from './pages/chat/index';
// import Home from './pages/home/index';
// import Garden from './pages/garden/index'
// import Profile from './pages/profile/index'
// import './assets/index.scss';

// export default function App() {
//     return (
//         <AppProvider>
//           <BrowserRouter>
//             <Switch>
//                 <Route path="/home" component={Home}/>
//                 <Route path="/chat" component={Chat}/>
//                 <Route path="/garden" component={Garden}/>
//                 <Route path="/profile" component={Profile}/>
//                 <Redirect from="/" to="/home" exact/>
//             </Switch>
//           </BrowserRouter>
//         </AppProvider>
//     )
// }
import { Suspense } from 'react'
import { AppProvider } from './context/AppGlobalState'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Header from './pages/layout/HeaderInfo'
import routes from './routes'
import PageLoading from './component/PageLoading'
import './assets/index.scss'

export default function App() {
  const pages = routes.map((item, index) => {
    const {compontent:Page,...rest } = item
    return <Route {...rest} key={index} render={routerProps => <Page {...rest} {...routerProps} />} />
  })
  return (
    <Suspense fallback={<PageLoading />}>
      <AppProvider>
        <BrowserRouter>
          <Header />
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
