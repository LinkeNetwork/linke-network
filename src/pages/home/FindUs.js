import Image from '../../component/Image'
import twitterImage from '../../assets/images/twitter.png'
import groupImage from '../../assets/images/linke.png'
import mediumImage from '../../assets/images/medium.png' 
import twitterImage1 from '../../assets/images/twitter1.png'
import groupImage1 from '../../assets/images/linke1.png'
import mediumImage1 from '../../assets/images/medium1.png' 
import styled from 'styled-components'
export default function FindUs(props) {
  const { type } = props
  return (
    <FindUsContainer>
      <a href="https://twitter.com/LinkeNetwork" target="_blank" rel="noreferrer">
        <Image size={type === 'footer' ? 50 : 40} src={type === 'footer' ? twitterImage : twitterImage1} />
      </a>
      <a href="https://www.linke.network/chat/0xb114927a3df6085bc7c808c07e87b8447a6e9469" target="_blank" rel="noreferrer">
        <Image size={type === 'footer' ? 50 : 40} src={type === 'footer' ? groupImage : groupImage1}/>
      </a>
      <a href="https://medium.com/@LinkeNetwork" target="_blank" className={`${type === 'footer' ? 'medium-link': ''}`} rel="noreferrer">
        {/* <div className={`medium-wrap ${type === 'footer' ? '' : 'small'}`}>
          <span className="iconfont icon-medium"></span>
        </div> */}
        <Image size={type === 'footer' ? 50 : 40} src={type === 'footer' ? mediumImage : mediumImage1}/>
      </a>
    </FindUsContainer>
  )
}

const FindUsContainer = styled.div`
 display: flex;
 align-items: center;
 .medium-wrap {
  width: 60px!important;
  height: 60px;
  border-radius: 50%;
  border: 1.5px solid #FFB600;
  display: block;
  background-color: #602C00;
  display: flex;
  align-items: center;
  justify-content: center;
  &.small {
    width: 40px!important;
    height: 40px;
    background: #fff;
    justify-content: center;
    .icon-medium {
      font-size: 12px;
     }
  }
 }
 .icon-medium {
  font-size: 20px;
  color: #FFB600;
 }
 @media (max-width: 991.98px) {
  .medium-wrap {
    width: 40px!important;
    height: 40px;
  }
  .icon-medium {
    font-size: 12px;
   }
 }
 
`