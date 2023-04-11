import { detectMobile, getLocal, formatAddress } from "../../utils"
import { useEffect, useState, Fragment, useRef } from "react"
import Modal from '../../component/Modal'
import { useHistory } from "react-router-dom"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from "styled-components"
import { Jazzicon } from '@ukstv/jazzicon-react'
import EmptyInfo from './EmptyInfo'
import localForage from "localforage"
import useGlobal from "../../hooks/useGlobal"
import Image from "../../component/Image"
import useWallet from "../../hooks/useWallet"
import intl from "react-intl-universal"
import useGroupList from "../../hooks/useGroupList";
export default function GroupList(props) {
  const { hasCreateRoom, setState, currentNetworkInfo, hasQuitRoom, accounts, clientInfo, transactionRoomHash, groupLists } = useGlobal()
  const { showChatList, showMask, hiddenMask, onClickDialog, newGroupList, currentTabIndex, currentAddress, searchGroup } = props
  const [groupList, setGroupList] = useState([])
  const { getPublicGroupList } = useGroupList()
  const { chainId } = useWallet()
  const timer = useRef()
  const { formatGroup } = useGroupList()
  const [timeOutEvent, setTimeOutEvent] = useState()
  const [longClick, setLongClick] = useState(0)
  const [startX, setStartX] = useState()
  const [startY, setStartY] = useState()
  const [currentIndex, setCurrentIndex] = useState()
  const [currentX, setCurrentX] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const [copied, setCopied] = useState(false)
  const [deletePath, setDeletePath] = useState()
  const [copyText, setCopyText] = useState(intl.get('Copy'))
  const [hasTransition, setHasTransition] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const history = useHistory()
  const getCurrentGroupInfo = async (currentAddress) => {
    if (!currentAddress) return
    const tokensQuery = `
      query{
        groupInfo(id: "`+ currentAddress?.toLowerCase() + `"){
          id,
          description,
          name,
          avatar,
          userCount,
          chatCount,
          style,
          _type,
        }
      }
    `
    const res = await clientInfo?.query(tokensQuery).toPromise()
    return res?.data?.groupInfo
  }
  const getCurrentGroup = async () => {
    if (!currentAddress?.toLowerCase() || getLocal('isConnect')) return
    let fetchData = await getCurrentGroupInfo(currentAddress)
    if (fetchData) {
      const { chatCount, id, name, _type } = fetchData
      const index = groupList?.findIndex(item => item.id == currentAddress?.toLowerCase())
      if (index === -1) {
        groupList.push({
          newChatCount: 0,
          chatCount: chatCount,
          id: id,
          name: name,
          _type: _type
        })
        // console.log('setGroupList===>1', groupList)
        setGroupList(groupList)
        setState({
          groupLists: groupList
        })
      }
    }

  }
  const getCachePublicGroup = async () => {
    const currNetwork = currentNetworkInfo?.name || getLocal('network');
    let cachePrivateGroup = [];
    await localForage.getItem('chatListInfo').then(res => {
      if (currNetwork && getLocal('isConnect')) {
        const account = res && res[currNetwork] ? res[currNetwork][getLocal('account')] : null
        const publicRooms = account ? account['publicRooms'] : []
        cachePrivateGroup = [...publicRooms]
      }
    });
    return cachePrivateGroup
  }

  const compareGroup = async(currentGroupList, cacheGroupList) => {
    const result = currentGroupList.map(group => {
      const cachedGroup = cacheGroupList.find(cached => cached.id === group.id)
      if (cachedGroup) {
        const newChatCount = parseInt(group.chatCount) - parseInt(cachedGroup.chatCount)
        const chatCount = cachedGroup ? cachedGroup.chatCount : group.chatCount
        return {...group, newChatCount, hasDelete: cachedGroup.hasDelete, chatCount}
      } else {
        return group
      }
    }).concat(cacheGroupList.filter(group => !currentGroupList.find(current => current.id === group.id)))
    setGroupList(result)
    return result
  }
 
  
  const updateChatCount = async () => {
    const currentGroupList = [...groupLists]
    const cacheGroupList = await getCachePublicGroup()
    if(!cacheGroupList.length || !currentGroupList.length) return
    await compareGroup(currentGroupList, cacheGroupList)
  }
  const setCacheGroupInfo = (groupInfos, type) => {
    const currNetwork = getLocal('network')
    if (!currNetwork) return
    localForage.getItem('chatListInfo').then(async(res) => {
      const account = res && res[currNetwork] ? res[currNetwork][getLocal('account')] : null
      let chatListInfo = res ? res : {}
      if (!account && currNetwork) {
        const list = Object.keys(chatListInfo)
        chatListInfo[currNetwork] = chatListInfo[currNetwork] && list.length ? chatListInfo[currNetwork] : {}
        chatListInfo[currNetwork][getLocal('account')] = {
          ['publicRooms']: [],
          ['privateRooms']: []
        }
      }
      if (type === 1) {
        const cachePublicGroup = chatListInfo[currNetwork][getLocal('account')]['publicRooms']
        const result = await compareGroup(groupInfos, cachePublicGroup, 0)
        const index = result.findIndex((item) => item.id === currentAddress?.toLowerCase())
        if (index >= 0) {
          result[index].newChatCount = 0
        }
        chatListInfo[currNetwork][getLocal('account')]['publicRooms'] = [...result]
        localForage.setItem('chatListInfo', chatListInfo)
      } else {
        chatListInfo[currNetwork][getLocal('account')]['privateRooms'] = [...groupInfos]
        localForage.setItem('chatListInfo', chatListInfo)
      }
    }).catch(error => {
      console.log(error, '=====error')
    })
  }
  const getGroupList = async () => {
    const address = getLocal('account')
    if (!address) {
      hiddenMask()
      return
    }
    const tokensQuery = `
    query{
      groupUser(id: "`+ address.toLowerCase() + `"){
        id,
        groupInfos{
          id,
          name,
          chatCount,
          _type
        }
      }
    }
    `
    const res = await clientInfo?.query(tokensQuery).toPromise()
    var groupInfos = res?.data?.groupUser?.groupInfos || []
    let fetchData = await getCurrentGroupInfo(currentAddress)
    if (currentAddress) {
      const index = groupInfos?.findIndex((item) => item.id === currentAddress)
      if (index === -1 && !hasQuitRoom) {
        groupInfos.push({
          id: currentAddress,
          name: fetchData?.name,
          chatCount: fetchData?.chatCount,
          _type: fetchData?._type
        })
      }
    }
    hiddenMask()
    groupInfos?.forEach((group) => {
      group.hasDelete = false
    })
    setCacheGroupInfo(groupInfos, 1)
    // console.log('setGroupList=====2', groupInfos)
    setGroupList([...groupInfos] || [])
    return groupInfos
  }
  const handleTouchStart = (e) => {
    e.stopPropagation();
    setTimeOutEvent(setTimeout(() => {
      setLongClick(1)
    }, 500))
    setStartX(e.touches[0].pageX)
    setStartY(e.touches[0].pageY)
  }
  const handleTouchMove = (e, index) => {
    clearTimeout(timeOutEvent)
    setLongClick(0)
    e.preventDefault();
    setCurrentX(e.touches[0].pageX)
    setMoveX(currentX - startX)
    setMoveY(e.touches[0].pageY - startY)

    if (Math.abs(moveY) > Math.abs(moveX)) {
      return
    }
    if (Math.abs(moveX) < 10) {
      return
    }
    else {
      setHasTransition(true)
    }
    setCurrentIndex(index)
  }
  const handleTouchEnd = e => {
    clearTimeout(timeOutEvent)
    setLongClick(0)
    if (timeOutEvent !== 0 && longClick === 0) {
      console.log('click====')
    }
    setHasTransition(true)
    return false
  }
  const confirmDelete = () => {
    const currentGroups = groupList.map(item => {
      if (item.id.toLowerCase() === deletePath.toLowerCase()) {
        item.hasDelete = true
      }
      return item
    })
    setGroupList(currentGroups)
    setCacheGroup(currentGroups)
    setMoveX(0)
    setMoveY(0)
    history.push('/chat')
    setShowDeleteConfirm(false)
  }
  const setCacheGroup = (currentGroups) => {
    const currNetwork = currentNetworkInfo?.name || getLocal('network')
    localForage.getItem('chatListInfo').then(res => {
      let chatListInfo = res ? res : {}
      chatListInfo[currNetwork][getLocal('account')]['publicRooms'] = [...currentGroups]
      // console.log('chatListInfo====1')
      localForage.setItem('chatListInfo', chatListInfo)
    })
  }
  const deleteChatRoom = (e, path) => {
    e.stopPropagation()
    setDeletePath(path)
    setShowDeleteConfirm(true)
  }
  const onCopy = (e) => {
    setCopyText(intl.get('Copied'))
    e.stopPropagation()
    setCopied(true)
    setTimeout(() => {
      setCopyText(intl.get('Copy'))
      setCopied(false)
    }, 1000)
  }
  const showCurrentChatList = (e, item, index) => {
    showChatList(item)
  }
  const initPrivateMember = () => {
    const data = history.location?.state
    var list = []
    if (data) {
      const { address, name, avatar } = history.location?.state
      list = {
        id: address,
        name: name,
        avatar: avatar
      }
    }
    return list
  }
  const getPrivateGroupList = async () => {
    showMask()
    var list = initPrivateMember()
    const senderQuery = `
      query{
        encryptedInfos(where:{sender: "`+ getLocal('account')?.toLowerCase() + `"}){
          to
        }
      }
    `
    const tokensQuery = `
      query{
        encryptedInfos(where:{to: "`+ getLocal('account')?.toLowerCase() + `"}){
          sender
        }
      }
    `
    const list1 = await clientInfo?.query(senderQuery).toPromise()
    const list2 = await clientInfo?.query(tokensQuery).toPromise()
    const groupList = []
    list1?.data?.encryptedInfos.map(item => {
      if (!groupList.includes(item.to)) {
        groupList.push(item.to)
      }
    })
    list2?.data?.encryptedInfos.map(item => {
      if (!groupList.includes(item.sender)) {
        groupList.push(item.sender)
      }
    })
    const idList = groupList.filter(Boolean)
    const idsList = '"' + idList.join('","') + '"'
    const groupListQuery = `
    query{
      profiles(where:{id_in: [`+ idsList + `]}){
        id,
        name,
        avatar
      }
    }`
    const res = await clientInfo.query(groupListQuery).toPromise()
    const privateGroupList = [...res?.data?.profiles] || []
    if (list.id) {
      const index = privateGroupList?.findIndex((item) => item.id === list.id)
      if (index === -1) {
        privateGroupList.push(list)
      }
    }
    // console.log('setGroupList===>5', privateGroupList)
    setGroupList(privateGroupList)
    setCacheGroupInfo(privateGroupList, 2)
    setState({
      groupLists: privateGroupList
    })
    hiddenMask()
    return privateGroupList
  }

  const startInterval = () => {
    timer.current = setInterval(() => {
      getPublicGroupList()
    }, 20000)
  }
  const processingGroup = async () => {
    const currNetwork = currentNetworkInfo?.name || getLocal('network')
    let publicGroup = []
    let privateGroup = []
    if (currentTabIndex === 0) {
      publicGroup = await getGroupList()
    } else {
      privateGroup = await getPrivateGroupList()
    }
    localForage.getItem('chatListInfo').then(res => {
      const account = res && res[currNetwork] ? res[currNetwork][getLocal('account')] : null
      const cachePublicGroup = account ? account['publicRooms'] : []
      const cachePrivateGroup = account ? account['privateRooms'] : []
      if (currentTabIndex === 0) {
        const result = formatGroup(publicGroup, cachePublicGroup)
        // console.log(result, publicGroup, 'setGroupList===>6')
        setGroupList(result)
        setState({
          isGetGroupList: true,
          groupLists: result
        })
      }
      if (currentTabIndex === 1) {
        if (!cachePrivateGroup?.length) {
          getPrivateGroupList()
        } else {
          const list = initPrivateMember()
          const groupList = [...cachePrivateGroup]
          const index = groupList?.findIndex((item) => item?.id?.toLowerCase() === list?.id?.toLowerCase())
          if (Object.keys(list).length !== 0 && index === -1) {
            groupList.push(list)
          }
          res[currNetwork][getLocal('account')]['privateRooms'] = [...groupList]
          // console.log('chatListInfo====2')
          localForage.setItem('chatListInfo', res)
          const currentChatInfo = groupList.filter((item) => item?.id?.toLowerCase() === currentAddress?.toLowerCase())
          // console.log('setGroupList===>7', groupList)
          setGroupList(groupList)
          setState({
            isGetGroupList: true,
            groupLists: groupList,
            currentChatInfo: currentChatInfo[0]
          })
        }
      }
    }).catch(error => {
      console.log(error, 'error===')
    })
  }
  useEffect(() => {
    if (accounts && chainId) {
      processingGroup()
    }
  }, [accounts, chainId, currentTabIndex, hasCreateRoom, transactionRoomHash])
  useEffect(() => {
    const group = searchGroup.slice()
    // console.log(group, 'setGroupList====88')
    setGroupList(group)
  }, [searchGroup])
  useEffect(() => {
    getCurrentGroup()
  }, [currentAddress])
  useEffect(() => {
    setGroupList([...newGroupList])
  }, [newGroupList])
  useEffect(() => {
    startInterval()
    return() => {
      clearInterval(timer.current)
    }
  }, [])
  useEffect(() => {
    updateChatCount()
  },[groupLists])
  return (
    <ListGroupContainer>
      <Modal title="Confirm" visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className='dialog-title mb-3'>Do you want to delete this group?</div>
        <div className='btn-wrapper'>
          <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={() => confirmDelete()}>
            Confirm
          </button>
        </div>
      </Modal>
      {
        (groupList?.length === 0) && Boolean(Number(localStorage.getItem('isConnect'))) &&
        <EmptyInfo onClickDialog={onClickDialog}></EmptyInfo>
      }
      <div className={`list-group ${detectMobile() ? 'list-group-client' : ''}`}>
        {
          groupList && groupList.map((item, index) => {
            const distance = moveX >= 0 ? 0 : - 140
            let moveStyle = {}
            if (hasTransition && currentIndex === index) {
              moveStyle.transform = `translateX(${distance}PX)`
              moveStyle.webkitTransform = `translateX(${distance}PX)`
              moveStyle.transition = 'transform 0.3s ease'
              moveStyle.WebkitTransition = 'transform 0.3s ease'
            }
            return (
              <Fragment key={item.id}>
                {
                  !item.hasDelete &&
                  <div
                    className={`chat-list ${item?.id?.toLowerCase() === currentAddress?.toLowerCase() ? 'active' : ''}`}
                    onClick={(e) => { showCurrentChatList(e, item, index) }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => handleTouchMove(e, index)}
                    onTouchEnd={handleTouchEnd}
                    style={moveStyle}
                    key={item.id}
                  >

                    <div className='user-image rounded-circle me-2'>
                      {
                        item && item.id && !item?.avatar &&
                        <Jazzicon address={item.id} className="chat-image" />
                      }
                      {
                        item?.avatar &&
                        <Image src={item.avatar} size={35} />
                      }
                    </div>
                    <div className='full-address'>{item.roomName}</div>
                    <div className='text-left'>
                      <div className='user-address fw-medium fs-6'>{item.name}</div>
                      <div className='user-status fs-80x'>{formatAddress(item.id, 6, 6)}</div>
                    </div>
                    {
                      !detectMobile() &&
                      <div className={`delete-btn-wrapper ${!detectMobile() ? 'delete-btn-web' : ''}`}>
                        <div className='iconfont icon-shanchu' onClick={(e) => { deleteChatRoom(e, item.id) }}></div>
                        {
                          !copied &&
                          <CopyToClipboard text={`${item.id}`}>
                            <div className='iconfont icon-fuzhiwenjian' onClick={onCopy}></div>
                          </CopyToClipboard>
                        }
                        {
                          copied && <div className="copied-text">{intl.get('Copied')}</div>
                        }

                      </div>
                    }
                    {
                      detectMobile() &&
                      <div className='operate-btn'>
                        <CopyToClipboard text={`${item.id}`}>
                          <div className='copy-btn' onClick={(e) => { onCopy(e) }}>{copyText}</div>
                        </CopyToClipboard>
                        <div onClick={(e) => { deleteChatRoom(e, item.id) }}>
                          <div className='del-btn'>delete</div>
                        </div>
                        {/* {
                          copied && <div className='message-tips message-tips-success'>{item.id}</div>
                        } */}
                      </div>

                    }
                    {
                      item.newChatCount > 0 && item.id !== currentAddress &&
                      <div className={`unread-num ${!detectMobile() ? 'unread-num-web' : 'unread-num-client'}`}>{item.newChatCount}</div>
                    }

                  </div>
                }
              </Fragment>
            )
          })
        }
      </div>
    </ListGroupContainer>
  )
}
const ListGroupContainer = styled.div`
  color: #000;
  overflow-y: auto;
  background-color: #fff;
  overflow-x: hidden;
  .copied-text {
    font-size: 12px;
  }
.chat-list {
  .operate-btn{
    // width: 120px;
    height: 100%;
    
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    display: flex;
    align-self: center;
    // justify-content: space-between;
    text-align: center;
    border-radius: 0;
    // padding: 0 15px;
    .del-btn, .copy-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      width: 70px;
      text-align: center;
      justify-content: center;
      height: 100%;
      
    }
    .del-btn {
      background: #ff4d4f;;
    }
    .copy-btn {
      background-color: rgba(128, 128, 128, 0.7);;
    }
    // .message-tips {
    //   left: -270px;
    //   bottom: 20px;
    // }
  }
  .delete-btn-wrapper{
    position: absolute;
    right: 155px;
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    color: #000;
    display: none;
    &.delete-btn-web {
      top: 18px;
    }
    .iconfont {
      margin: 0 2px;
    }
  }
  &:hover{
    .delete-btn-wrapper {
      display: flex;
      flex: 1;
      position: absolute;
      right: 155px;
      justify-content: space-around;
      // padding-left: 30px;
      
    }
  }
  .unread-num {
    position: absolute;
    right: 160px;
    bottom: 10px;
    font-size: 14px;
    border-radius: 16px;
    background: rgba(108,117,125,0.6);
    height: 20px;
    color: red;
    padding: 2px 10px;
    display: flex;
    align-items: center;
    &-client {
      bottom: 25px;
    }
  }
}
.dialog-title {
  margin: 10px 0 20px;
}
.list-group {
  &-client {
    margin-bottom: 60px;
  }
  .full-address {
    visibility: hidden;
    width: 0;
  }
}
`
