import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { getBalanceNumber, getLocal, getBalance } from '../utils'
export default function UseTokenBalance() {
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
  return { poolBalance, tokenList, getTokenBalance }
}