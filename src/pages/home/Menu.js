import styled from "styled-components";
import { Link } from 'react-router-dom'
import logo from '../../assets/images/linke-logo.svg'
import FindUs from './FindUs'
import LanguageSwitch from "../layout/LanguageSwitch";
export default function Menu(props) {
  const { closeMenu, showMenu } = props
  return (
    <div>
      {
        showMenu &&
        <MenuContainer>
          <div className="menu-top">
            <div className="menu-left">
              <img src={logo} alt="" />
            </div>
            <div className="close-contanier" onClick={() => closeMenu()}>
              <span className="iconfont icon-guanbi"></span>
            </div>
          </div>

          <ul className="menu-item">
            <li><Link to="/chat" target="_blank">CHAT</Link></li>
            {/* <li onClick={() => alert('come soon')}>DEVELOPER GARDEN</li> */}
          </ul>

          <div className="language-wrapper"><span>Language</span><LanguageSwitch /></div>
          <div className="menu-bottom">
            <div className="menu-bottom-left">
              <div>FIND US ON PREVIOUS</div>
              <div>GEN SOCIAL MEDIA</div>
            </div>
            <div className="menu-bottom-right">
              <FindUs className="find-us" style={{ width: '130px' }} type={'menu'}></FindUs>
            </div>
          </div>
        </MenuContainer>
      }
    </div>

  )
}
const MenuContainer = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
  .close-contanier{
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: #FFB600;
    // border-radius: 50%;
    color: #333;
  }
  .menu-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 20px 20px;
  }
  .menu-left {
    img {
      width: 137px;
      height: 30px;
    }
  }
  .menu-item {
    margin: 130px 20px 20px 30px;
    li {
      font-size: 20px;
      line-height: 60px;
      font-weight: bold;
      color: #666;
    }
  }
  .language-wrapper {
    position: fixed;
    bottom: 120px;
    right: 20px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 16px;
    }
  }
  .language-switch-client {
    display: flex;
    justify-content: end;
  }
  .menu-bottom {
    display: flex;
    position: fixed;
    bottom: 40px;
    left: 20px;
    right: 20px;
    justify-content: space-between;
  }
  .menu-bottom-left {
    color: #666;
    font-size: 16px;
  }
  .menu-bottom-right {
    div {
      width: 130px;
      justify-content: space-between;
    }
  }
`