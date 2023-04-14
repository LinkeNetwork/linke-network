import { getDaiWithSigner, setLocal, getCurrentNetworkInfo } from '../utils'
import {PROFILE_ABI} from '../abi'
import BigNumber from 'bignumber.js'
import useGlobal from './useGlobal'
import { getLocal } from '../utils'
import { useEffect, useState } from 'react'

export default function useProfile() {
  const { currentNetworkInfo, setState } = useGlobal()
  const [hasCreate, setHasCreate] = useState()
  const [profileName, setProfileName] = useState()
  const [ProfileDescription, setProfileDescription] = useState()
  const [profileId, setProfileId] = useState()
  const getProfileStatus = async(account) => {
    const networkInfo = await getCurrentNetworkInfo()
    if(account) {
      try{
        if(currentNetworkInfo && networkInfo?.ProfileAddress) {
          const res = await getDaiWithSigner(networkInfo?.ProfileAddress, PROFILE_ABI).defaultToken(account)
          var hasCreate = res && (new BigNumber(Number(res))).toNumber()
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
      return Boolean(hasCreate)
    }
  }
  const getMyprofileInfo = async(profileId) => {
    const networkInfo = await getCurrentNetworkInfo()
    if(hasCreate) {
      // debugger
      try {
        if(networkInfo && networkInfo?.ProfileAddress) {
          const res = await getDaiWithSigner(networkInfo?.ProfileAddress, PROFILE_ABI).tokenURI(profileId)
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
      getProfileStatus()
    }
  }, [getLocal('account'), currentNetworkInfo])
  
  return { hasCreate, profileName, ProfileDescription, profileId, getProfileStatus }
}

