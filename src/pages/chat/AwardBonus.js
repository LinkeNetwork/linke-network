import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Modal, Image }  from "../../component/index"
import { NumericInput } from "numeric-keyboard"
import { detectMobile } from "../../utils"
import TokenList from "./TokenList"
import intl from "react-intl-universal"
import useGlobal from "../../hooks/useGlobal"
import UseTokenBalance from "../../hooks/UseTokenBalance"
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export default function AwardBonus(props) {
  const { swapButtonText, approveLoading, setButtonText } = useGlobal()
  const { getAuthorization, approveActions, authorization } = UseTokenBalance()
  const { handleCloseAward, handleSend } = props
  const [showBonusType, setShowBonusType] = useState(false)
  const [totalAmount, setTotalAmount] = useState()
  const [amount, setAmount] = useState()
  const [quantity, setQuantity] = useState('')
  const [amountText, setAmountText] = useState(intl.get('Total'))
  const [clickNumber, setClickNumber] = useState(0)
  const [showTokenList, setShowTokenList] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedTokenInfo, setSelectedTokenInfo] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  const [selectTokenAddress, setSelectTokenAddress] = useState('')
  const [tokenLogo, setTokenLogo] = useState('')
  const [wishesText, setWishesText] = useState()
  const [canSend, setCanSend] = useState(false)
  const [btnText, setBtnText] = useState(intl.get('Send'))
  const [tokenDecimals, setTokenDecimals] = useState()
  const amountRef = useRef()
  const BonusList = [
    intl.get('RandomAmount'),
    intl.get('IdenticalAmount')
  ]
  const buttonActions = () => {
    switch (btnText) {
      case intl.get('Send'):
        handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals)
        break;
      case intl.get('Approve'):
        approveActions(selectedTokenInfo, 'envelope')
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
  const [currentBonusType, setCurrentBonusType] = useState(BonusList[0])
  const handleSelecType = (i) => {
    setCurrentBonusType(BonusList[i])
    setShowBonusType(false)
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
    const authorization = await getAuthorization(item, 'envelope')
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
  useEffect(() => {
    currentBonusType === intl.get('RandomAmount') ? setAmountText(intl.get('Total')) : setAmountText(intl.get('AmountEach')) 
    if(currentBonusType === intl.get('IdenticalAmount')) {
      if(totalAmount && quantity) {
        const amount = totalAmount/quantity < 1 ? (totalAmount/quantity).toFixed(2) : Math.floor((totalAmount/quantity) * 100)/100
        setAmount(amount)
      }
    }
    if(currentBonusType === intl.get('RandomAmount')) {
      const result = totalAmount
      if(result > 0) {
        setAmount(result)
      }
    }
  }, [currentBonusType])
  useEffect(() => {
    if(currentBonusType === intl.get('RandomAmount') && quantity && amount) {
      setTotalAmount(amount)
    }
    if(!quantity || !amount) {
      setTotalAmount(0)
    }
  }, [currentBonusType, amount, quantity])
  useEffect(() => {
    amountRef.current = amount
    setClickNumber(clickNumber+1)
  }, [currentBonusType, amount])
  useEffect(() => {
    ( tokenBalance > totalAmount && quantity && amount) ? setCanSend(true) : setCanSend(false)
  }, [totalAmount, quantity, amount])
  useEffect(() => {
    if(authorization) {
      setCanSend(true)
      setButtonText(intl.get('Send'))
      setBtnText(intl.get('Send'))
    }
  }, [authorization])
  useEffect(() => {
    if(approveLoading) {
      setCanSend(false)
      setBtnText(intl.get('APPROVE_ING'))
    }
    if(swapButtonText) {
      setBtnText(swapButtonText)
      if(swapButtonText === intl.get('APPROVE_ING')) {
        setCanSend(false)
      }
    }
  }, [approveLoading, swapButtonText])
  return (
    <AwardBonusContanier>
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">{intl.get('SelectToken')}</div>
        <TokenList selectToken={(item) => selectToken(item)} showBalance={true}></TokenList>
      </Modal>
      <Modal visible={showBonusType} onClose={() => setShowBonusType(false)} className={`modal bonus-type-modal ${detectMobile() ? 'modal-client' : ''}`}>
        {
          BonusList.map((v, i) => {
            return (
              <div className="bonus-type" key={i} onClick={() => { handleSelecType(i) }}>{v}</div>
            )
          })
        }
      </Modal>
      {
        detectMobile() && 
        <div className="header">
          <span className="iconfont icon-close" onClick={handleCloseAward}></span>
          <span>{ intl.get('AwardBonus') }</span>
          {/* <span className="iconfont icon-more"></span> */}
      </div>
      }
      
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
              !selectedToken ?  <span>{ intl.get('SelectToken') }</span> : <div className="name">{selectedToken}</div>
            }
            <i className="iconfont icon-expand"></i>
          </div>
        </div>
        <div className="bonus-type-wrapper" onClick={() => { setShowBonusType(true) }}>
          <span>{currentBonusType}</span>
          <span className="iconfont icon-expand"></span>
        </div>
        <div className="amount-wrapper quantity-wrapper">
          {
            detectMobile() 
            ? <NumericInput layout="tel" placeholder={ intl.get('Enterquantity') } onInput={(key) => { handleQuantityInput(key) }} />
            : <input placeholder={ intl.get('Enterquantity') } type="text" pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal" autoComplete="off" autoCorrect="off" onChange={e => enforcer(e.target.value.replace(/,/g, '.'), 0)} defaultValue={quantity}/>
          }
          <span><span className="iconfont icon-hongbao2"></span>{intl.get('Quantity')}</span>
        </div>
        <div className="amount-wrapper">
          {
            detectMobile() && (amount == 0 || amount == 'NaN' || !amount) &&
            <NumericInput layout="number" placeholder="0.00" onInput={(key) => { handleAmountInput(key) }}/>
          }
          {
            detectMobile() && Number(amount) > 0 &&
            <NumericInput layout="number" placeholder="0.00" onInput={(key) => { handleAmountInput(key) }} value={amountRef.current} key={`${currentBonusType}`}/>
          }
          {
            !detectMobile() && 
            <input placeholder="0.00" type="text" pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal" autoComplete="off" autoCorrect="off" onChange={e => enforcer(e.target.value.replace(/,/g, '.'), 1)} defaultValue={amount}/>
          }
          <div>{amountText}</div>
        </div>
        <div className="amount-wrapper">
          <input placeholder="Best Wishes" defaultValue={wishesText} onChange={(e) => {setWishesText(e.target.value)}} maxLength={512}/>
        </div>
      </div>
      <div className="total">{totalAmount}</div>
      <div className={`send-btn-wrapper ${detectMobile() ? 'send-btn-wrapper-client': ''}`} onClick={buttonActions}>
        <span className={`send-btn btn btn-primary ${ canSend ? 'send-allowed' : ''}`}>{btnText}</span>
      </div>
    </AwardBonusContanier>
  )
}
const AwardBonusContanier = styled.div`
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
.send-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
.send-btn {
  opacity: 0.4;
  cursor: not-allowed;
  width: 200px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
.send-allowed {
  cursor: pointer;
  opacity: 1;
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
`