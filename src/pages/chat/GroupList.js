import { detectMobile, getLocal, formatAddress, setCacheGroup } from "../../utils"
import { useEffect, useState, Fragment } from "react"
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
const PAGE_PATH = window.location.pathname.split('/')[2]
export default function GroupList(props) {
  const { hasCreateRoom, setState, hasQuitRoom, accounts, clientInfo, transactionRoomHash } = useGlobal()
  const { showChatList, showMask, hiddenMask, onClickDialog, newGroupList, currentTabIndex, currentAddress, searchGroup, searchGrouName } = props
  const [groupList, setGroupList] = useState([])
  const { chainId } = useWallet()
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
  const STATE = history.location?.state
  const ACCOUNT = accounts || getLocal('account') 
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

  const compareGroup = async(currentGroupList, cacheGroupList) => {
    let chatCountChanged = false
    const result = currentGroupList?.map(group => {
      const cachedGroup = cacheGroupList.find(cached => cached.id === group.id)
      if (cachedGroup) {
        const newChatCount = parseInt(group.chatCount) - parseInt(cachedGroup.chatCount)
        if(+group.chatCount === +cachedGroup.chatCount) {
          chatCountChanged = false
        } else {
          chatCountChanged = true
        }
        const chatCount = cachedGroup.chatCount
        return {...group, newChatCount, hasDelete: cachedGroup.hasDelete, chatCount}
      } else {
        chatCountChanged = false
        return group
      }
    }).concat(cacheGroupList.filter(group => !currentGroupList.find(current => current.id === group.id)))
    if(currentTabIndex === 0 && !searchGrouName) {
      // console.log(!searchGrouName,'setGroupList====3', result)
      setGroupList(result)
    }
    return { result, chatCountChanged }
  }
 
  const comparePrivateGroup = async(currentPrivateGroupList, cachePrivateGroupList) => {
    const result = currentPrivateGroupList.map(group => {
      const cachedGroup = cachePrivateGroupList.find(cached => cached.id === group.id)
      if (cachedGroup) {
        const cachedGroup = cachePrivateGroupList.find(cached => cached.id === group.id)
        const hasDelete = cachedGroup ? cachedGroup.hasDelete : group.hasDelete
        return {...group, hasDelete}
      } else {
        return group
      }
    }).concat(cachePrivateGroupList.filter(group => !currentPrivateGroupList.find(current => current.id === group.id)))
    if(currentTabIndex === 1) {
      // console.log('setGroupList====4', result)
      setGroupList(result)
    }
    return result
  }
  const setCacheGroupInfo = (groupInfos, type) => {
    const currNetwork = getLocal('network')
    if (!currNetwork) return
    localForage.getItem('chatListInfo').then(async(res) => {
      const account = res && res[currNetwork] ? res[currNetwork][ACCOUNT] : null
      let chatListInfo = res ? res : {}
      if (!account && currNetwork) {
        if (!chatListInfo[currNetwork]) {
          chatListInfo[currNetwork] = {}
        }
        if(!(ACCOUNT in chatListInfo)) {
          chatListInfo[currNetwork][ACCOUNT] = {
            publicRooms: [],
            privateRooms: []
          }
        }
        if (type === 1) {
          const cachePublicGroup = chatListInfo[currNetwork][ACCOUNT]['publicRooms']
          const groupList = await compareGroup(groupInfos, cachePublicGroup)
          const { result } = groupList
          const index = result.findIndex((item) => item.id === currentAddress?.toLowerCase())
          if (index >= 0) {
            result[index].newChatCount = 0
          }
          chatListInfo[currNetwork][ACCOUNT]['publicRooms'] = [...result]
          localForage.setItem('chatListInfo', chatListInfo)
        } else {
          const cachePublicGroup = chatListInfo[currNetwork][ACCOUNT]['privateRooms']
          const result = await comparePrivateGroup(groupInfos, cachePublicGroup)
          chatListInfo[currNetwork][ACCOUNT]['privateRooms'] = [...result]
          localForage.setItem('chatListInfo', chatListInfo)
        }
      }
    }).catch(error => {
      console.log(error, '=====error')
    })
  }
  const getGroupList = async () => {
    const account = ACCOUNT
    if (!account) {
      hiddenMask()
      return
    }
    const tokensQuery = `
    query{
      groupUser(id: "`+ account.toLowerCase() + `"){
        id,
        groupInfos{
          userCount,
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
    const address = currentAddress || PAGE_PATH
    if (address) {
      const index = groupInfos?.findIndex((item) => item.id === address.toLowerCase())
      if (index === -1 && !hasQuitRoom) {
        let fetchData = await getCurrentGroupInfo(address)
        groupInfos.push({
          id: address,
          userCount: fetchData?.userCount,
          name: fetchData?.name,
          chatCount: fetchData?.chatCount,
          _type: fetchData?._type,
          hasDelete: false,
          newChatCount: 0
        })
        setGroupList([...groupInfos])
        setState({
          groupLists: [...groupInfos]
        })
        let res = await localForage.getItem('chatListInfo')
        let chatListInfo = res ? res : {}
        const list = Object.keys(chatListInfo)
        const currentNetwork = getLocal('network')
        chatListInfo[currentNetwork] = list.length ? chatListInfo[currentNetwork] : {}
        chatListInfo[currentNetwork][ACCOUNT] = chatListInfo[currentNetwork][ACCOUNT] ? chatListInfo[currentNetwork][ACCOUNT] : {}
        chatListInfo[currentNetwork][ACCOUNT]['publicRooms'] = [...groupInfos]
        localForage.setItem('chatListInfo', chatListInfo)
      }
    }
    hiddenMask()
    groupInfos?.forEach((group) => {
      group.hasDelete = false
    })
    setCacheGroupInfo(groupInfos, 1)
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
    setCacheGroup(currentGroups, currentTabIndex)
    setMoveX(0)
    setMoveY(0)
    history.push('/chat')
    setShowDeleteConfirm(false)
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
    var list = []
    if (STATE) {
      const { address, name, avatar } = STATE
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
    list1?.data?.encryptedInfos.forEach(item => {
      groupList.push(item.to)
    })
    list2?.data?.encryptedInfos.forEach(item => {
      groupList.push(item.sender)
    })
    const result = Array.from(new Set(groupList))
    const idsList = '"' + result.join('","') + '"'
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
    const userId = list.id
    if (userId) {
      const index = privateGroupList?.findIndex((item) => item.id === userId?.toLowerCase())
      if (index === -1) {
        privateGroupList.push(list)
      }
    }
    
    setGroupList(privateGroupList)
    privateGroupList?.forEach((group) => {
      group.hasDelete = false
    })
    setCacheGroupInfo(privateGroupList, 2)
    // console.log(privateGroupList, 'groupInfos====3')
    setState({
      groupLists: privateGroupList
    })
    hiddenMask()
    return privateGroupList
  }

  const processingGroup = async () => {
    if (currentTabIndex === 0) {
      await getGroupList()
    } else {
      await getPrivateGroupList()
    }
  }
  useEffect(() => {
    if (accounts && chainId) {
      processingGroup()
    }
  }, [accounts, chainId, currentTabIndex, hasCreateRoom, transactionRoomHash])
  useEffect(() => {
    const group = searchGroup.slice()
    // console.log('setGroupList====2', group)
    setGroupList(group)
  }, [searchGroup, searchGrouName])
  useEffect(() => {
    // console.log('setGroupList====1', newGroupList)
    setGroupList([...newGroupList])
  }, [newGroupList])
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
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    display: flex;
    align-self: center;
    text-align: center;
    border-radius: 0;
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
