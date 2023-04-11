import { token } from "../constant/token"
import { ethers } from "ethers"
import { detectMobile, getLocal, setLocal, getCurrentNetworkInfo } from "../utils"
import { useState, useLayoutEffect } from "react"
import useProfile from "./useProfile"
import MetaMaskOnboarding from '@metamask/onboarding'
import { useHistory } from 'react-router-dom'
import useGlobal from './useGlobal'
import { createClient } from 'urql'
const networkList = {
  // 2019: 'CZZ',
  // 47805: 'REI',
  // 1: 'ETH'
  513100: 'ETHF'
}
export default function useWallet() {
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
      setLocal('isConnect', 0)
      if(path.includes('/chat')) {
        history.push('/chat')
      }
      if(path.includes('/profile')) {
        history.push('/profile')
      }
    }
  }
  const connectOkexchain = async () => {
    setState({
      showConnectNetwork: false
    })
    try{
      if (typeof window !== 'undefined' && window.okexchain) {
        const accounts = await window.okexchain.request({ method: 'eth_requestAccounts' })
        handleNewAccounts(accounts)
        getAccounInfo(accounts)
        if(path.includes('/profile')) {
          history.push(`/profile/${accounts}`)
        }
        return accounts
      } else {
        window.location.href = 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge/related'
      }
    } catch (error) {
      throw error
    }
  }
  const changeNetwork = async (network) => {
    if(detectMobile()) {
      window.open('https://metamask.app.link/dapp/https://linke.network', '_blank');
    }
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
    getNetworkInfo()
    getCurrentBalance(newAccounts[0])
    updateAccounts(newAccounts[0])
    setLocal('account', newAccounts[0])
    setLocal('isConnect', 1)
  }

  const getAccounInfo = async(account) => {
    if(!getLocal('isConnect')) return
    getCurrentBalance(account[0])
    if(path.includes('/profile')) {
      getProfileStatus()
    }
    setLocal('isConnect', 1)
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
  const getCurrentBalance = async(account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(account)
    const etherString = ethers.utils.formatEther(balance)
    setBalance(etherString)
    setState({
      currentTokenBalance: etherString
    })
    return etherString
  }
  const getNetworkInfo = async() => {
    try {
      const item = await getCurrentNetworkInfo()
      setChainId(item.chainId)
      setState({
        chainId: item.chainId
      })
      if(!item) return
      const currNetwork = networkList[item.chainId]
      setLocal('network', currNetwork)
      const client = createClient({
        url: item?.APIURL
      })
      const signInClient = createClient({
        url: item?.signInGraphUrl
      })
      
      setNetwork(currNetwork)
      setState({
        currentChain: currNetwork,
        currentNetworkInfo: item,
        clientInfo: client,
        signInClientInfo: signInClient
      })
      setLocal('clientInfo', client)
      setLocal('currentGraphqlApi', item?.APIURL)
    } catch(error) {
      console.log(error, 'getNetworkInfo====')
    }
  }
  const setNetworkInfo = (chainId) => {
    const item = networks.filter(i=> i.chainId === parseInt(chainId, 16))[0]
    if(!item) {
      setChainId()
      return
    }
    const client = createClient({
      url: item?.APIURL
    })
    setState({
      currentNetworkInfo:item,
      clientInfo: client
    })
    setLocal('clientInfo', client)
    setLocal('network', item?.name)
    setNetwork(item?.name)
    setChainId(item?.chainId)
  }
  const handleChainChanged = async(chainId) => {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setNetworkInfo(chainId)
    getCurrentBalance(account[0])
  }
  const initWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const account = await window?.ethereum?.request({ method: 'eth_requestAccounts' })
      handleNewAccounts(account)
      getAccounInfo(account)
      window.ethereum.on('chainChanged', chainId => {
        setState({
          chainId: parseInt(chainId, 16)
        })
        handleChainChanged(chainId)
      })
      window.ethereum.on('accountsChanged', (account) => {
        history.push({
          pathname: `/chat`,
          state: {
            currentIndex: 0
          }
        })
        console.log('accountsChanged====>>>')
        updateAccounts(account[0])
        setLocal('account', account[0])
        getAccounInfo(account)
        changeProfileUrl()
      })
      window.ethereum.on('connect', id => {
        // console.log('connect',id)
      })
      window.ethereum.on('disconnect', () => {
        // console.log('wallet disconnect')
      })
      window.ethereum.on('message', message => {
        // console.log('wallet message', message)
      })
      window.ethereum.on('notification', message => {
        // console.log('wallet notification', message)
      })
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts)
      }
    }
  }
  useLayoutEffect(() => {
    initWallet()
  }, [getLocal('account')])
  return { disConnect, chainId, balance ,network, changeNetwork, connectOkexchain, getCurrentBalance }
}
