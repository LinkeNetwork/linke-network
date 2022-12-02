import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { getBalanceNumber, getLocal, getBalance } from '../utils'
export default function UseTokenBalance() {
  const [poolBalance,setPoolBalance] = useState(0)
  const [tokenList, setTokenList] = useState([])
  const getTokenBalance = async(item, list, index) => {
    const provider = new Web3.providers.HttpProvider("https://rpc.etherfair.org")
    if(provider && getLocal('account')) {
      try {
        const res = await getBalance(provider, item.address, getLocal('account'))
        const tokenBalance = getBalanceNumber(new BigNumber(Number(res)), item.decimals)
        list[index].balance = tokenBalance.toFixed(4)
        const arr = list.sort(function (a, b) { return b.balance - a.balance })
        console.log(arr, 'arr====')
        setTokenList(arr)
        setPoolBalance(tokenBalance)
      } catch (error) {
        setPoolBalance(0)
      }
    }
  }
  return { poolBalance, tokenList, getTokenBalance }
}