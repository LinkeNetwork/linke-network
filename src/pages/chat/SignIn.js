import { useEffect, useState } from "react"
import styled from "styled-components"
import Web3 from 'web3'
import intl from "react-intl-universal"
import BigNumber from 'bignumber.js'
import { Modal, Image } from "../../component/index"
import { tokenListInfo } from '../../constant/tokenList'
import { detectMobile, getDaiWithSigner, getBalance, getLocal, getBalanceNumber, formatTimestamp } from "../../utils"
import TokenList from "./TokenList"
import { ethers } from "ethers"
import useGlobal from "../../hooks/useGlobal"
import UseTokenBalance from "../../hooks/UseTokenBalance"
import { SIGN_IN_ABI } from '../../abi/index'
import CountDown from "./CountDown"
import nftImage from '../../assets/images/nft.jpg'
import CumulativeTime from './CumulativeTime'
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export default function SignIn(props) {
  const { swapButtonText, approveLoading, setButtonText, nftAddress, currentTokenBalance, continueMint, setState, canMint, isCancelCheckIn } = useGlobal()
  const { getAuthorization, approveActions, authorization } = UseTokenBalance()
  const { handleMint, nftImageList, handleSelectNft, handleEndStake, handleCheckIn, handleCancelCheckin, handleAutoCheckIn } = props
  const [quantity, setQuantity] = useState('')
  const [isAuthorization, setIsAuthorization] = useState(false)
  const [showTokenList, setShowTokenList] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [isOpenAutoCheckIn, setIsOpenAutoCheckIn] = useState(false)
  const [selectedTokenInfo, setSelectedTokenInfo] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  const [selectTokenId, setSelectTokenId] = useState()
  const [tokenLogo, setTokenLogo] = useState('')
  const [canSend, setCanSend] = useState(false)
  const [btnText, setBtnText] = useState(intl.get('Mint'))
  const [text, setText] = useState(intl.get('Quantity'))
  const [mintLastDate, setMintLastDate] = useState()
  const [score, setScore] = useState()
  const [tokenId, setTokenId] = useState()
  const [mintDate, setMintDate] = useState()
  const [stakedNum, setStakedNum] = useState()
  const [cancelTime, setCancelTime] = useState()
  const [isCancel, setIsCancel] = useState(false)
  const [endStack, setEndStack] = useState(false)
  const buttonActions = (e) => {
    switch (e.target.innerText) {
      case intl.get('Mint'):
        handleContinueMint(quantity)
        break;
      case intl.get('Approve'):
        approveActions(selectedTokenInfo, 'signIn')
        break;
      case intl.get('CheckIn'):
        handleCheckIn(tokenId, quantity)
        break;
      case intl.get('EndStake'):
        handleEndStake(endStack, isOpenAutoCheckIn)
        break;
      case intl.get('CancelCheckIN'):
        handleCancelCheckin()
        break;
      case intl.get('AutoCheckIn'): 
        handleAutoCheckIn()
      default:
        return null;
    }
  }
  const getStakedInfo = async () => {
    const account = getLocal('account').toLowerCase()
    const registerUserInfos = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).getRegisterUserInfo(account)
    const {lastDate, tokenId, amount, cancelDate} = registerUserInfos
    console.log(lastDate, 'lastDate=====', cancelDate)
    const userAmount = ethers.utils.formatEther(amount)
    setState({
      canMint: !(+userAmount)
    })
    const tokenId_ = (new BigNumber(Number(tokenId))).toNumber()
    const registerInfos = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).getRegisterInfo(tokenId_)
    setSelectTokenId(tokenId_)
    const timestamp = formatTimestamp(lastDate)
    const cancelTime = formatTimestamp(cancelDate)
    setCancelTime(cancelTime)
    console.log(cancelTime>0, timestamp, 'cancelTime>0===', cancelTime)
    setIsCancel(cancelTime>0)
    setEndStack(cancelTime>0)
    setState({
      isCancelCheckIn: cancelTime>0
    })
    const score = (new BigNumber(Number(registerInfos.score))).toNumber()
    setScore(score)
    if(registerInfos.length > 0) {
      setMintDate(timestamp)
      console.log(userAmount, cancelTime>0, 'userAmount===')
      setStakedNum(userAmount)
    }
  }
  const handleContinueMint = async(quantity) => {
    setMintInfo()
    if(!quantity) {
      await handleMint(quantity, selectedToken)
    } else {
      handleMint(quantity, selectedToken)
    }
  }
  const setMintInfo = async() => {
    getStakedInfo()
    setState({
      continueMint: false
    })
    const res = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).registerUserInfos(getLocal('account'))
    const mintNum = ethers.utils.formatEther(res.amount)
    if(mintNum > 0) {
      setText(intl.get('Staking'))
      setQuantity(mintNum)
    }
  }
  const handleChooseNft = async(item) => {
    setMintInfo()
    setTokenId(item.tokenId)
    handleSelectNft(item)
  }
  const getSelectedToken = async () => {
    const res = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).getAutomatic()
    const isOpenAutoCheckIn = new BigNumber(Number(res)).toNumber()
    setIsOpenAutoCheckIn(Boolean(isOpenAutoCheckIn))
    console.log(res, isOpenAutoCheckIn, '====getAutomatic')
    const tx = await getDaiWithSigner(nftAddress.toLocaleLowerCase(), SIGN_IN_ABI).token()
    const tokenList = [...tokenListInfo]
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() == tx.toLocaleLowerCase())
    const { symbol, logoURI } = selectedToken.length && selectedToken[0]
    if (tx == 0) {
      setTokenBalance(Number(currentTokenBalance).toFixed(4))
    } else {
      if(!selectedToken.length) return
      const provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
      const res = await getBalance(provider, selectedToken[0].address, getLocal('account'))
      const tokenBalance = getBalanceNumber(new BigNumber(Number(res)), selectedToken[0]?.decimals)
      setTokenBalance(Number(tokenBalance).toFixed(4))
      selectedToken[0].balance = String(tokenBalance)
    }
    setSelectedTokenInfo(selectedToken[0])
    setTokenLogo(logoURI)
    setSelectedToken(symbol)
    if (symbol === 'ETHF') {
      setIsAuthorization(true)
      return
    }
    const authorization = await getAuthorization(selectedToken[0], 'signIn')
    setIsAuthorization(authorization)
    if (!authorization) {
      setCanSend(true)
      setBtnText(intl.get('Approve'))
    }

  }
  const enforcer = (nextUserInput, type) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      valChange(nextUserInput, type)
    }
  }
  const valChange = (tokenValue, type) => {
    if(type === 0) {
      setQuantity(tokenValue)
    }

  }
  const nftList = () => {
    return (
      <div>
        <ul className="list-wrapper">
          {
            nftImageList.map((item, index) => {
              return (
                <li key={index} onClick={() => handleChooseNft(item)}>
                  <div className="nft-wrapper">
                    <Image src={nftImage} size={120} alt="" />
                  </div>
                  <div>#{item.tokenId}</div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
  useEffect(() => {
    if(+stakedNum > 0 && isOpenAutoCheckIn) {
      setBtnText(intl.get('CancelCheckIN'))
    }
  }, [stakedNum])
  useEffect(() => {
    if (quantity > 0 && quantity <= tokenBalance) {
      setCanSend(true)
    } else {
      setCanSend(false)
    }
  }, [quantity])
  useEffect(() => {
    getSelectedToken()
  }, [])
  useEffect(() => {
    if (authorization) {
      if(+tokenBalance > 0) {
        setCanSend(true)
      }
      setButtonText(intl.get('Mint'))
      setBtnText(intl.get('Mint'))
    }
    setIsAuthorization(authorization)
  }, [authorization])
  useEffect(() => {
    if(nftImageList.length > 0) {
      setCanSend(true)
    }
  }, [nftImageList])
  useEffect(() => {
    getStakedInfo()
  }, [nftAddress]) 
  useEffect(() => {
    if (approveLoading) {
      setCanSend(false)
      setBtnText(intl.get('APPROVE_ING'))
    }
    if (swapButtonText) {
      setBtnText(swapButtonText)
      if (swapButtonText === intl.get('APPROVE_ING')) {
        setCanSend(false)
      }
    }
  }, [approveLoading, swapButtonText])
  useEffect(() => {
    if(+tokenBalance < 0) {
      setCanSend(false)
    }
  }, [tokenBalance])
  return (
    <SignInWrapper>
      {
        (isCancel || +stakedNum > 0) &&
        <div>
          <div className="stake-num"><span className="name">{intl.get('StakedAmount')}:</span><span className="num">{stakedNum}</span><span className="symbol">{selectedToken}</span></div>
          {
            isOpenAutoCheckIn &&
            <div className="staked-duration"><span className="name">{intl.get('StakedDuration')}:</span><CumulativeTime timestamp={mintDate}/></div>
          }
          <div className="score-wrapper">
          <span className="name">{intl.get('Score')}:</span><span className="score">{score}</span>
          </div>
          <div className="list-wrapper">
            <div className="list-item">
              <div className="nft-wrapper">
                <Image src={nftImage} size={120} alt="" />
              </div>
              <div>#{selectTokenId}</div>
            </div>
          </div>
          {
            !isOpenAutoCheckIn &&
            <CountDown timestamp={mintDate}/>
          }
          {
            (cancelTime > 0) && <CountDown timestamp={cancelTime}/>
          }
          {
            
            <div className="end-stake-btn">
              {
                !isOpenAutoCheckIn &&
                <div className='btn btn-primary auto-check-btn' onClick={buttonActions}>
                  <span className={`${isOpenAutoCheckIn ? 'btn-default' : ''}`}>{ intl.get('AutoCheckIn') }</span>
                </div>
              }
              {
                isOpenAutoCheckIn && +cancelTime === 0 &&
                <div className='btn btn-primary' onClick={buttonActions}>
                  <span className={`${canSend ? 'send-allowed' : 'btn-default'}`}>{intl.get('CancelCheckIN')}</span>
                </div>
              }
              {
                cancelTime > 0 &&
                 <div className='btn btn-primary' onClick={buttonActions}>
                  <span className={`${!canMint > 0 ? 'btn-default' : ''}`}>{ intl.get('EndStake') }</span>
                 </div>
              }
            </div>
          }
        </div>
      }
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">{intl.get('SelectToken')}</div>
        <TokenList showBalance={true}></TokenList>
      </Modal>
      {
        canMint && !isCancel &&
        <div className={`content ${detectMobile() ? 'content-client' : ''}`}>
          <div className="token-wrapper">
            <div className="token-detail">
              {
                selectedToken &&
                <div>balance</div>
              }
              <div className="balance">{tokenBalance}</div>
            </div>
            <div className="token-info">
              {
                tokenLogo && <Image size={24} src={tokenLogo} style={{ 'borderRadius': '50%' }} />
              }
              {
                !selectedToken ? <span>{intl.get('SelectToken')}</span> : <div className="name">{selectedToken}</div>
              }
            </div>
          </div>
          {
            btnText !== 'Approve' && btnText !== 'APPROVE_ING' && isAuthorization &&
            <div className="amount-wrapper quantity-wrapper">
              {
                <input placeholder={intl.get('Enterquantity')} type="text" pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal" autoComplete="off" autoCorrect="off" onChange={e => enforcer(e.target.value.replace(/,/g, '.'), 0)} defaultValue={quantity} />
              }
              <span>{text}</span>
            </div>
          }

        </div>
      }

      {
        <div className="btn-wrapper">
          {
            (continueMint || !nftImageList.length) && !isCancel && !endStack && +stakedNum === 0 &&
            <div className='btn btn-primary' onClick={buttonActions}>
              <span className={`${canSend ? 'send-allowed' : 'btn-default'}`}>{btnText}</span>
            </div>
          }
          
          {
            nftImageList.length > 0 && !continueMint && canMint &&
            <div className='btn btn-primary' onClick={buttonActions}>
              <span className={`btn-default ${canSend ? 'send-allowed' : ''}`}>{ intl.get('CheckIn') }</span>
            </div>
          }
        </div>
      }

    </SignInWrapper>
  )
}
const SignInWrapper = styled.div`
height: 100%;
width: 100%;
background: #fff;
.score-wrapper {
  display: flex;
  margin: 15px 0;
  .name {
    margin-right: 10px;
  }
  .score {
    font-weight: bold;
  }
}
.end-stake-btn {
  // display: flex;
  // justify-content: space-between;
  text-align: center;
  margin: 20px auto 0;
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
.auto-check-btn {
  margin-right: 10px;
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
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
  li, .list-item {
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
  }
  .nft-wrapper {
    div {
      border-radius: 10px;
    }
  }
}
.stake-num {
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  .num {
    color: #FFCE00;
    font-weight: bold;
    margin-left: 10px;
    font-size: 20px;
  }
  .symbol {
    font-size: 14px;
    margin: 2px 0 0 4px;
  }
}
`