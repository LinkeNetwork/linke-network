import { lazy } from 'react'
const Chat = lazy(() => import('./pages/chat/index'))
const Profile = lazy(() => import('./pages/profile/index'))
const CheckIn = lazy(() => import('./pages/airdrop/CheckIn'))

const routes = [
  {
    name: 'Home',
    path: '/',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/home/index'))
  },
  {
    path: "/chat",
    component: Chat,
    routes: [
      {
        path: "/chat/:id",
        component: Chat
      }
    ]
  },
  
  {
    path: "/checkin",
    component: CheckIn,
    routes: [
      {
        path: "/checkin",
        component: CheckIn
      }
    ]
  },
  {
    path: "/profile",
    component: Profile,
    routes: [
      {
        path: "/profile/:id",
        component: Profile
      }
    ]
  },
  {
    name: 'Garden',
    path: '/garden',
    exact:true,
    ico:'garden',
    compontent: lazy(() => import('./pages/garden/index'))
  }
]
export default routes

