import styled from "styled-components"
import { useLocation } from 'react-router-dom'
import Modal from '../../component/Modal'
import intl from "react-intl-universal"
import ConnectionInfo from '../chat/ConnectInfo'
import { Jazzicon } from '@ukstv/jazzicon-react';
import { detectMobile, formatAddress, getLocal } from '../../utils'
import TopMenu from '../../component/TopMenu'
import CurrentNetwork from '../chat/CurrentNetwork'
import LanguageSwitch from './LanguageSwitch'
import homeIcon from '../../assets/images/linke-logo.svg'
import ChangeNetwork from '../chat/ChangeNetwork'
import ErrorNetwork from '../layout/ErrorNetwork'
import { useEffect, useState } from "react";
import Nav from "../nav";
import Menu from "../home/Menu";
import HomeHeader from '../home/Header'
import useWallet from "../../hooks/useWallet";
import useGlobal from "../../hooks/useGlobal";
export default function HeaderInfo() {
  const { balance, chainId, network, changeNetwork, disConnect, connectOkexchain } = useWallet()
  const locations = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const { setState, showConnectNetwork, accounts, showHeader } = useGlobal()
  const [showAccount, setShowAccount] = useState(false)
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [showHomeHeader, setShowHomeHeader] = useState(true)
  const [showMenulist, setShowMenulist] = useState(false)
  const isConnect = (+getLocal('isConnect'))
  const selectNetwrok = (item) => {
    switch(item.name) {
      case 'MetaX':
        connectOkexchain()
        break;
      case 'MetaMask':
        changeNetwork(item.network)
        break;
      default:
        console.log('Unknown')
    }
    setShowConnectWallet(false)
  }
  const handleDisconnect = () => {
    setShowAccount(false)
    disConnect()
    setState({
      groupLists: []
    })
  }
  useEffect(() => {
    if(showConnectNetwork) {
      setShowConnectWallet(true)
    }
    setShowHomeHeader(locations.pathname !== '/')
  }, [locations, showConnectNetwork, isConnect])
  useEffect(() => {
    const isShare = locations?.search.split('share=')[1] || locations?.state?.share
    if(Boolean(isShare)) {
      setState({
        showHeader: false
      })
      setShowHomeHeader(false)
    }
  }, [locations, setState])
  useEffect(() => {
    let data = locations?.state?.share
    if (data) {
      setShowHomeHeader(false)
    }
  }, [locations])
  return (
    <HeaderInfoContanier>
      {
        showMenu && <Menu showMenu={showMenu} closeMenu={() => setShowMenu(false)}></Menu>
      }
      <Modal title={intl.get('Account')} visible={showAccount} onClose={() => setShowAccount(false)}>
        <ConnectionInfo account={accounts} handleDisconnect={() => handleDisconnect()} />
      </Modal>
      <Modal title="Connect Wallet" visible={showConnectWallet} onClose={() => setShowConnectWallet(false)}>
        <ChangeNetwork handleChangeNetWork={(item) => selectNetwrok(item)} closeNetworkContainer={() => setShowConnectWallet(false)} />
      </Modal>
      {
        showHomeHeader && <Nav showMenulist={showMenulist} hiddenMenuList={() => { setShowMenulist(false) }} />
      }
      {
        showHeader &&
        <div className='header-top-wrap'>
        {
          !showHomeHeader && 
          <HomeHeader handleShowMenu={() => setShowMenu(true)}/>
        }
        {
          detectMobile() &&
          <div className='home-icon-header'>
            <a href='/'>
              <img src={homeIcon} alt="" />
            </a>
            {
              locations.pathname !== '/' &&
              <TopMenu handleMenu={() => setShowMenulist(true)}/>
            }
          </div>

        }
        {
          showHomeHeader && (accounts || getLocal('account')) &&
          <div className='header-top-info'>
            {
              chainId !== 513100 &&
              <ErrorNetwork handleChangeNetwork={() => setShowConnectWallet(true)}/>
            }
            <CurrentNetwork currNetwork={network} handleChangeNetwork={() => setShowConnectWallet(true)} />
            <div className="balance-wrap">
              <span style={{ marginRight: '4px' }}>{Number(balance).toFixed(4)}</span><span>{network}</span>
            </div>
            {
              (chainId === 513100) && accounts &&
              <span className='header-top' onClick={() => setShowAccount(true)}>
                <Jazzicon address={accounts} className="account-icon" />
                {formatAddress(accounts)}
              </span>
            }
          </div>
        }
        <LanguageSwitch />
      </div>

      }
      
    </HeaderInfoContanier>
  )
}
const HeaderInfoContanier = styled.div`
  background: #fff;
  width: 100%;
  .balance-wrap{
    padding: 6px 10px;
    background: #f6f6f6;
    border-radius: 90px;
    font-size: 12px;
    font-weight: 800;
  }
  .home-icon-header {
    display: flex;
    flex: 1;
    justify-content: space-between;
    img {
      width: 117px;
    }
  }
  .header-top-wrap {
    background: #fff;
    z-index: 7;
    height: 60px;
    display: flex;
    border-bottom: 1px solid #dee2e6;
    align-items: center;
    padding: 0 10px;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    &-client {
      border: none;
    }
  }
  .header-top-info{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 4;
    .header-top {
      font-weight: 500;
      font-size: 12px;
      background: #333;
      color: #fff;
      padding: 6px 10px;
      border-radius: 90px;
      cursor: pointer;
      transition: 0.3s;
      display: flex;
      align-items: center;
      .account-icon {
        width: 16px;
        height: 16px;
        overflow: hidden;
        margin-right: 4px;
      }
    }
  }
  @media (max-width: 991px){
    .balance-wrap {
      background: #fff;
      border-radius: 5px 0 0 5px;
    }
  }
`
