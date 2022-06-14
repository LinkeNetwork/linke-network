import styled from "styled-components"
import partner1 from '../../assets/images/partner1.png'
import partner2 from '../../assets/images/partner2.png'
import partner3 from '../../assets/images/partner3.png'
import partner4 from '../../assets/images/partner4.png'
import partner5 from '../../assets/images/partner5.png'
import partner6 from '../../assets/images/partner6.png'
import partner7 from '../../assets/images/partner7.png'
import partner8 from '../../assets/images/partner8.png'
import partner9 from '../../assets/images/partner9.png'
import partner10 from '../../assets/images/partner10.png'
import intl from "react-intl-universal";
import { detectMobile } from '../../utils'
export default function Partner() {
  const partnerList = [
    partner1, partner2, partner3, partner4, partner5, partner6, partner7, partner8, partner9, partner10
  ]
  return(
    <PartnerContanier>
      <div className={`title ${detectMobile() ? 'title-client' : ''}`}>{intl.get('PartnerText')}</div>
      <ul className={`${detectMobile() ? 'image-wrap-client' : ''}`}>
        {
          partnerList.map((item,index) => {
            return(
              <li className="image-wrap" key={index}>
                <img src={item} />
              </li>
            )
          })
        }
      </ul>
    </PartnerContanier>
  )
}
const PartnerContanier = styled.div`
.title {
  text-align: center;
  font-size: 40px;
  margin: 114px 0 44px;
  font-weight: bold;
}
ul {
  border: 1px solid #000;
  border-radius: 20px;
  padding: 65px 56px 10px;
  display: flex;
  flex-wrap: wrap;
  .image-wrap {
    display: flex;
    align-items: center;
    margin: 0 92px 50px 0;
    width: 200px;
    img {
      width: 100%
    }
    &:nth-child(3) {
      width: 159px;
      img {
        width: 100%;
      }
    }
    // &:nth-child(4), &:nth-child(8){
    //   margin-right: 0
    // }
    &:nth-child(6), &:nth-child(8){
      width: 180px;
    }
    &:nth-child(7){
      width: 300px;
    }
    &:nth-child(5), &:nth-child(6), &:nth-child(7){
      margin-right: 60px
    }
    &:nth-child(9){
      width: 280px;
    }
  }
  @media (max-width: 1450px) {
    .image-wrap {
      &:nth-child(4), &:nth-child(8){
        margin-right: 0
      }
    }
  }
}
ul.image-wrap-client {
  padding: 30px 30px 0px;
  .image-wrap{
    width: 140px;
    margin: 0 40px 20px 0;
    &:nth-child(even) {
      margin-right: 0
    }
    &:nth-child(3) {
      width: 110px;
      margin-right: 70px;
    }
    &:nth-child(7){
      width: 180px;
      margin-right: 10px;
      margin-left: -10px;
    }
  }
}
`