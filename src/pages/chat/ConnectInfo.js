import React, { Fragment, useState } from 'react'
import { formatAddress } from '../../utils'
import useWallet from '../../hooks/useWallet'
import CopyButton from '../../component/Copy'
import useDataBase from '../../hooks/useDataBase'
import styled from 'styled-components'
export default function ConnectInfo(props) {
  const { setDataBase } = useDataBase()
  const { account, handleDisconnect } = props
  const { disConnect } = useWallet()
  const [showTips, setShowTips] = useState(false)
  const handleClearCache = async() => {
    const db = await setDataBase()
    db.drop((error) => {
      console.log(error, 'drop===')
      setShowTips(true)
      setTimeout(() => {
        setShowTips(false)
      }, 3000)
    })
  }
  return (
    <Fragment>
      {
        showTips && <div className='message-tips message-tips-success message-tips-success-mobile'>clear success</div>
      }
      <ConnectBlock>
        <div className="f-c-sb">
          <h4>Connected with MetaMask</h4>
          <div className="f-c">
            <div className="button-min" onClick={() => disConnect().then(() => handleDisconnect())}>Disconnect</div>
          </div>
        </div>
        <div className="f-c-sb">
          <div>
            <h3>{formatAddress(account)}</h3>
            <div className="f-c connect-bar">
              <CopyButton toCopy={account}>copy Address</CopyButton>
              <div onClick={handleClearCache} className="clear-btn">Clear Cache</div>
            </div>
          </div>
        </div>
      </ConnectBlock>
    </Fragment>
  )
}
const ConnectBlock = styled.div`
background: rgba(90, 90, 90, 0.1);
padding: 15px;
border-radius: 5px;
margin-bottom: 10px;
.f-c-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h4 {
  color: #888;
  font-size: 12px;
}
.clear-btn {
  margin-top: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}
`