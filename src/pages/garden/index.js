import React, { lazy } from "react"
import './index.scss'
const Header = lazy(() => import('../home/Header'))

const Banner = lazy(() => import('./Banner'))
const ContentInfo = lazy(() => import('./ContentInfo'))
const Footer = lazy(() => import('../home/Footer'))

export default function Garden() {
  return(
    <div className="garden-wrap">
      <Header/>
      <Banner/>
      <ContentInfo />
      <Footer/>
    </div>
  )
}