import { getDaiWithSigner, setLocal } from '../utils'
import {PROFILE_ABI} from '../abi'
import BigNumber from 'bignumber.js'
import useGlobal from './useGlobal'
import { getLocal } from '../utils'
import { useEffect, useState } from 'react'

export default function useProfile() {
  const { currentNetworkInfo, setState } = useGlobal()
  const [hasCreate, setHasCreate] = useState()
  const [newAccounts, setNewAccounts] = useState()
  const [profileInfo, setProfileInfo] = useState()
  const [profileName, setProfileName] = useState()
  const [ProfileDescription, setProfileDescription] = useState()
  const [profileId, setProfileId] = useState()
  const [followers, setFollowers] = useState()
  const getProfileStatus = async(account) => {
    if(account) {
      try{
        if(currentNetworkInfo && currentNetworkInfo?.ProfileAddress) {
          const res = await getDaiWithSigner(currentNetworkInfo?.ProfileAddress, PROFILE_ABI).defaultToken(account)
          const hasCreate = res && (new BigNumber(Number(res))).toNumber()
          setLocal('hasCreate', Boolean(hasCreate))
          setState({
            profileId: hasCreate
          })
          setProfileId(hasCreate)
          setHasCreate(Boolean(hasCreate))
          getMyprofileInfo(hasCreate)
        }
      } catch(error) {
        console.log(error, '===error')
      }
      return hasCreate
    }
  }

  const getAccounInfos = async() => {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // debugger
    await getProfileStatus(account[0])
    setNewAccounts(account[0])
    
  }
  const getMyprofileInfo = async(profileId) => {
    if(hasCreate) {
      // debugger
      try {
        if(currentNetworkInfo && currentNetworkInfo?.ProfileAddress) {
          const res = await getDaiWithSigner(currentNetworkInfo?.ProfileAddress, PROFILE_ABI).tokenURI(profileId)
          console.log(res)
          const {name, description, selfNFT}= JSON.parse(res)
          setProfileName(name)
          setProfileDescription(description)
        }
      } catch(error) {
        console.log(error, '===error')
      }
    }
  }
  useEffect(() => {
    if(getLocal('isConnect')) {
      getAccounInfos()
      getProfileStatus()
    }
  }, [getLocal('account'), newAccounts, currentNetworkInfo])
  
  return { hasCreate, followers, profileInfo, profileName, ProfileDescription, profileId, getProfileStatus, getAccounInfos }
}

