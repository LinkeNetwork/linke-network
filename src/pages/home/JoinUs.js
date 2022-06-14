import styled from "styled-components"
import intl from 'react-intl-universal'
import { detectMobile } from '../../utils'
import joinUsBg from '../../assets/images/join-us-bg.png'
export default function JoinUs() {
  return (
    <JoinUsContanier style={{ backgroundImage: `url(${joinUsBg})` }}  className={`${detectMobile() ? 'container-client' : ''}`}>
      <div className="join-wrapper">
        <div className="left-wrap">
          {intl.get('JoinUsTitleOne')}
        </div>
        <div className="right-wrap">
          <div className="title">
            {intl.get('JoinUsTextOne')}
          </div>
          <div>
            {intl.get('JoinUsTextTwo')}
          </div>
          <div className="join-btn">
            {intl.get('JoinUsBtn')}
          </div>
        </div>
      </div>

    </JoinUsContanier>
  )
}
const JoinUsContanier = styled.div`
background-size: 100%;
width: 100%;
margin: 100px 0;
&.container-client {
  margin: 50px 0;
  .join-wrapper {
    flex-direction: column;
    width: 90%;
    .left-wrap {
      margin: 0 0 20px 0;
      font-size: 34px;
      width: 100%;
    }
    .right-wrap {
      width: 100%;
    }
  }
}
.join-wrapper{
  max-width: 1400px;
  width: 80%;
  margin: 0 auto;
  padding: 35px 0;
  display: flex;
  justify-content: space-between;
}
.left-wrap {
  font-size: 40px;
  color: #fff;
  width: 410px;
  margin: 0 2% 0 50px; 
}
.right-wrap {
  font-size: 20px;
  color: #fff;
  width: 50%;
  .title {
    margin-bottom: 40px;
  }
  .join-btn {
    text-decoration: underline;
    cursor: pointer;
  }
}
`