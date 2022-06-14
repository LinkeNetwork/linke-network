import React from 'react'
import styled from 'styled-components'
import banner from '../../assets/images/banner.png'
import titleLogo from '../../assets/images/title.png'
import intl from "react-intl-universal"
import { detectMobile } from "../../utils"
export default function Banner() {
  return(
    <BannerContainer className={`${detectMobile() ? 'container-client' : ''}`}>
      <div className='banner-left'>
        <div className='banner-title'>
          <img src={titleLogo}/>
        </div>
        <div className='banner-info'>{intl.get("BannerText") }</div>
      </div>
      <div className='banner-right'>
        <img src={banner}/>
      </div>
    </BannerContainer>
  )
}
const BannerContainer = styled.div`
  margin: 60px auto 0;
  display: flex;
  position: relative;
  padding-top: 48px;
  align-items: center;
  &.container-client {
    flex-direction: column;
    .banner-left{
      width: 100%
    }
    .banner-left {
      margin-right: 0;
    }
    .banner-right {
      width: 90%;
      margin-top: 30px;
    }
    .banner-title {
      width: 70%;
      margin: 0 auto 20px;
    }
  }
  .banner-left {
    display: flex;
    flex-direction: column;
    width: 41%;
    margin-right: 8%;
  }
  .banner-right {
    width: 50%;
    img {
      width: 100%
    }
  }
  .banner-title {
    color: #231815;
    font-size: 40px;
    margin-bottom: 20px;
    text-align: center;
    img {
      width: 100%
    }
  }
  .banner-info {
    font-size: 18px;
    color: #231815;
  }
  @media (max-width: 991.98px) {
    .banner-title {
      bottom: 220px
    }
  }
  @media (max-width: 767px) {
    .banner-title {
      font-size: 26px;
      bottom: 220px;
    }
    .banner-info {
      font-size: 15px;
      padding: 0 30px;
      bottom: 120px;
      line-height: 24px;
    }
  }
`
const FollowButton = styled.button`
  position: absolute;
  bottom: 50px;
  font-size: 20px;
  width: 100%;
  .follow-us {
    width: 180px;
    display: inline-block;
    height: 44px;
    background: #fff;
    border-radius: 30px;
    line-height: 44px;
    font-size: 16px;
    font-weight: bold;
    color: #231815;
  }
  @media (max-width: 991.98px) {
    bottom: 40px;
  }
`