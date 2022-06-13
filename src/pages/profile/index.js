import CreateProfile from './CreateProfile'
import ViewProfile from './ViewProfile'
import { getDaiWithSigner, getLocal, setLocal} from '../../utils'
import PROFILE_ABI from '../../abi/PROFILE_ABI.json'
import BigNumber from 'bignumber.js'
import HeaderInfo from "../layout/HeaderInfo"
import useWallet from '../../hooks/useWallet'
import Modal from '../../component/Modal'
import Introduction from "../chat/Introduction"
import Nav from "../nav"
import { useHistory } from 'react-router-dom'
import ChangeNetwork from '../chat/ChangeNetwork'
import { useEffect, useRef, useState } from 'react'
import './index.scss'
import useGlobal from '../../hooks/useGlobal'

export default function Profile() {
  const { currentNetwork, hasCreateProflie ,setState , profileId, currentProfileAddress} = useGlobal()
  const history = useHistory()
  const path = history.location.pathname
  const { getConnect, getCurrentNetwork, disConnect, chainId, newAccounts, network , balance} = useWallet()
  const [showAccount, setShowAccount] = useState(false)
  const [account, setAccount] = useState(getLocal('account'))
  const [showWalletList, setShowWalletList] = useState(false)
  const [showMenulist, setShowMenulist] = useState(false)
  const [urlParams, setUrlParams] = useState()
  const [pathName, setPathName] = useState()
  const [hasCreate, setHasCreate] = useState()
  const hasCreateRef = useRef()
  const [hasCreateProfile, setHasProfile] = useState()
  const getProfileStatus = async(name) => {
    if(name || newAccounts || getLocal('account')) {
      // debugger
      const account = name
      try {
        if(currentNetwork && currentNetwork?.ProfileAddress) {
          const res = await getDaiWithSigner(currentNetwork?.ProfileAddress, PROFILE_ABI).defaultToken(account)

          const hasCreate = res && (new BigNumber(Number(res))).toNumber()
          console.log(hasCreate,res,  Boolean(hasCreate), 'hasCreate======', pathName, getLocal('account').toLowerCase())
          setUrlParams(account)
          setState({
            hasCreateProfile: Boolean(hasCreate),
            profileId: hasCreate
          })
          setHasCreate(Boolean(hasCreate))
        }
      } catch(error) {
        console.log(error, '====error')
      }
      
    }
  }
  const connectWallet = () => {
    setShowWalletList(true)
  }
  const handleChangeNetWork = async (network) => {
    setShowMenulist(false)
    const newAccounts = await getConnect(network)
    const currentNetwork = await getCurrentNetwork()
    setLocal('account', newAccounts[0]?.toLowerCase())
    setAccount(newAccounts[0])
    setShowWalletList(false)
    console.log(account, chainId, currentNetwork, newAccounts[0], getLocal('network'), 'network1=')
  }
  const handleDisconnect = () => {
    setShowAccount(false)
    setAccount('')
    if(path.includes('/profile')) {
      history.push('/profile')
    }
    disConnect().then(() => {
      setAccount(getLocal('account'))
    })
  }
  const reloadCreateProfile = () => {
    setUrlParams('')
  }
  const reloadViewProfile = () => {
    setPathName(getLocal('account').toLowerCase())
    getProfileStatus(getLocal('account').toLowerCase())
    setUrlParams(getLocal('account').toLowerCase())
  }
  useEffect(() => {
    console.log(currentProfileAddress, 'currentProfileAddress====')
    setTimeout(() => {
      const pathname = path.split('/profile/')[1]
      setPathName(pathname)
      getProfileStatus(pathname)
      console.log(pathname, 'pathname===')
    }, 0)
  }, [account, newAccounts, getLocal('isConnect'), hasCreate, pathName, profileId, currentProfileAddress])
  return(
    <div className='profile-container'>
      <Modal title="Connect Wallet" visible={showWalletList} onClose={() => setShowWalletList(false)}>
        <ChangeNetwork handleChangeNetWork={(network) => handleChangeNetWork(network)} closeNetworkContainer={() => setShowWalletList(false)} />
      </Modal>
      <HeaderInfo handleShowAccount={() => setShowAccount(true)} myAddress={newAccounts} showHeaderInfo={account} handleChangeNetWork={(network) => handleChangeNetWork(network)} handleDisconnect={() => handleDisconnect()} onCloseAccount={() => setShowAccount(false)} currNetwork={network} showWalletList={showWalletList} showAccount={showAccount} handleMenu={() => setShowMenulist(true)} chainId={chainId} balance={balance} />
      {
        <Nav showMenulist={showMenulist} hiddenMenuList={() => setShowMenulist(false)} reloadCreateProfile={reloadCreateProfile}  reloadViewProfile={reloadViewProfile}/>
      }
      {
        !account &&
        <Introduction myAddress={account}
        connectWallet={() =>setShowWalletList(true)}></Introduction>
      }
      {
        (!hasCreate && hasCreate !== undefined && account && pathName !== undefined && urlParams!== undefined && pathName === getLocal('account'))  && <CreateProfile newAccounts={urlParams}/>
      }
      {
        (hasCreate && account && urlParams!== undefined || (pathName !== undefined && pathName !== getLocal('account'))) && <ViewProfile urlParams={urlParams} currentNetwork={currentNetwork}/>
      }
    </div>
  )
}