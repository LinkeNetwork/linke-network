import styled from "styled-components"
import bgImage from '../../assets/images/introduction.svg'
import intl from "react-intl-universal";

export default function Introduction() {
  return (
    <IntroductionContainer>
      <div className="title">
        <div>{intl.get('IntroductionTitle')}</div>
        <div className="sub-title">{intl.get('IntroductionTitleSub')}</div>
      </div>
      <div className="info">
          {intl.get('IntroductionText')}
      </div>
    </IntroductionContainer>
  )
}

const IntroductionContainer = styled.div`
  padding: 50px 0 0;
  color: #231815;
  text-align: center;
  .title {
    font-size: 40px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 32px;
    font-weight: normal;
  }
  .info {
    font-size: 22px;
    max-width: 1228px;
    margin: 54px auto 0;
    padding: 0 30px;
  }
  @media (max-width: 991.98px) {
    padding: 20px 0;
    .title, .info {
      font-size: 20px;
      padding: 30px;
    }
    .info {
      font-size: 15px;
      padding: 0 30px;
    }
  }
`
