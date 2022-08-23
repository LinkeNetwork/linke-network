import MetaMaskOnboarding from '@metamask/onboarding'
import { getLocal, setLocal } from "../utils"
import { ethers } from "ethers"
import { useCallback, useEffect } from 'react'
import useGlobal from './useGlobal'
export default function useChain() {
  const { networks, setState } = useGlobal()
  const getChainInfo = useCallback(async() => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled() && getLocal('account')) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      console.log(network, 'network=========>>>')
      const item = networks.filter(i=> i.chainId === network?.chainId)[0]
      console.log(item, '===getChainInfo=')
      setLocal('currentNetwork', item?.name)
      setState({currentNetworkInfo:item})
      return item
    }
  }, [])
  return { getChainInfo }
}