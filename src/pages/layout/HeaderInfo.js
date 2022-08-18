import styled from "styled-components"
import { useLocation } from 'react-router-dom'
import Modal from '../../component/Modal'
import ConnectionInfo from '../chat/ConnectInfo'
import { Jazzicon } from '@ukstv/jazzicon-react';
import { detectMobile, formatAddress } from '../../utils'
import TopMenu from '../../component/TopMenu'
import CurrentNetwork from '../chat/CurrentNetwork'
import LanguageSwitch from './LanguageSwitch'
import homeIcon from '../../assets/images/linke-logo.svg'
import ChangeNetwork from '../chat/ChangeNetwork'
import ErrorNetwork from '../layout/ErrorNetwork'
import { useEffect, useState } from "react";
import HomeHeader from '../home/Header'
export default function HeaderInfo(props) {
  const locations = useLocation()
  const { showHeaderInfo, myAddress, currNetwork, handleMenu, handleShowAccount, handleChangeNetWork, handleDisconnect, showAccount, onCloseAccount, chainId, balance } = props
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [showHomeHeader, setShowHomeHeader] = useState(true)
  const selectNetwrok = (network) => {
    setShowConnectWallet(false)
    handleChangeNetWork(network)
  }
  const showAccountInfo = () => {
    onCloseAccount()
    handleShowAccount()
  }
  useEffect(() => {
    setShowHomeHeader(locations.pathname !== '/')
  }, [locations.pathname])
  return (
    <HeaderInfoContanier>
      <Modal title="Account" visible={showAccount} onClose={() => onCloseAccount()}>
        <ConnectionInfo account={myAddress} handleDisconnect={() => handleDisconnect()} />
      </Modal>
      <Modal title="Connect Wallet" visible={showConnectWallet} onClose={() => setShowConnectWallet(false)}>
        <ChangeNetwork handleChangeNetWork={(network) => selectNetwrok(network)} closeNetworkContainer={() => setShowConnectWallet(false)} />
      </Modal>
      <div className='header-top-wrap'>
        {
          !showHomeHeader &&
          <HomeHeader />
        }
        
        {
          detectMobile() &&
          <div className='home-icon-header'>
            <a href='/'>
              <img src={homeIcon} alt="" />
            </a>
            <TopMenu handleMenu={() => handleMenu()} />
          </div>

        }
        {
          showHeaderInfo &&
          <div className='header-top-info'>
            {
              chainId !== 47805 && chainId !== 2019 &&
              <ErrorNetwork handleChangeNetwork={() => setShowConnectWallet(true)}/>
            }
            {
              currNetwork &&
              <CurrentNetwork currNetwork={currNetwork} handleChangeNetwork={() => setShowConnectWallet(true)} />
            }
            {
              myAddress &&
              <div className="balance-wrap">
                <span style={{ marginRight: '4px' }}>{Number(balance).toFixed(4)}</span><span>{currNetwork}</span>
              </div>
            }

            {
              (chainId === 47805 || chainId === 2019) && myAddress &&
              <span className='header-top' onClick={() => showAccountInfo()}>
                <Jazzicon address={myAddress} className="account-icon" />
                {formatAddress(myAddress)}
              </span>
            }

          </div>
        }
        <LanguageSwitch />
      </div>
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
  @media (max-width: 991px){
    .balance-wrap {
      background: #fff;
      border-radius: 5px 0 0 5px;
    }
  }
`