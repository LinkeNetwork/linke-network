import React from 'react'
import intl from "react-intl-universal";
import styled from 'styled-components'
import banner from '../../assets/images/garden-banner.svg'
import linkeLogo from '../../assets/images/linke-logo.svg'
import './index.scss'
import { detectMobile } from '../../utils';
export default function Banner() {
  return(
    <div className='banner-wrap'>
      <div className={`banner-container ${detectMobile() ? 'banner-container-client': ''}`} style={{ backgroundImage: `url(${banner})`}}>
        <img src={linkeLogo} alt='' className='logo-img'/>
        <div className={`title-wrap ${detectMobile() ? 'title-wrap-client': ''}`}>
          <div className='title title-small'>{intl.get('GardenBannerTitle1')}</div>
          <div className='title title-big'>{intl.get('GardenBannerTitle2')}</div>
          <div className='title title-small'>{intl.get('GardenBannerTitle3')}</div>
        </div>
      </div>
    </div>
  )
}

  