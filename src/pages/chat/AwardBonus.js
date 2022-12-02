import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import Modal from "../../component/Modal"
import { NumericInput } from "numeric-keyboard"
import { detectMobile } from "../../utils"
import TokenList from "./TokenList"
export default function AwardBonus(props) {
  const { handleCloseAward } = props
  const [contentHeight,setContentHeight] = useState(450)
  const [showBonusType, setShowBonusType] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [amount, setAmount] = useState()
  const [quantity, setQuantity] = useState('')
  const [amountText, setAmountText] = useState('Total')
  const [clickNumber, setClickNumber] = useState(0)
  const [showTokenList, setShowTokenList] = useState(false)
  const amountRef = useRef()
  const BonusList = [
    'Random Amount',
    'Identical Amount'
  ]
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
  const setHeight = () => {
    setContentHeight(detectMobile() ? 200 : 450)
  }
  useEffect(() => {
    console.log(detectMobile() && !amount, amount==0, amount, amountRef.current,'======')
    currentBonusType === 'Random Amount' ? setAmountText('Total') : setAmountText('Amount Each') 
    if(currentBonusType === 'Identical Amount') {
      const amount = totalAmount/quantity < 1 ? (totalAmount/quantity).toFixed(2) : (Math.floor(totalAmount/quantity)).toFixed(2)
      setAmount(amount)
    }
    if(currentBonusType === 'Random Amount') {
      const result = totalAmount
      setAmount(result)
    }
  }, [currentBonusType])
  useEffect(() => {
    if(currentBonusType === 'Random Amount' && quantity && amount) {
      setTotalAmount(amount)
    }
    if(!quantity && !amount) {
      setTotalAmount(0)
    }
  }, [currentBonusType, amount, quantity])
  useEffect(() => {
    amountRef.current = amount
    setClickNumber(clickNumber+1)
  }, [currentBonusType, amount])
  return (
    <AwardBonusContanier>
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">Choose Token</div>
        <div className="search-token">
          <span className="icon-search-wrapper">
            <i className="iconfont icon-search"></i>
          </span>
          <input className="search-input" onBlur={()=>setContentHeight(450)} onFocus={setHeight} placeholder="Search Name or Paste Address" aria-label="Search..." />
        </div>
        <TokenList contentHeight={contentHeight} ></TokenList>
      </Modal>
      <Modal visible={showBonusType} onClose={() => setShowBonusType(false)} className="modal modal-client bonus-type-modal">
        {
          BonusList.map((v, i) => {
            return (
              <div className="" key={i} onClick={() => { handleSelecType(i) }}>{v}</div>
            )
          })
        }
      </Modal>
      <div className="header">
        <span className="iconfont icon-close" onClick={handleCloseAward}></span>
        <span>Award Bonus</span>
        <span className="iconfont icon-more"></span>
      </div>
      <div className="content">
        <div className="token-wrapper">
          <div className="token-name"></div>
          <span onClick={() => {setShowTokenList(true)}}>Select a Token<i className="iconfont icon-expand"></i></span>
        </div>
        <div className="bonus-type-wrapper" onClick={() => { setShowBonusType(true) }}>
          <span>{currentBonusType}</span>
          <span className="iconfont icon-expand"></span>
        </div>
        <div className="amount-wrapper quantity-wrapper">
          {
            detectMobile() 
            ? <NumericInput layout="tel" placeholder="Enter quantity" onInput={(key) => { handleQuantityInput(key) }} />
            : <input placeholder="Enter quantity" />
          }
          <span>Quantity</span>
        </div>
        <div className="amount-wrapper">
          {
            detectMobile() && (amount == 0 || amount == 'NaN') &&
            <NumericInput layout="number" placeholder="0.00" onInput={(key) => { handleAmountInput(key) }}/>
          }
          {
            detectMobile() && Number(amount) > 0 &&
            <NumericInput layout="number" placeholder="0.00" onInput={(key) => { handleAmountInput(key) }} value={amountRef.current} name={`${currentBonusType}`}/>
          }
          {
            !detectMobile() && <input placeholder="0.00" />
          }
          <div>{amountText}</div>
        </div>
      </div>
      <div className="total">{totalAmount}</div>
      <div className="send-btn-wrapper">
        <span className="send-btn btn btn-primary">Send</span>
      </div>
    </AwardBonusContanier>
  )
}
const AwardBonusContanier = styled.div`
height: 100%;
width: 100%;
background: #fff;
.token-wrapper {
  font-size: 12px;
  span {
    padding: 10px;
    border-radius: 5px;
    background: hsla(0,0%,100%,.637)
  }
  .icon-expand {
    margin-left: 4px;
  }
}
.send-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.send-btn {
  width: 200px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
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
  justify-content: space-between;
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
  .icon-more {
    transform: rotate(90deg);
  }
}
.content {
  margin-top: 70px;
  padding: 0 20px;
}
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
.amount-wrapper{
  span {
    font-size: 18px;
  }
  input {
    // flex: 1;
    display: flex;
    text-align: right;
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