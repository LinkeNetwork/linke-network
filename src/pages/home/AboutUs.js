import styled from 'styled-components'
import intl from 'react-intl-universal'
import { detectMobile } from '../../utils'

export default function AboutUs() {
  let list = [
    {
      title: 'AboutUsTitleOne',
      text: 'AboutUsTextOne',
    },
    {
      title: 'AboutUsTitleTwo',
      text: 'AboutUsTextTwo',
    },
    {
      title: 'AboutUsTitleThree',
      text: 'AboutUsTextThree',
    },
    {
      title: 'AboutUsTitleFour',
      text: 'AboutUsTextFour',
    }
  ]
  const textList = ['AboutUsSubTextOne', 'AboutUsSubTextTwo', 'AboutUsSubTextThree', 'AboutUsSubTextFour'].map((item, index) => {
    return (
      <li key={index} className="item-text">{intl.get(item)}</li>
    )
  })
  return (
    <AboutContainer>
      <div className={`about-container ${detectMobile() ? 'about-container-client' : ''}`}>
        <ul>
          {
            list.map((item, index) => {
              return (
                <li className='item' key={index}>
                  <div className='text-container'>
                    <div className='item-title'>{ intl.get(item.title) }</div>
                    <div className='item-text'>{intl.get(item.text)}</div>
                    {
                      index === 3 &&
                        <ul className='text-list'>{textList}</ul>
                    }
                  </div>

                </li>
              )
            })
          }
        </ul>
      </div>
    </AboutContainer>
  )
}

const AboutContainer = styled.div`
  margin: 60px 0 0;
  .about-container {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &-client {
      .item {
        width: 100%;
      }
    }
  }
  .title{
    font-size: 30px;
    font-weight: bold;
  }
  .item {
    background-repeat: no-repeat;
    width: 48%;
    padding: 30px 30px 30px 50px;
    margin-bottom: 60px;
    border-radius: 20px;
    color: #231815;
    display: flex;
    color: #fff;
    justify-content: space-between;
    &:nth-child(1){
      background-color: #582CF3;
    }
    &:nth-child(2){
      background-color: #D03AF9;
    }
    &:nth-child(3){
      background-color: #EF6D5A;
    }
    &:nth-child(4){
      background-color: #FDC31A;
    }
    &-title {
      font-size: 40px;
      font-weight: bold;
      color: #fff;
    }
    &-text {
      font-weight: bold;
      font-size: 20px;
      line-height: 30px;
      margin-top: 20px;
      list-style: disc;
      color: #fff;
    }
    &:nth-child(1) {
      img {
        width: 335px;
        height: 319px;
      }
    }
    &:nth-child(2) {
      img {
        width: 307px;
        height: 355px;
      }
    }
    &:nth-child(3) {
      img {
        width: 312px;
        height: 315px;
      }
    }
    &:nth-child(4) {
      img {
        width: 289px;
        height: 280px;
      }
    }
  }
  .text-list {
    display: flex;
    flex-direction: column;
    .item-text{
      margin-left: 20px;
      margin-top: 2px;
    }
  }
  .introduction{
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 32px;
  }
  @media (max-width: 991.98px) {
    margin-top: 40px;
    .item {
      display: flex;
      padding: 30px 15px;
      height: auto;
      margin: 10px 0;
      &-title {
        font-size: 22px;
      }
      &-text {
        font-size: 15px;
        line-height: 24px;
      }
    }
    .image-container{
      display: flex;
      justify-content: center;
    }
    .title {
      font-size: 26px;
    }
    .introduction{
      font-size: 15px;
      line-height: 24px;
      margin: 20px 0 30px;
    }
  }
  @media (max-width: 767px) {
    .item {
      flex-direction: column;
    }
  }
`