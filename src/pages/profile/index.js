import CreateProfile from './CreateProfile'
import ViewProfile from './ViewProfile'
import { getContractConnect, getLocal } from '../../utils'
import PROFILE_ABI from '../../abi/PROFILE_ABI.json'
import Introduction from "../chat/Introduction"
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './index.scss'
import useGlobal from '../../hooks/useGlobal'

export default function Profile() {
  const { currentNetworkInfo, setState, profileId, currentProfileAddress, accounts, isJumpToProfile } = useGlobal()
  const history = useHistory()
  const path = history.location.pathname
  const [urlParams, setUrlParams] = useState()
  const [pathName, setPathName] = useState()
  const [hasCreate, setHasCreate] = useState()
  const getProfileStatus = async (account) => {
    if (account) {
      try {
        if (currentNetworkInfo && currentNetworkInfo?.ProfileAddress) {
          const res = await getContractConnect(currentNetworkInfo?.ProfileAddress, PROFILE_ABI).defaultToken(account)
          const hasCreate = res && res.toNumber()
          setUrlParams(account)
          setState({
            hasCreateProfile: Boolean(hasCreate),
            profileId: hasCreate
          })
          console.log(Boolean(hasCreate), 'Boolean(hasCreate)====')
          setHasCreate(Boolean(hasCreate))
        }
      } catch (error) {
        console.log(error, '====error')
      }
    }
  }
  const connectWallet = () => {
    setState({
      showConnectNetwork: true
    })
  }
  useEffect(() => {
    const pathname = path.split('/profile/')[1]
    setPathName(pathname)
    getProfileStatus(pathname)
  }, [accounts, getLocal('isConnect'), path, hasCreate, profileId, currentProfileAddress, isJumpToProfile, currentNetworkInfo])
  return (
    <div className='profile-container'>
      <div className='profile-wrapper'>
        {
          !accounts &&
          <Introduction myAddress={accounts}
            connectWallet={() => connectWallet()}></Introduction>
        }
        {
          accounts &&
          <>
            {
              (!hasCreate && hasCreate !== undefined && accounts && pathName !== undefined && urlParams !== undefined && pathName?.toLowerCase() === accounts?.toLowerCase()) && <CreateProfile newAccounts={urlParams} />
            }
            {
              (hasCreate && accounts && urlParams !== undefined || (pathName !== undefined && pathName?.toLowerCase() !== accounts?.toLowerCase())) && <ViewProfile urlParams={urlParams} currentNetwork={currentNetworkInfo} />
            }
          </>
        }

      </div>
    </div>
  )
}