import { useEffect, useState } from "react"
import styled from "styled-components"
import Web3 from 'web3'
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
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export default function SignIn(props) {
  const { swapButtonText, approveLoading, setButtonText, nftAddress, currentTokenBalance, continueMint, setState, canMint, showTokenContent, signInClientInfo } = useGlobal()
  const { getAuthorization, approveActions, authorization } = UseTokenBalance()
  const { handleMint, showNftList, nftImageList, handleSelectNft, handleEndStake, handleCheckIn } = props
  const [quantity, setQuantity] = useState('')
  const [isAuthorization, setIsAuthorization] = useState(false)
  const [showTokenList, setShowTokenList] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedTokenInfo, setSelectedTokenInfo] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  const [tokenLogo, setTokenLogo] = useState('')
  const [canSend, setCanSend] = useState(false)
  const [btnText, setBtnText] = useState('Mint')
  const [text, setText] = useState('Quantity')
  const [mintLastDate, setMintLastDate] = useState()
  const [tokenId, setTokenId] = useState()
  const [showCountDown, setShowCountDown] = useState(false)
  const [stakedNum, setStakedNum] = useState()
  const buttonActions = (e) => {
    switch (e.target.innerText) {
      case "Mint":
        handleContinueMint(quantity)
        break;
      case "Approve":
        approveActions(selectedTokenInfo, 'signIn')
        break;
      case "Check In":
        handleCheckIn(tokenId, quantity)
        break;
      case "End Stake":
        handleEndStake(quantity)
        break;
      default:
        return null;
    }
  }
  const getStakedNum = async () => {
    const tokensQuery = `
    {
      registerUserInfos(
        orderBy:lastDate,orderDirection:desc,
        where: {sender: "`+ getLocal('account').toLowerCase() + `", register: "`+nftAddress.toLowerCase()+`"}
      ) {
        id
        lastDate
        count
        tokenId
        amount
        register
      }
    }
    `
    const res = await signInClientInfo?.query(tokensQuery).toPromise()
    const data = res.data.registerUserInfos
    setStakedNum(ethers.utils.formatUnits(data[0].amount))
  }
  const handleContinueMint = async(quantity) => {
    setMintInfo()
    if(!quantity) {
      setShowCountDown(true)
      await handleMint(quantity, selectedToken)
    } else {
      handleMint(quantity, selectedToken)
    }
  }
  const setMintInfo = async() => {
    getStakedNum()
    setState({
      continueMint: false
    })
    const res = await getDaiWithSigner(nftAddress, SIGN_IN_ABI).registerUserInfos(getLocal('account'))
    const timestamp = formatTimestamp(res.lastDate)
    setMintLastDate(timestamp)
    const mintNum = ethers.utils.formatEther(res.amount)
    if(mintNum > 0) {
      setText('Staking')
      setQuantity(mintNum)
    }
  }
  const handleChooseNft = async(item) => {
    setMintInfo()
    setTokenId(item.tokenId)
    handleSelectNft(item)
  }
  const getSelectedToken = async () => {
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
      setBtnText('Approve')
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
                  <span>NFT</span>
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
    if (authorization && !showNftList) {
      if(+tokenBalance > 0) {
        setCanSend(true)
      }
      setButtonText('Mint')
      setBtnText('Mint')
    }
    setIsAuthorization(authorization)
  }, [authorization])
  useEffect(() => {
    if(!showNftList && !quantity) {
      setCanSend(false)
    }
    if(!showNftList) {
      setShowCountDown(!canMint)
    }
  }, [showNftList, canMint])
  useEffect(() => {
    if(nftImageList.length > 0) {
      setCanSend(true)
    }
  }, [nftImageList])
  useEffect(() => {
    if (approveLoading) {
      setCanSend(false)
      setBtnText('APPROVE_ING')
    }
    if (swapButtonText) {
      setBtnText(swapButtonText)
      if (swapButtonText === 'APPROVE_ING') {
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
        showNftList && nftList()
      }
      {
        showCountDown &&
        <div>
          <div className="stake-num">Staked: <span>{stakedNum}</span><span className="symbol">{selectedToken}</span></div>
          <CountDown timestamp={mintLastDate}/>
        </div>
        
      }
     
      <Modal visible={showTokenList} onClose={() => setShowTokenList(false)}>
        <div className="token-list-title">Choose Token</div>
        <TokenList showBalance={true}></TokenList>
      </Modal>
      {
        !showNftList && canMint &&
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
                !selectedToken ? <span>Select a Token</span> : <div className="name">{selectedToken}</div>
              }
            </div>
          </div>
          {
            btnText !== 'Approve' && btnText !== 'APPROVE_ING' && isAuthorization &&
            <div className="amount-wrapper quantity-wrapper">
              {
                <input placeholder="Enter quantity" type="text" pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal" autoComplete="off" autoCorrect="off" onChange={e => enforcer(e.target.value.replace(/,/g, '.'), 0)} defaultValue={quantity} />
              }
              <span>{text}</span>
            </div>
          }

        </div>
      }

      {
        <div className="btn-wrapper">
          {
            (showNftList || continueMint || !nftImageList.length) && 
            <div className='btn btn-primary' onClick={buttonActions}>
              <span className={`${canSend ? 'send-allowed' : 'btn-default'}`}>{btnText}</span>
            </div>
          }
          
          {
            !showNftList && nftImageList.length > 0 && !continueMint && canMint &&
            <div className='btn btn-primary' onClick={buttonActions}>
              <span className={`btn-default ${canSend ? 'send-allowed' : ''}`}>Check In</span>
            </div>
          }
          {
            !showNftList && nftImageList.length > 0 && !continueMint && canMint &&
            <div className='btn btn-light' onClick={buttonActions}>
              <span className={`${canSend ? 'send-allowed' : ''}`}>End Stake</span>
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
  margin-bottom: 20px;
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
.stake-num {
  margin-bottom: 10px;
  font-size: 24px;
  color: #FFCE00;
  display: flex;
  font-weight: bold;
  align-items: center;
  span {
    margin-left: 4px
  }
  .symbol {
    font-size: 16px;
    margin-top: 7px;
  }
}
`