import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Modal, Image }  from "../../component/index"
import { NumericInput } from "numeric-keyboard"
import { detectMobile, getDaiWithSigner } from "../../utils"
import TokenList from "./TokenList"
import { ethers } from "ethers"
import useGlobal from "../../hooks/useGlobal"
import UseTokenBalance from "../../hooks/UseTokenBalance"
import { RED_PACKET } from '../../abi/index'
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export default function AwardBonus(props) {
  const { giveAwayAddress, swapButtonText, approveLoading, setButtonText } = useGlobal()
  const { getAuthorization, approveActions, authorization } = UseTokenBalance()
  const { handleCloseAward, currentAddress, handleCloseMask, handleShowMask, handleGiveAway, handleSend } = props
  const [showBonusType, setShowBonusType] = useState(false)
  const [totalAmount, setTotalAmount] = useState()
  const [amount, setAmount] = useState()
  const [quantity, setQuantity] = useState('')
  const [amountText, setAmountText] = useState('Total')
  const [clickNumber, setClickNumber] = useState(0)
  const [showTokenList, setShowTokenList] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedTokenInfo, setSelectedTokenInfo] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  const [selectTokenAddress, setSelectTokenAddress] = useState('')
  const [tokenLogo, setTokenLogo] = useState('')
  const [wishesText, setWishesText] = useState()
  const [canSend, setCanSend] = useState(false)
  const [btnText, setBtnText] = useState('Mint')
  const [tokenDecimals, setTokenDecimals] = useState()
  const amountRef = useRef()
  const nftImageList = [1,1,1,1]
  const buttonActions = () => {
    switch (btnText) {
      case "Mint":
        handleSend(totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals)
        break;
      case "Approve":
        approveActions(selectedTokenInfo)
        break;
      default:
        return null;
    }
  }
  const handleQuantityInput = (key) => {
    setQuantity(key)
  }
  const handleAmountInput = (key) => {
    setAmount(key)
  }
  const selectToken = async(item) => {
    setQuantity()
    setSelectedTokenInfo(item)
    setShowTokenList(false)
    setSelectedToken(item.symbol)
    setTokenBalance(item.balance)
    setTokenLogo(item.logoURI)
    setTokenDecimals(item.decimals)
    setSelectTokenAddress(item.address)
    if(item.symbol === 'ETHF') return
    const authorization = await getAuthorization(item)
    if(!authorization) {
      setBtnText('Approve')
    }
  }
  const enforcer = (nextUserInput, type) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      valChange(nextUserInput, type)
    }
  }
  const valChange = (tokenValue, type) => {
    type === 0 ? setQuantity(tokenValue) : setAmount(tokenValue)
    
  }
  const nftList = () => {
    return(
      <div>
        <ul className="list-wrapper">
          {
            nftImageList.map((index) => {
              return (
                <li key={index}>
                  <span>NFT</span>
                  <div>#18</div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
  useEffect(() => {
    ( tokenBalance > totalAmount && quantity && amount) ? setCanSend(true) : setCanSend(false)
  }, [totalAmount, quantity, amount])
  useEffect(() => {
    if(authorization) {
      setCanSend(true)
      setButtonText('Send')
      setBtnText('Send')
    }
  }, [authorization])
  useEffect(() => {
    console.log(approveLoading,swapButtonText, 'approveLoading=====>>>>')
    if(approveLoading) {
      setCanSend(false)
      setBtnText('APPROVE_ING')
    }
    if(swapButtonText) {
      setBtnText(swapButtonText)
      if(swapButtonText === 'APPROVE_ING') {
        setCanSend(false)
      }
    }
  }, [approveLoading, swapButtonText])
  return (
    <SignInSignIn>
      {nftList()}
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">Choose Token</div>
        <TokenList selectToken={(item) => selectToken(item)} showBalance={true}></TokenList>
      </Modal>
      <div className={`content ${detectMobile() ? 'content-client' : ''}`}>
        <div className="token-wrapper">
          <div className="token-detail">
            {
              selectedToken &&
              <div>balance</div>
            }
            <div className="balance">{tokenBalance}</div>
          </div>
          <div onClick={() => {setShowTokenList(true)}} className="token-info">
            {
              tokenLogo && <Image size={24} src={tokenLogo} style={{ 'borderRadius': '50%'}} />
            }
            {
              !selectedToken ?  <span>Select a Token</span> : <div className="name">{selectedToken}</div>
            }
            <i className="iconfont icon-expand"></i>
          </div>
        </div>
        <div className="amount-wrapper quantity-wrapper">
          {
            <input placeholder="Enter quantity" type="text" pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal" autoComplete="off" autoCorrect="off" onChange={e => enforcer(e.target.value.replace(/,/g, '.'), 0)} defaultValue={quantity}/>
          }
          <span>Quantity</span>
        </div>
      </div>
      <div className="btn-wrapper">
        <div className='btn btn-primary' onClick={buttonActions}>
          <span className={`btn-default ${ canSend ? 'send-allowed' : ''}`}>{btnText}</span>
        </div>
        <div className='btn btn-primary' onClick={buttonActions}>
          <span className={`btn-default ${ canSend ? 'send-allowed' : ''}`}>Sign in</span>
        </div>
        <div className='btn btn-light' onClick={buttonActions}>
          <span className={`${ canSend ? 'send-allowed' : ''}`}>Remove Mint</span>
        </div>
        {/* <div className='btn btn-light' onClick={buttonActions}>
          <span className="btn-cancel">Cancel</span>
        </div> */}
      </div>
      
    </SignInSignIn>
  )
}
const SignInSignIn = styled.div`
height: 100%;
width: 100%;
background: #fff;
.amount-wrapper, .token-wrapper {
  justify-content: space-between;
  background: #f6f6f6;
  border-radius: 6px;
  display: flex;
  margin: 16px 0;
  padding: 4px 10px;
  height: 54px;
  align-items: center;
}
.icon-hongbao2 {
  color: red;
  margin-right: 2px;
}
.btn-wrapper {
  display: flex;
  justify-content: space-around;
  margin: 30px 0 20px;
}
.token-wrapper {
  height: 74px;
  font-size: 12px;
  .token-info {
    align-items: center;
    display: flex;
    padding: 10px;
    border-radius: 5px;
    background: hsla(0,0%,100%,.637);
    .name {
      margin-left: 4px;
    }
  }
  .token-detail {
    height: 54px;
    .balance {
      font-size: 18px;
      margin-top: 6px;
    }
  }
  .icon-expand {
    margin-left: 4px;
  }
}
.btn-cancel {
  font-size: 18px;
}
.btn-default {
  opacity: 0.4;
  cursor: not-allowed;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
}
.send-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 30px 0;
}
.send-allowed {
  cursor: pointer;
  opacity: 1;
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
.content {
  
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
.list-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  li {
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    margin: 10px 10px 0;
    padding: 15px;
    animation: 1.5s ease-in-out 0.5s infinite normal none running animation-c7515d;
    background: #f6f6f6;
    border: 1px solid #ececec;
    span {
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 110px;
      width: 110px;
      background-color: rgba(0, 0, 0, 0.11);
    }
  }
}
`