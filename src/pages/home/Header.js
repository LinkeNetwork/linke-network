import homeIcon from '../../assets/images/linke-logo.svg'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import styled from 'styled-components'
import { useState } from "react";
import LanguageSwitch from '../layout/LanguageSwitch'
import { detectMobile } from '../../utils';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <HeaderContanier>
      <div className="header-content">
        <div className="header-left">
          <a href='/home'>
            <img src={homeIcon} alt="" className={detectMobile()? 'icon-client' : ''}/>
          </a>
        </div>
        <ul className="header-right">
          <li><Link to="/chat" target="_blank">CHAT</Link></li>
          <li onClick={() => alert('coming soon')}>DEVELOPER GARDEN</li>
        </ul>
        <div className='right-contanier' onClick={() => setShowMenu(true)}>
          <span className='iconfont icon-caidan'></span>
        </div>
        {
          showMenu && <Menu showMenu={showMenu} closeMenu={() => setShowMenu(false)}></Menu>
        }
        <LanguageSwitch/>
      </div>

    </HeaderContanier>
  )
}
const HeaderContanier = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  background: #fff;
  border-bottom: 1px solid #F2F2F2;
  .right-contanier {
    display: none
  }
 .header-left{
  margin-left: 20px;
 }
 .header-right {
  flex: 1;
  margin-left: 20px;
  li {
    cursor: pointer;
  }
 }
 .header-content {
  .icon-client {
    width: 137px;
    height: 30px;
   }
 }
 
 @media (max-width: 767px) {
  .header-right {
    display: none;
    li {
      font-size: 14px
    }
  }
  .right-contanier {
    display: block;
    margin-right: 20px;
  }
}
`
