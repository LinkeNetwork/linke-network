import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import useGlobal from './useGlobal'
import { ethers } from "ethers"
import { getBalanceNumber, getLocal, getBalance, allowance, approve } from '../utils'
export default function UseTokenBalance() {
  const { accounts, giveAwayAddressV2, setButtonText, currentTokenBalance, nftAddress, setState} = useGlobal()
  const [authorization, setAuthorization] = useState(false)
  const [poolBalance,setPoolBalance] = useState(0)
  const [approveLoading, setApproveLoading] = useState(false)
  const [hasGetTokenList, setHasGetTokenList] = useState(false)
  const [secondaryAuthorization, setSecondaryAuthorization] = useState(false)
  const [isApprove, setIsApprove] = useState(true)
  const [tokenList, setTokenList] = useState([])
  const getTokenBalance = async(item, arr, index) => {
    const provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
    if(provider && getLocal('account')) {
      try {
        const res = await getBalance(provider, item.address, getLocal('account'))
        const tokenBalance = getBalanceNumber(new BigNumber(Number(res)), item?.decimals)
        setPoolBalance(tokenBalance)
        const list = [...arr]
        list[index].balance = tokenBalance.toFixed(4)
        list.sort(function (a, b) { return b.balance - a.balance })
        setTokenList(list)
        setHasGetTokenList(true)
      } catch (error) {
        setPoolBalance(0)
      }
    }
  }
  const allowanceAction = async (from, type) => {
    let account = accounts || localStorage.getItem('account')
    const provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
    const { address: tokenAddress } = from
    const spender = type === 'signIn' ?  nftAddress : giveAwayAddressV2
    const allowanceTotal = await allowance({provider, tokenAddress, spender, account})
    setState({
      allowanceTotal: ethers.utils.formatUnits(allowanceTotal)
    })
    const tokenValue = from.address == 0 ? currentTokenBalance : from.balance
    const amountToken = ethers.utils.parseEther(tokenValue)
    const allonceNum = ethers.utils.parseEther(allowanceTotal)
    console.log(ethers.utils.formatUnits(allowanceTotal), "allowanceAction")
    return allonceNum.gte(amountToken)
  }
  const getAuthorization = async(from, type) => {
    const allowanceResult = from.address ? await allowanceAction(from, type) : true
    setAuthorization(allowanceResult)
    return allowanceResult
  }

  const approveActions = async (from, type) => {
    try {
      setApproveLoading(true)
      setButtonText('APPROVE_ING')
      const res = await approve({
          provider: new Web3.providers.HttpProvider("https://rpc.etherfair.org"),
          tokenAddress: from.address,
          spender: type === 'signIn' ?  nftAddress : giveAwayAddressV2,
          accounts
      })
      console.log('Approve result ======', res)
      setAuthorization(true)
      setSecondaryAuthorization(true)
      setApproveLoading(false)
      setIsApprove(res)
    } catch (error) {
      console.log(error, '====error')
      setAuthorization(false)
      throw error
    } finally {
      setApproveLoading(false)
    }
}

  return { poolBalance, tokenList, getTokenBalance, authorization, getAuthorization, approveActions, approveLoading, secondaryAuthorization }
}
