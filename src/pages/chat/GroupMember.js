import { useEffect, useState } from "react"
import styled from "styled-components"
import intl from 'react-intl-universal'
import Image from '../../component/Image'
import { useHistory } from 'react-router-dom'
import { Jazzicon } from '@ukstv/jazzicon-react'
import Modal from '../../component/Modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PUBLIC_GROUP_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI } from '../../abi'
import { detectMobile, formatAddress, getLocal, getDaiWithSigner } from "../../utils"
import useGroupMember from '../../hooks/useGroupMember'
import useGlobal from "../../hooks/useGlobal"
import Loading from '../../component/Loading'
import { ethers } from "ethers"
import ewmLogo from '../../assets/images/ewm.png'
export default function GroupMember(props) {
  const { currentAddress, closeGroupMember, handleShowMask, handleHiddenMask, handlePrivateChat, hasAccess, shareGroup } = props
  const { setState, currentNetworkInfo } = useGlobal()
  const { getGroupMember } = useGroupMember()
  const [canQuitRoom, setCanQuitRoom] = useState()
  const [memberList, setMemberList] = useState([])
  const [manager, setManager] = useState()
  const history = useHistory()
  const [copyText, setCopyText] = useState('copy')
  const [showCopyText, setShowCopyText] = useState(false)
  const [showOperate, setShowOperate] = useState()
  const [groupInfo, setGroupInfo] = useState()
  const [showQuitRoomConfirm, setShowQuitRoomConfirm] = useState(false)
  const [groupType, setGroupType] = useState()
  const [orignMemberList, setOrignMemberList] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [showPrivateChat, setShowPrivateChat] = useState(false)
  const [privateKey, setPrivateKey] = useState()
  const [showAddManager, setShowAddManager] = useState(false)
  const [userCount, setUserCount] = useState()
  const [skipNum, setSkipNum] = useState(0)
  const getMemberList = async () => {
    const data = await getGroupMember(currentAddress, skipNum)
    setSkipNum(skipNum + 50)
    setUserCount(data?.userCount)
    const memberListInfo = data?.users?.map((item) => {
      return {
        ...item,
        showProfile: false
      }
    })
    setMemberList(memberList.concat(memberListInfo))
    setOrignMemberList(memberList.concat(memberListInfo))
    const groupType = data?._type
    setGroupType(groupType)
    await getManager(groupType)
    setGroupInfo(data)
  }
  const handleSearchMember = (event) => {
    const list = [...orignMemberList]
    const value = event.target.value
    if(value) {
      var newList = list.filter(item => item.profile.name.includes(value) || item.name.includes(value) || item.id.toUpperCase().includes(value.toUpperCase()))
      setMemberList(newList)
    } else {
      setMemberList([...orignMemberList])
    }
  }
  const handleChat = (item) => {
    handlePrivateChat(item, privateKey)
  }
  const getChatStatus = async (item) => {
    const res = await getDaiWithSigner(currentNetworkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(item.id.toLowerCase())
    setPrivateKey(res)
    setShowPrivateChat(Boolean(res))
  }
  const handleViewProfile = (item, index) => {
    getChatStatus(item)
    item.showProfile = true
    setShowOperate(true)
    setTimeout(() => {
      item.showProfile = false
      setShowOperate(false)
    }, 4000)
  }
  const viewProfile = (item) => {
    setState({
      currentProfileAddress: item.id
    })
    history.push({
      pathname: `/profile/${item.id}`,
      state: item.id
    })
  }
  const confirmQuitRoom = async () => {
    debugger
    try {
      const abi = groupType == 3 ? PUBLIC_SUBSCRIBE_GROUP_ABI : PUBLIC_GROUP_ABI
      const tx = await getDaiWithSigner(currentAddress, abi).quitRoom()
      handleShowMask()
      closeGroupMember()
      await tx.wait()
      setState({
        hasQuitRoom: true
      })
      closeGroupMember()
      history.push('/chat')
      window.location.reload()
    } catch (error) {
      console.log(error, '====error')
      closeGroupMember()
      handleHiddenMask()
    }
  }
  const onCopy = () => {
    setShowCopyText(true)
    setCopyText('copied')
    setTimeout(() => {
      setShowCopyText(false)
      setCopyText('copy')
    }, 200)
  }
  const quitRoomConfirm = () => {
    return (
      <Modal title="Leave Group" visible={showQuitRoomConfirm} onClose={() => setShowQuitRoomConfirm(false)}>
        <div className='dialog-title'>Do you want to leave this group?</div>
        <div className='btn-wrapper' style={{
          display: 'flex',
          margin: '20px 0 10px',
        }}>
          <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={confirmQuitRoom} style={{
            marginRight: '10px'
          }}>
            Leave
          </button>
          <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={() => setShowQuitRoomConfirm(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    )
  }
  const groupInfoList = () => {
    return (
      <div className="group-info-wrap">
        <div className="item">
          <span className="name">{intl.get('RoomName')}: </span>
          <span className="value">{groupInfo?.name}</span>
        </div>
        <div className="item">
          <span className="name">{intl.get('GroupAddress')}: </span>
          <div className="d-flex">
            <span className="value">{formatAddress(groupInfo?.id, 7, 9) }</span>
            <div>
              {
                showCopyText 
                ? <div className="copy-text">{copyText}</div>
                : <CopyToClipboard text={`https://linke.network/chat/${groupInfo?.id}/${getLocal('network')}`}>
                    <div className='iconfont icon-fuzhiwenjian' onClick={onCopy}></div>
                  </CopyToClipboard>
              }
            </div>
          </div>
        </div>
        <div className="item">
          <span className="name">{intl.get('GroupDescribe')}: </span>
          <span className="value">{groupInfo?.description}</span>
        </div>
        <div className="item">
          <span className="name">{intl.get('GroupQRCode')}: </span>
          <img src={ewmLogo} className="ewm-logo" alt='' onClick={shareGroup} />
        </div>
        {/* <div className="btn btn-lg btn-primary share-btn" onClick={shareGroup}>
          <span className="iconfont icon-share"></span>
          share group
        </div> */}
      </div>
    )
  }
  const addManagerWrapper = () => {
    return (
      <Modal title="Add Manager" visible={showAddManager} onClose={() => { setShowAddManager(false) }}>
        <div className="add-manager-wrapper">Manager:
          <div className="item"><input /></div>
        </div>
        <div className="btn-operate" style={btnOperateStyle}>
          <div className="btn btn-lg btn-primary" style={btnStyle}>Confirm</div>
          <div className="btn btn-lg btn-light" style={btnStyle} onClick={() => { setShowAddManager(false) }}>Cancel</div>
        </div>
      </Modal>
    )
  }
  const btnOperateStyle = {
    margin: '20px 0 10px',
    display: 'flex',
    justifyContent: 'center'
  }
  const btnStyle = {
    margin: '0 10px'
  }
  const getManager = async (groupType) => {
    if (groupType == 1 || groupType == 2) {
      const tx = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).profile()
      setManager(tx.manager)
      const canQuitRoom = tx.manager?.toLowerCase() == getLocal('account')?.toLowerCase()
      setCanQuitRoom(canQuitRoom)
      console.log(tx, 'tx===manager')
    }
    if (groupType == 3) {
      debugger
      var res = await getDaiWithSigner(currentAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).managers(getLocal('account'))
      const isMaster = ethers.BigNumber.from(res) > 0
      setCanQuitRoom(isMaster)
    }
  }
  const loadingDatas = () => {
    setTimeout(() => {
      getMemberList()
    }, 10)
  }
  useEffect(() => {
    getMemberList()
  }, [])

  return (
    <GroupMemberContainer className={detectMobile() ? 'member-wrap-client' : ''} id="scrollableList">
      {
        showAddManager &&
        addManagerWrapper()
      }
      {
        showLoading &&
        <Loading />
      }
      {
        quitRoomConfirm()
      }
      <div className="title">
        <span>Group Info</span>
        <span className="iconfont icon-close" onClick={closeGroupMember}></span>
      </div>
      {
        groupInfoList()
      }
      <div className="member-list-wrapper">
        <div className="sub-title">
          <div>
              {intl.get('Members')} {
              +userCount > 0 &&
              <span>({userCount})</span>
            }
          </div>
        </div>
      </div>
      <div className='search-wrap'>
        <div className="position-relative">
          <span className="icon-search-wrapper">
            <i className="iconfont icon-search"></i>
          </span>
          <input className="search-input" type="search" placeholder={intl.get('Search')} aria-label="Search..." onInput={handleSearchMember} />
        </div>
      </div>

      <InfiniteScroll
        scrollableTarget="scrollableList"
        dataLength={memberList?.length}
        next={loadingDatas}
        hasMore={true}
      >
        <div className="member-list">
          {
            memberList?.map((item, index) => {
              return (
                <div className="item" key={index}>
                  {
                    item.showProfile &&
                    <div className='user-profile-wrap'>
                      {
                        item.profile.avatar
                          ? <Image src={item.profile.avatar} size={60} />
                          : <Jazzicon address={item.id} className="avatar-image" />
                      }
                      <div className='name'>{formatAddress(item.id, 6, 6)}</div>
                      <div className="button-wrapper">
                        <div className="view-btn" onClick={() => viewProfile(item)}>View</div>
                        {
                          showPrivateChat && getLocal('account').toLowerCase() != item?.id.toLowerCase() &&
                          <div className="view-btn" onClick={() => handleChat(item)}>Chat</div>
                        }
                      </div>
                      {showOperate && <span></span>}
                    </div>
                  }
                  <div className="avatar" onClick={() => handleViewProfile(item, index)}>
                    {
                      item.profile.avatar
                        ? <Image src={item.profile.avatar} size={40} />
                        : <Jazzicon address={item.id} className="avatar-icon" />
                    }

                  </div>
                  <div className="name">{item.name || item.profile.name}</div>
                  <div className="address">
                    {formatAddress(item.id, 6, 6)}
                  </div>
                  {(groupType == 1 || groupType == 2) && getLocal('account') == item.id && manager?.toLowerCase() !== item.id.toLowerCase() && <div>(You)</div>}
                  {
                    (groupType == 1 || groupType == 2) && manager?.toLowerCase() == item.id.toLowerCase() && <div>(Owner)</div>
                  }
                  {
                    // groupType == 3 && canQuitRoom && <div>(Owner)</div>
                  }
                </div>
              )

            })
          }

        </div>
      </InfiniteScroll>
      {
        !canQuitRoom && hasAccess &&
        <div className="btn btn-lg btn-primary" onClick={() => setShowQuitRoomConfirm(true)}>{intl.get('QuitRoom')}</div>
      }
    </GroupMemberContainer>
  )
}
const GroupMemberContainer = styled.div`
position: absolute;
right: 0;
left: 70%;
bottom: 0;
top: 0;
height: 100%;
overflow: auto;
background: #eee;
z-index: 100;
.copy-text {
  font-size: 14px;
}
.share-btn {
  position: relative;
  .icon-share {
    position: inherit;
    right: 2px;
    top: 2px;
  }
}
&.member-wrap-client {
  left: 0;
  .title {
    left: 0
  }
}
.btn {
  display: flex;
  margin: 10px;
  justify-content: center;
}
.manager-wrapper{
  display: flex;
  .info-wrapper {
    display: flex;
    .item {
      margin-left: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      display: flex;
      flex: 1;
      padding: 6px 4px;
    }
  }
}
.title {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  position: fixed;
  left: 70%;
  right: 0;
  top: 0;
  z-index: 10
}
.iconfont {
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.icon-fuzhiwenjian {
  right: inherit;
  margin-left: 6px;
}
.search-wrap {
  margin: 10px;
  background: #fff;
  height: 40px;
  border-radius: 2px;
}
.icon-search-wrapper{
  left: 50px;
}
.search-input{
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 10px 20px 10px 35px;
}
.avatar-icon {
  width: 40px;
  height: 40px
}
.member-list {
  // height: calc(100vh - 340px);
  overflow: auto;
  .button-wrapper {
    display: flex;
    div {
      margin: 3px 5px;
    }
  }
  .item {
    display: flex;
    height: 60px;
    background: #fff;
    margin: 6px 10px;
    border-radius: 2px;
    align-items: center;
    padding: 0 20px;
    position: relative;
    &:nth-child(1), &:nth-child(2) {
      .user-profile-wrap {
        margin-top: 140px;
      }
    }
  }
  .avatar-image {
    width: 60px;
    height: 60px;
  }
  .name {
    font-weight: bold;
    font-size: 16px;
    margin-left: 16px;
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .address{
    margin-left: 4px;
    font-size: 12px;
  }
}
.group-info-wrap {
  background: #fff;
  margin: 70px 10px 0;
  padding: 20px 20px 10px;
  .item {
    margin-bottom: 20px;
    display: flex;
    .ewm-logo {
      width: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
    .name {
      font-weight: bold;
      font-size: 15px;
      margin-right: 4px;
    }
  }
}
.sub-title {
  margin: 10px;
  background: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}
`