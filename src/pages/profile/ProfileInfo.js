import styled from 'styled-components'
import { createClient } from 'urql'
import { getDaiWithSigner, getLocal } from '../../utils'
import CopyButton from '../../component/Copy'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PROFILE_ABI, FOLLOW_ABI, ENCRYPTED_COMMUNICATION_ABI } from '../../abi'
import useChain from '../../hooks/useChain'
import useGlobal from '../../hooks/useGlobal'
import Loading from '../../component/Loading'
import Modal from '../../component/Modal'
import FollowerList from './FollowerList'
export default function ProfileInfo(props) {
  const { getChainInfo } = useChain()
  const { hasCreateProfile, setState, profileId, profileAvatar } = useGlobal()
  const { urlParams } = props
  const history = useHistory()
  const [address, setAddress] = useState()
  const [hasFollow, setHasFollow] = useState()
  const [profileInfo, setProfileInfo] = useState()
  const [shoMask, setShoMask] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false)
  const [followType, setFollowType] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [showPrivateChat, setShowPrivateChat] = useState()
  const [privateKey, setPrivateKey] = useState()
  const handleCancelFollow = () => {

  }
  const getPrivateChatStatus = async (pathname) => {
    debugger
    const networkInfo = await getChainInfo()
    const res = await getDaiWithSigner(networkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(pathname)
    setShowPrivateChat(Boolean(res))
    setPrivateKey(res)
    console.log(res, 'getPrivateChatStatus=====')
  }
  const getFollowStatus = async (client) => {
    // debugger
    const tokensQuery = `
    query{
      followers(where:{from: "`+ getLocal('account')?.toLowerCase() + `", to: "` + urlParams?.toLowerCase() + `"}){
        to,
        from,
        tokenId,
        token
      }
    }
    `
    const res = await client.query(tokensQuery).toPromise()
    console.log(res, 'getFollowStatus=====')
    setHasFollow(Boolean(res.data.followers.length))
    setTimeout(() => {
      setShoMask(false)
    }, 100)

  }
  const getMyprofileInfo = async (address) => {
    // debugger
    const networkInfo = await getChainInfo()

    const tokensQuery = `
    query{
      profile(id: "`+ address.toLowerCase() + `"){
        id,
        description,
        name,
        avatar,
        tokenId,
        selfNFT,
        follower,
        following
      }
    }
    `
    const client = createClient({
      url: networkInfo?.APIURL
    })
    const res = await client.query(tokensQuery).toPromise()
    getFollowStatus(client)
    setShoMask(false)
    console.log(res, 'urlParams====')
    setState({
      tokenId: res.data?.profile?.tokenId,
      profileAvatar: res.data?.profile?.avatar
    })
    // getProfileBaseUrl(res.data?.profile.tokenId)
    setProfileInfo(res.data?.profile)
  }
  const handleFollow = async () => {
    const tokenrul = {
      "name": profileInfo?.name,
      "description": profileInfo?.description,
      "image": "https://infura-ipfs.io/ipfs/"
    }
    debugger
    if (profileInfo?.selfNFT) {
      setShoMask(true)
      const res = await getDaiWithSigner(profileInfo?.selfNFT, FOLLOW_ABI).awardItem(urlParams, tokenrul)
      let callback = await res.wait()
      setHasFollow(true)
      getMyprofileInfo(address)
    }
  }
  const followerMoadl = () => {
    return (
      <Modal title={modalTitle} visible={showFollowers} onClose={() => { setShowFollowers(false) }}>
        <FollowerList urlParams={address} followType={followType} hiddenFollowerList={() => { setShowFollowers(false) }} />
      </Modal>
    )
  }
  const getFollowerList = (type) => {
    const title = type === 1 ? 'Followings' : 'Followers'
    setFollowType(type)
    setModalTitle(title)
    setShowFollowers(true)
  }
  const getPublicKey = () => {
    window.ethereum
    .request({
      method: 'eth_getEncryptionPublicKey',
      params: [getLocal('account')], // you must have access to the specified account
    })
    .then(async(result) => {
      setShoMask(true)
      const networkInfo = await getChainInfo()
      const res = await getDaiWithSigner(networkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).register(result)
      await res.wait()
      setShoMask(false)
      setShowPrivateChat(true)
      console.log(res, '======getPublicKey')
    })
    .catch((error) => {
      if (error.code === 4001) {
        console.log("We can't encrypt anything without the key.");
      } else {
        console.error(error);
      }
    })
  }
  const jupmToChat = () => {
    history.push({
      pathname: `/chat/${address}`,
      state: {
        name: profileInfo?.name,
        address: address,
        avatar: profileAvatar,
        currentIndex: 1,
        privateKey: privateKey
      }
    })
  }
  const OpenPrivate = () => {
    getPublicKey()
  }
  useEffect(() => {
    setAddress(getLocal('account'))
   
    const pathname = history.location.pathname.split('/profile/')[1]
    if (pathname) {
      // debugger
      setAddress(pathname)
      if (!getLocal('isConnect')) return
      getMyprofileInfo(pathname)
      getPrivateChatStatus(pathname)
    } else {
      if (!getLocal('isConnect')) return
      getMyprofileInfo(getLocal('account'))
    }
  }, [urlParams, getLocal('account'), hasCreateProfile, profileId])
  return (
    <ProfileInfoContanier>
      {
        showFollowers && followerMoadl()
      }
      <div className="profile-name">
        {profileInfo?.name}
      </div>
      <div className='profile-info-wrap'>
        <div className='profile-item'>
          <div className='name'>Id</div>
          <div className='value'>{profileInfo?.tokenId}</div>
        </div>
        <div className='profile-item'>
          <div className='name'>Address</div>
          <div className='address-format'>
            {address}</div>
          <CopyButton toCopy={address}></CopyButton>
        </div>
        <div className='profile-item'>
          <div className='name'>Description</div>
          <div className='value'>{profileInfo?.description}</div>
        </div>
      </div>
      <div className='follow-wrap'>
        <div className="follow-item" onClick={() => { getFollowerList(1) }}>
          <div className='count'>{profileInfo?.following}</div>
          <div className='name'>Followings</div>
        </div>
        <div className='follow-item-divider'></div>
        <div className="follow-item" onClick={() => { getFollowerList(2) }} >
          <div className='count'>{profileInfo?.follower}</div>
          <div className='name'>Followers</div>
        </div>
      </div>
      {
        hasCreateProfile &&
        <div className='follow-operate'>
          {
            (urlParams && !hasFollow && hasFollow != undefined && urlParams != getLocal('account')?.toLowerCase()) &&
            <div className='follow-btn' onClick={(handleFollow)}>Follow</div>
          }
          {
            hasFollow && hasFollow != undefined &&
            <div className='follow-btn' onClick={handleCancelFollow}>Following</div>
          }

          {
            getLocal('account')?.toLowerCase() != address?.toLowerCase() && showPrivateChat != undefined && showPrivateChat &&
            <div className='follow-btn' onClick={jupmToChat}>
              <span>Chat</span>
            </div>
          }

          {
            showPrivateChat != undefined && !showPrivateChat && getLocal('account')?.toLowerCase() == address?.toLowerCase() &&
            <div className='follow-btn open-btn' onClick={OpenPrivate}>
              <span>Open Private Message</span>
            </div>
          }
        </div>
      }
      {
        shoMask &&
        <Loading />
      }
    </ProfileInfoContanier>
  )
}
const ProfileInfoContanier = styled.div`
width: 100%;
.profile-name {
  text-align: left;
  font-weight: 600;
  font-size: 46px;
  line-height: 70px;
  word-wrap: break-word;
  margin: 10px auto;
  display: flex
}
.address-full-wrap {
  display: flex;
  font-weight: 400;
  color: #666;
  font-size: 13px;
  width: 100%;
  .name {
    width: 120px;
    color: #000;
    font-weight: 500;
  }
}
.copy-image{
  margin-left: 10px;
  cursor: pointer;
}
.follow-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 40px;
}
.follow-item {
  &-divider {
    width: 1px;
    height: 100%;
    background-color: #f2f2f2;
    margin: 0 70px;
    height: 55px;
  }
}
.count {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 5px;
}
.name {
  font-weight: 500;
  opacity: .6;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
}
.profile-item {
  display: flex;
  color: #666;
  margin: 10px 0;
  .name {
    width: 120px;
    color: #000;
  }
}
.follow-operate {
  display: flex;
}
.follow-btn {
  width: 140px;
  background: #333;
  color: #fff;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  border-radius: 5px;
  margin: 20px 10px 0 0;
  
  cursor: pointer;
  .icon-liaotian {
    margin-right: 4px;
  }
}
.open-btn {
  width: auto;
  padding: 0 14px;
}
@media (max-width: 1023px) {
  .address{
  text-align: center;
  font-size: 1.2rem;
    line-height: 2rem;
    height: 2rem;
    width: auto;
    &-format{
      width: 90px;
      flex: 1 1;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }
  .copy-image {
    display: none
  }
  .follow-wrap{
    margin: 20px 0 30px;
    justify-content: center;
  }
  .follow-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
`