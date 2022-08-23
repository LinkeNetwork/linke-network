import { token } from "../constant/token"
import { ethers } from "ethers"
import { getLocal, setLocal } from "../utils"
import { useState, useLayoutEffect } from "react"
import useProfile from "./useProfile"
import MetaMaskOnboarding from '@metamask/onboarding'
import { useHistory } from 'react-router-dom'
import useGlobal from './useGlobal'
import { createClient } from 'urql'
const networkList = {
  2019: 'CZZ',
  47805: 'REI',
  1: 'ETH'
}
export default function useWallet() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const history = useHistory()
  const path = history.location.pathname
  const { networks, setState, updateAccounts } = useGlobal()
  const {getProfileStatus} = useProfile()
  const [chainId, setChainId] = useState()
  const [balance, setBalance] = useState()
  const [network, setNetwork] = useState()
  const disConnect = async () => {
    if (window.ethereum.on) {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
      localStorage.removeItem('account')
      setState({
        accounts: null
      })
      setLocal('isConnect', false)
      if(path.includes('/chat')) {
        history.push('/chat')
      }
      if(path.includes('/profile')) {
        history.push('/profile')
      }
    }
  }
  const changeNetwork = async (network) => {
    setState({
      showConnectNetwork: false
    })
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    handleNewAccounts(account)
    if(path.includes('/profile')) {
      history.push(`/profile/${account}`)
    }
    const { name, decimals, symbol, chainId, rpcUrls, chainName, blockExplorerUrls } = token[network]
    const nativeCurrency = { name, decimals, symbol }
    let params = [{
      chainId,
      rpcUrls,
      chainName,
      nativeCurrency,
      blockExplorerUrls
    }]
    
    await window.ethereum?.request({ method: 'wallet_addEthereumChain', params })
    getAccounInfo(account)
  }
  const handleNewAccounts = newAccounts => {
    getCurrentBalance(newAccounts[0])
    updateAccounts(newAccounts[0])
    getNetworkInfo()
    setLocal('isConnect', true)
    setLocal('account', newAccounts[0])
  }

  const getAccounInfo = (account) => {
    if(!getLocal('isConnect')) return
    getCurrentBalance(account[0])
    if(path.includes('/profile')) {
      getProfileStatus()
    }
    setLocal('isConnect', true)
  }
  const getCurrentBalance = async(account) => {
    const balance = await provider.getBalance(account)
    const etherString = ethers.utils.formatEther(balance)
    console.log(etherString, 'etherString====>>')
    setBalance(etherString)
  }
  const changeProfileUrl = async() => {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if(path.includes('/profile')) {
      setState({
        profileAvatar: '',
        currentProfileAddress: account[0]
      })
      history.push(`/profile/${account[0]}`)
    }
  }
  const getNetworkInfo = async() => {
    const network = await provider.getNetwork()
    const item = networks.filter(i=> i.chainId === network.chainId)[0]
    const currNetwork = networkList[network.chainId]
    const client = createClient({
      url: item?.APIURL
    })
    setLocal('network', currNetwork)
    setNetwork(currNetwork)
    setChainId(network.chainId)
    setState({
      currentNetworkInfo:item,
      clientInfo: client
    })
    setLocal('currentGraphqlApi', item?.APIURL)
  }
  const initWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
      handleNewAccounts(account)
      if(account) {
        getAccounInfo(account)
      }
      window.ethereum.on('chainChanged', chainId => {
        setChainId(parseInt(chainId, 16))
        const item = networks.filter(i=> i.chainId === parseInt(chainId, 16))[0]
        getCurrentBalance(account[0])
        const client = createClient({
          url: item?.APIURL
        })
        setState({
          currentNetworkInfo:item,
          clientInfo: client
        })
        setLocal('currentGraphqlApi', item?.APIURL)
        const currNetwork = networkList[parseInt(chainId, 16)]
        setLocal('network', currNetwork)
        setNetwork(networkList[parseInt(chainId, 16)])
        console.log(chainId,account,'chainChanged====>>>')
      })
      window.ethereum.on('accountsChanged', (account) => {
        console.log(account, 'accountsChanged====>>>')
        updateAccounts(account[0])
        setLocal('account', account[0])
        getAccounInfo(account)
        changeProfileUrl()
      })
      window.ethereum.on('connect', id => {
        console.log('connect',id)
      })
      window.ethereum.on('disconnect', () => {
        console.log('wallet disconnect')
      })
      window.ethereum.on('message', message => {
        console.log('wallet message', message)
      })
      window.ethereum.on('notification', message => {
        console.log('wallet notification', message)
      })
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts)
      }
    }
  }
  useLayoutEffect(() => {
    initWallet()
  }, [getLocal('account')])
  return { disConnect, chainId, balance ,network, changeNetwork}
}
