import { token } from "../constant/token"
import { ethers } from "ethers"
import { getLocal, setLocal } from "../utils"
import { useState, useLayoutEffect, useEffect } from "react"
import useProfile from "./useProfile"
import MetaMaskOnboarding from '@metamask/onboarding'
import { useHistory } from 'react-router-dom'
import useGlobal from './useGlobal'

const networkList = {
  2019: 'CZZ',
  47805: 'REI',
  1: 'ETH'
}
export default function useWallet() {
  const history = useHistory()
  const { networks, setState } = useGlobal()
  const {getProfileStatus, getAccounInfos} = useProfile()
  const [newAccounts, setNewAccounts] = useState()
  const [chainId, setChainId] = useState()
  const [balance, setBalance] = useState()
  const [network, setNetwork] = useState()
  
  // network chainchange
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
      setLocal('isConnect', false)
    }
  }

  const getConnect = async (network) => {
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
    getMyAccount(network)
    getCurrentNetwork()
    getAccounInfo()
    const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return newAccounts
  }
  const getCurrentNetwork = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    const currNetwork = networkList[network.chainId]
    setLocal('network', currNetwork)
    setNetwork(currNetwork)
    return currNetwork
  }
  const getMyAccount = async (network) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()
    setLocal('account', myAddress)
    setLocal('isConnect', true)
  }

  const getAccounInfo = async() => {
    // debugger
    if(!getLocal('isConnect')) return
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setNewAccounts(account[0])
    getAccounInfos()
    getProfileStatus()
    setLocal('isConnect', true)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(account[0])
    const etherString = ethers.utils.formatEther(balance)
    const network = await provider.getNetwork()
    const item = networks.filter(i=> i.chainId === chainId)[0]
    setState({currentNetwork:item})

    // debugger
    setBalance(etherString)
    if(getLocal('isConnect')) {
      const currNetwork = networkList[network.chainId]
      setLocal('network', currNetwork)
      setNetwork(currNetwork)
      setChainId(network.chainId)
      setLocal('account', account[0])
    }
    return etherString
  }
  const changeProfileUrl = async() => {
    const path = history.location.pathname
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if(path.includes('/profile')) {
      setState({
        profileAvatar: '',
        currentProfileAddress: account[0]
      })
      history.push(`/profile/${account[0]}`)
    }
    
  }
  const initWallet = async () => {
    // debugger
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      const item = networks.filter(i=> i.chainId === network.chainId)[0]
      setState({currentNetwork:item})
      console.log(item, network, 'network111==')
      if(getLocal('isConnect')) {
          const currNetwork = networkList[network.chainId]
          setLocal('network', currNetwork)
          setNetwork(currNetwork)
          getAccounInfo()
          setChainId(network.chainId)
      }
      window.ethereum.on('chainChanged', chainId => {
        setChainId(parseInt(chainId, 16))
        const currNetwork = networkList[parseInt(chainId, 16)]
        setLocal('network', currNetwork)
        setNetwork(networkList[parseInt(chainId, 16)])
        getAccounInfo()
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
        // window.ethereum.off('accountsChanged', getBalance)
      }
    }
  }
  useLayoutEffect(() => {
    initWallet()
  }, [getLocal('account')])
  return { disConnect, getConnect, getCurrentNetwork, chainId, newAccounts, balance ,network, getAccounInfo}
}
