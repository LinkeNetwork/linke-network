import styled from "styled-components"
import intl from 'react-intl-universal'
import joinUsBg from '../../assets/images/join-us-bg.png'
export default function JoinUs() {
  return (
    <JoinUsContanier style={{ backgroundImage: `url(${joinUsBg})` }}>
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
.join-wrapper{
  padding: 35px 0;
  width: 80%;
  max-width: 1400px;
  display: flex;
  min-width: 1160px;
  margin: 0 auto;
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