import styled from "styled-components"
import FindUs from './FindUs'
import intl from "react-intl-universal";
import footerBg from '../../assets/images/footer-bg.png'
export default function Footer() {
  return (
    <FooterContainer style={{ backgroundImage: `url(${footerBg})` }}>
      <div className="footer-container">
        <div className="title">{intl.get('BottomTitle')}</div>
        <div className="info">{intl.get('BottomInfo')}</div>
        <div className="bottom-container">
          <div className="title">{intl.get('SocialMedia')}</div>
          <div className="img-container">
            <FindUs type={'footer'}></FindUs>
          </div>
        </div>
      </div>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
  margin: 0 auto;
  height: 462px;
  text-align: center;
  .footer-container {
    max-width: 1226px;
    margin: 0 auto;
  }
  .title {
    font-size: 32px;
    color: #FFB600;
    padding: 44px 0 34px;
  }
  .info {
    font-size: 22px;
    color: #fff;
    padding: 0 30px;
  }
  .img-container {
    img {
      width: 60px;
    }
  }
  .bottom-container {
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      padding: 60px 0 54px;
    }
  }
  .img-container {
    width: 254px;
    display: flex;
    justify-content: space-between;
    div {
      width: 100%;
      justify-content: space-evenly;
    }
  }
  @media (max-width: 991.98px) {
    padding-top: 10px;
    height: 360px;
    .info {
      font-size: 15px;
      padding: 0 30px;
    }
    .title {
      font-size: 20px;
      padding: 40px 0;
    }
    .img-container {
      width: 200px;
    }
    .bottom-container {
      .title {
        padding: 20px!important
      }
    }
  }
`