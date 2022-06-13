import React, { lazy } from "react"
import './home.scss'
import Header from "./Header"
const CountInfo = lazy(() => import('./CountInfo'))
const Banner = lazy(() => import('./Banner'))
const Version = lazy(() => import('./Version'))
const JoinUs = lazy(() => import('./JoinUs'))
const AboutUs = lazy(() => import('./AboutUs'))
const Introduction = lazy(() => import('./Introduction'))
const Performance = lazy(() => import('./Performance'))
const Partner = lazy(() => import('./Partner'))
const Member = lazy(() => import('./Member'))
const Footer = lazy(() => import('./Footer'))

export default function Home() {
  return(
    <div>
      <Header/>
      <Banner/>
      <CountInfo />
      <Version />
      <JoinUs />
      <AboutUs/>
      <Introduction/>
      <Performance/>
      <Partner />
      <Member />
      <Footer/>
    </div>
  )
}
