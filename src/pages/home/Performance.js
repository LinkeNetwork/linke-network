import styled from "styled-components"
import Image1 from '../../assets/images/introduction1.svg'
import Image2 from '../../assets/images/introduction2.svg'
import Image3 from '../../assets/images/introduction3.svg'
import Image4 from '../../assets/images/introduction4.svg'
import Image5 from '../../assets/images/introduction5.svg'
import Image6 from '../../assets/images/introduction6.svg'
import intl from "react-intl-universal";
import { detectMobile } from "../../utils"

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
    <PerformanceContainer className={`${detectMobile() ? 'container-client' : ''}`}>
      <div className={`title ${detectMobile() ? 'title-client' : ''}`}>{intl.get('BuildTitle')}</div>
      <div className={`item-container ${detectMobile() ? 'item-container-client' : ''}`}>
        {
          list.map((item, index) => {
            return (
              <div key={index} className="item">
                <img src={item.image} alt="" />
                <div className="text">{intl.get(item.text)}</div>
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
  &.container-client {
    margin-top: 40px;
  }
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
    .text {
      font-size: 22px;
    }
    &-client {
      justify-content: space-between;
      .text {
        font-size: 18px;
      }
      .item:nth-child(even) {
        margin-right: 0
      }
      .item {
        width: 48%;
        height: inherit;
        padding-bottom: 30px;
        img {
          width: 100px;
          height: 100px;
          margin: 30px 0;
        }
      }
    }
  }
  .title-client {
    font-size: 26px;
  }
  img {
    width: 150px;
    height: 154px;
    margin: 90px auto 60px;
  }
  @media (min-width: 1450px) {
    .item-container {
      .item {
        width: 380px
      }
    }
  }
`