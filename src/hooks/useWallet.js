import { token } from "../constant/token"
import { ethers } from "ethers"
import { getLocal, setLocal } from "../utils"
import { useState, useLayoutEffect } from "react"
import useProfile from "./useProfile"
import MetaMaskOnboarding from '@metamask/onboarding'
import { useHistory } from 'react-router-dom'
import useGlobal from './useGlobal'

const networkList = {
  2019: 'CZZ',
  47805: 'REI',
  1: 'ETH'
}
const provider = new ethers.providers.Web3Provider(window.ethereum)
export default function useWallet() {
  const history = useHistory()
  const path = history.location.pathname
  const { networks, setState, updateAccounts } = useGlobal()
  const {getProfileStatus} = useProfile()
  const [newAccounts, setNewAccounts] = useState()
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
    getMyAccount()
    getAccounInfo()
  }
  const getMyAccount = async () => {
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()
    setLocal('account', myAddress)
    setLocal('isConnect', true)
  }
  const handleNewAccounts = newAccounts => {
    updateAccounts(newAccounts[0])
    getNetworkInfo()
    setLocal('account', newAccounts[0])
  }

  const getAccounInfo = async() => {
    if(!getLocal('isConnect')) return
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setLocal('account', account[0])
    setNewAccounts(account[0])
    if(path.includes('/profile')) {
      getProfileStatus()
    }
    setLocal('isConnect', true)
    const balance = await provider.getBalance(account[0])
    const etherString = ethers.utils.formatEther(balance)
    setBalance(etherString)
    return etherString
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
    setLocal('network', currNetwork)
    setNetwork(currNetwork)
    setChainId(network.chainId)
    setState({currentNetworkInfo:item})
    setLocal('currentGraphqlApi', item?.APIURL)
  }
  const initWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
      handleNewAccounts(account)
      if(account) {
        getAccounInfo()
      }
      window.ethereum.on('chainChanged', chainId => {
        setChainId(parseInt(chainId, 16))
        const item = networks.filter(i=> i.chainId === parseInt(chainId, 16))[0]
        setState({currentNetworkInfo:item})
        setLocal('currentGraphqlApi', item?.APIURL)
        const currNetwork = networkList[parseInt(chainId, 16)]
        setLocal('network', currNetwork)
        setNetwork(networkList[parseInt(chainId, 16)])
        getAccounInfo()
        console.log(chainId, 'chainChanged====>>>')
      })
      window.ethereum.on('accountsChanged', (chainId) => {
        console.log(chainId, 'chainId====>>>')
        getAccounInfo()
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
  return { disConnect, chainId, newAccounts, balance ,network, changeNetwork}
}
