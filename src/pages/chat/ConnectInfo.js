import React, { Fragment } from 'react'
import { formatAddress } from '../../utils'
import useWallet from '../../hooks/useWallet'
import CopyButton from '../../component/Copy'
import styled from 'styled-components'
export default function ConnectInfo(props) {
  const { account, handleDisconnect } = props
  const { disConnect } = useWallet()
  return (
    <Fragment>
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
`