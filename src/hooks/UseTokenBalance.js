import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import useGlobal from './useGlobal'
import { ethers } from "ethers"
import { getBalanceNumber, getLocal, getBalance, allowance } from '../utils'
export default function UseTokenBalance() {
  const { accounts } = useGlobal()
  const [authorization, setAuthorization] = useState(false)
  const [poolBalance,setPoolBalance] = useState(0)
  const [hasGetTokenList, setHasGetTokenList] = useState(false)
  const [tokenList, setTokenList] = useState([])
  const getTokenBalance = async(item, arr, index) => {
    const provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
    if(provider && getLocal('account')) {
      try {
        const res = await getBalance(provider, item.address, getLocal('account'))
        const tokenBalance = getBalanceNumber(new BigNumber(Number(res)), item.decimals)
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
  const allowanceAction = async (from) => {
    let account = accounts || localStorage.getItem('account')
    const {provider, currency, router: spender, tokenValue} = from
    const {tokenAddress} = currency
    const allowanceTotal = await allowance({provider, tokenAddress, spender, account})
    const amountToken = ethers.utils.parseEther(tokenValue)
    const allonceNum = ethers.utils.parseEther(allowanceTotal)
    console.log("allowanceAction", amountToken, allonceNum, allonceNum.gte(amountToken))
    return allonceNum.gte(amountToken)
  }
  const getAuthorization = async(from) => {
    const allowanceResult = from.currency.tokenAddress ? await allowanceAction(from) : true
    setAuthorization(allowanceResult)
  }
  return { poolBalance, tokenList, getTokenBalance, authorization }
}
