import styled from "styled-components"
import Image1 from '../../assets/images/introduction1.svg'
import Image2 from '../../assets/images/introduction2.svg'
import Image3 from '../../assets/images/introduction3.svg'
import Image4 from '../../assets/images/introduction4.svg'
import Image5 from '../../assets/images/introduction5.svg'
import Image6 from '../../assets/images/introduction6.svg'
import intl from "react-intl-universal";

export default function Performance() {
  let list = [
    {
      text: 'BuildText1',
      image: Image1
    },
    {
      text: 'BuildText2',
      image: Image2
    },
    {
      text: 'BuildText3',
      image: Image3
    },
    {
      text: 'BuildText4',
      image: Image4
    },
    {
      text: 'BuildText5',
      image: Image5
    },
    {
      text: 'BuildText6',
      image: Image6
    }
  ]
  return (
    <PerformanceContainer>
      <div className="title">{intl.get('BuildTitle')}</div>
      <div className="item-container">
        {
          list.map((item, index) => {
            return (
              <div key={index} className="item">
                <img src={item.image} alt="" />
                <div style={{fontSize: '22px'}}>{intl.get(item.text)}</div>
              </div>
            )
          })
        }
      </div>

    </PerformanceContainer>
  )
}

const PerformanceContainer = styled.div`
  max-width: 1200px;
  margin: 110px auto 0;
  text-align: center;
  .title {
    font-size: 32px;
    margin: 50px 0;
    font-weight: bold;
  }
  .item {
    text-align: center;
    color: #fff;
    max-width: 380px;
    width: 27%;
    height: 380px;
    background-size: 150px 154px;
    background-repeat: no-repeat;
    margin: 0 15px 15px 0;
    border-radius: 15px;
    font-size: 22px;
    &:nth-child(1),&:nth-child(6) {
      background-color: #582CF3
    }
    &:nth-child(2),&:nth-child(4) {
      background-color: #D03AF9
    }
    &:nth-child(3),&:nth-child(5) {
      background-color: #FDC31A
    }
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
  img {
    width: 150px;
    height: 154px;
    margin: 90px auto 60px;
  }
  @media (max-width: 991.98px) {
    .item:nth-child(even) {
      margin-right: 0
    }
    img {
      width: 80px;
      height: 80px;
      margin: 40px 0;
    }
    .title {
      font-size: 26px;
    }
    .item-container {
      padding: 0 20px;
      justify-content: space-between;
      .item {
        width: 47%;
        height: 220px;
      }
    }
  }
  @media (min-width: 1450px) {
    .item-container {
      .item {
        width: 380px
      }
    }
  }
`
