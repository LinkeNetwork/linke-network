import { useState } from "react"
import styled from "styled-components"
import { Modal, Image }  from "../../component/index"
import { detectMobile } from "../../utils"
import TokenList from "./TokenList"
import intl from "react-intl-universal"

export default function OpenSign(props) {
  const { handleSelectedToken } = props
  const [showTokenList, setShowTokenList] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [tokenLogo, setTokenLogo] = useState('')
  const selectToken = async(item) => {
    setShowTokenList(false)
    handleSelectedToken(item)
    setSelectedToken(item.symbol)
    setTokenLogo(item.logoURI)
    if(item.symbol === 'ETHF') return
  }
  return (
    <OpenSignInContanier>
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">{intl.get('SelectToken')}</div>
        <TokenList selectToken={(item) => selectToken(item)} showBalance={false}></TokenList>
      </Modal>
    
      
      <div className={`content ${detectMobile() ? 'content-client' : ''}`}>
        <div className="token-wrapper">
          <div onClick={() => {setShowTokenList(true)}} className="token-info">
            {
              tokenLogo && <Image size={24} src={tokenLogo} style={{ 'borderRadius': '50%'}} />
            }
            {
              !selectedToken ?  <span>{intl.get('SelectToken')}</span> : <div className="name">{selectedToken}</div>
            }
            <i className="iconfont icon-expand"></i>
          </div>
        </div>
      </div>
    </OpenSignInContanier>
  )
}
const OpenSignInContanier = styled.div`
height: 100%;
width: 100%;
background: #fff;
.token-wrapper {
  justify-content: space-between;
  background: #f6f6f6;
  border-radius: 6px;
  display: flex;
  margin: 16px 0;
  padding: 4px 10px;
  height: 54px;
  align-items: center;
  height: 74px;
  font-size: 12px;
  .token-info {
    align-items: center;
    display: flex;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    background: hsla(0,0%,100%,.637);
    width: 100%;
    justify-content: space-between;
    .name {
      margin-left: 4px;
      flex: 1;
    }
  }
  .icon-expand {
    margin-left: 4px;
  }
}
.total {
  text-align: center;
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
}
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: #fff;
  position: fixed;
  width: 100%;
  span {
    font-size: 20px;
  }
  .icon-close, .icon-more {
    font-size: 26px;
  }
  .icon-close {
    position: absolute;
    left: 20px;
  }
  .icon-more {
    transform: rotate(90deg);
  }
}
.content-client {
  margin-top: 70px;
  padding: 0 20px;
}
.amount-wrapper{
  span {
    font-size: 18px;
  }
  input {
    // flex: 1;
    display: flex;
    text-align: left;
  }
}
.bonus-type-wrapper {
  margin-bottom: 10px;
  color: #FFCE00;
  font-size: 18px;
  position: relative;
  background: #fff;
}
`