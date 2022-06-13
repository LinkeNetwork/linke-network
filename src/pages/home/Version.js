import aboutImage1 from '../../assets/images/about1.png'
import aboutImage2 from '../../assets/images/about2.png'
import styled from 'styled-components'
import intl from 'react-intl-universal'

export default function AboutUs() {
  let list = [
    {
      title: 'VersionTitleOne',
      text: 'VersionTextOne',
      image: aboutImage1
    },
    {
      title: 'VersionTitleTwo',
      text: 'VersionTextTwo',
      image: aboutImage2
    }
  ]
  return (
    <VersionContainer>
      <div className='about-container'>
        <ul>
          {
            list.map((item, index) => {
              return (
                <li className='item' key={index}>
                  <div className='image-container'>
                    <img src={item.image} alt="" />
                  </div>
                  <div className='text-container'>
                    <div className='item-title'>{ intl.get(item.title) }</div>
                    <div className='item-text'>{intl.get(item.text)}</div>
                    {
                      index === 0 &&
                        <div className='item-text'>{intl.get('VersionTextOneSub')}</div>
                    }
                  </div>

                </li>
              )
            })
          }
        </ul>
      </div>
    </VersionContainer>
  )
}

const VersionContainer = styled.div`
  margin: 120px 0 0;
  .about-container {
    margin: 0 auto;
    width: 80%;
    position: relative;
    min-width: 1160px;
    max-width: 1400px;
  }
  .title{
    font-size: 30px;
    font-weight: bold;
  }
  .item {
    border-radius: 30px;
    padding: 30px;
    color: #231815;
    margin-bottom: 50px;
    display: flex;
    justify-content: space-between;
    &:nth-child(odd){
      background-color: #582CF3;
      flex-direction: row-reverse;
      .text-container {
        margin-left: 20px;
      }
    }
    &:nth-child(even){
      background-color: #D03AF9;
      color: #FFB600;
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
      color: #fff;
    }
    .text-container {
      max-width: 611px;
      width: 45%;
    }
    .image-container {
      width: 45%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .introduction{
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 32px;
  }
  @media (max-width: 991.98px) {
    padding: 0 1rem;
    margin-top: 40px;
    .item {
      display: flex;
      padding: 30px 15px;
      height: auto;
      margin: 20px 0;
      &:nth-child(even){
        img {
          margin: 40px 0;
        }
      }
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
