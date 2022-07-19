import { detectMobile, getLocal, formatAddress, setLocal } from "../../utils"
import useChain from "../../hooks/useChain"
import { createClient } from 'urql'
import { useEffect, useState } from "react"
import Modal from '../../component/Modal'
import { useHistory } from "react-router-dom"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from "styled-components"
import { Jazzicon } from '@ukstv/jazzicon-react'
import EmptyInfo from './EmptyInfo'
import localForage from "localforage"
import useGlobal from "../../hooks/useGlobal"
import Image from "../../component/Image"
export default function GroupList(props) {
  const { hasCreateRoom, setState, currentNetwork, hasQuitRoom } = useGlobal()
  const { showChatList, showMask, hiddenMask, onClickDialog, chainId, newGroupList, hasAccess, currentTabIndex, currentRoomName, currentAddress, hasChatCount, currNetwork, hasRead, privateChatMember} = props
  const [groupList, setGroupList] = useState([])
  const [timeOutEvent, setTimeOutEvent] = useState()
  const [longClick, setLongClick] = useState(0)
  const [canCopy, setCanCopy] = useState(false)
  const [startX, setStartX] = useState()
  const [startY, setStartY] = useState()
  const [currentIndex, setCurrentIndex] = useState()
  const [currentRoomIndex, setCurrentRoomIndex] = useState()
  const [currentX, setCurrentX] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const [copied, setCopied] = useState(false)
  const [hasTransition, setHasTransition] = useState(false)
  const [moveStyle, setMoveStyle] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const history = useHistory()
  const path = history.location.pathname

  const updateChatCount = async() => {
    if(!currentAddress?.toLowerCase()) return
    // debugger
    const tokensQuery = `
      query{
        groupInfo(id: "`+ currentAddress?.toLowerCase() + `"){
          id,
          description,
          name,
          avatar,
          userCount,
          chatCount,
          style
        }
      }
    `
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    let fetchData = res?.data?.groupInfo
    console.log(fetchData, currNetwork, '=====>>>>updateChatCount')
    localForage.getItem('chatListInfo').then(res => {
      if(currNetwork) {
        const account = res ? res[currNetwork][getLocal('account')] : null
        const publicRooms = account ? account['publicRooms'] : []
        const privateRooms = account ? account['privateRooms'] : []
        const groupList = currentTabIndex === 0 ? publicRooms : privateRooms
        console.log(currNetwork,newGroupList,'currNetwork===<<<')
        const index = groupList?.findIndex(item => item.id == currentAddress?.toLowerCase())
        if(index > -1) {
          groupList[index]['chatCount'] = +fetchData?.chatCount || 0
          groupList[index]['newChatCount'] = 0
        }
        console.log(groupList, '===chatListInfo==')
        const roomType = currentTabIndex === 0 ? 'publicRooms' : 'privateRooms'
        account[roomType] = [...groupList]
        localForage.setItem('chatListInfo', res)
        setGroupList(groupList)
        setState({
          groupLists: groupList
        })
        console.log(account, res, '===>>1')
      }
    })
    
  }
  const getGroupList = async () => {
    // showMask()
    const address = getLocal('account')
    if(!address) {
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
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    var groupInfos = res.data?.groupUser?.groupInfos || []
    const roomAddress = path.split('/chat/')[1]?.toLowerCase()
    if(roomAddress) {
      const index = groupInfos?.findIndex((item) => item.id === roomAddress)
      if(index === -1 && !hasQuitRoom) {
        groupInfos.push({
          id: roomAddress,
          name: currentRoomName
        })
      }
    }
    setState({
      groupLists: [...groupInfos],
      hasGetGroupLists: true
    })
    console.log(res.data?.groupUser?.groupInfos, 'groupInfos====')
    setGroupList(groupInfos || [])
    setChatListInfo(groupInfos, 1)
    getCurrentRoomIndex(groupInfos)
    hiddenMask()
  }
  const handleTouchStart = (e) => {
    e.stopPropagation();
    setTimeOutEvent(setTimeout(() => {
      setLongClick(1)
      setCanCopy(true)
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
  const confirmDelete = (path) => {
    setShowDeleteConfirm(false)
    handleDeleteChatRoom(path)
  }
  const deleteChatRoom = (e, path) => {
    e.stopPropagation()
    if (!detectMobile()) {
      debugger
      setShowDeleteConfirm(true)
    } else {
      this.handleTouchEnd(e)
      handleDeleteChatRoom(path)
    }
  }
  const handleDeleteChatRoom = (path) => {
    console.log(path)
  }
  const onCopy = (e) => {
    e.stopPropagation()
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }
  const showCurrentChatList = (e, item, index) => {
    setCurrentRoomIndex(index)
    showChatList(e, item, groupList)
  }
  const getCurrentRoomIndex = (groupInfos) => {
    const roomAddress = path.split('/chat/')[1]?.toLowerCase()
    const index =  groupInfos && groupInfos.findIndex((item) => item.id.toLowerCase() == roomAddress)
    setCurrentRoomIndex(index)
  }
  const initPrivateMember = () => {
    const data = history.location?.state
    var list = []
    if(data) {
      const {address, name, avatar} = history.location?.state
      list = {
        id: address,
        name: name,
        avatar: avatar
      }
    }
    return list
  }
  const getPrivateGroupList = async() => {
    console.log(history.location?.state, 'history.location?.state====')
    showMask()
    var list = initPrivateMember()
    const senderQuery = `
      query{
        encryptedInfos(where:{sender: "`+ getLocal('account')?.toLowerCase() +`"}){
          to
        }
      }
    `
    const tokensQuery = `
      query{
        encryptedInfos(where:{to: "`+ getLocal('account')?.toLowerCase() +`"}){
          sender
        }
      }
    `
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const list1 = await client.query(senderQuery).toPromise()
    const list2 = await client.query(tokensQuery).toPromise()
    const groupList = []
    list1?.data?.encryptedInfos.map(item => {
      if(!groupList.includes(item.to)) {
        groupList.push(item.to)
      }
    })
    list2?.data?.encryptedInfos.map(item => {
      if(!groupList.includes(item.sender)) {
        groupList.push(item.sender)
      }
    })
    console.log(groupList, 'groupList====')
    const idList = groupList.filter(Boolean)
    const idsList = '"' + idList.join('","')+ '"'
    console.log(idList, list1?.data?.encryptedInfos, list2?.data?.encryptedInfos, 'getPrivateGroupList====')
    const groupListQuery = `
    query{
      profiles(where:{id_in: [`+idsList+`]}){
        id,
        name,
        avatar
      }
    }`
    const res = await client.query(groupListQuery).toPromise()
    const privateGroupList = [...res?.data?.profiles] || []
    if(list.id) {
      const index = privateGroupList?.findIndex((item) => item.id === list.id)
      if(index === -1) {
        privateGroupList.push(list)
      }
    }
    console.log(res, privateGroupList, 'groupListQuery=====')
    setGroupList(privateGroupList)
    setChatListInfo(privateGroupList, 2)
    setState({
      groupLists: privateGroupList
    })
    hiddenMask()
  }
  const setChatListInfo = (groupInfos, type) => {
    const currNetwork = getLocal('currentNetwork')
    localForage.getItem('chatListInfo').then(res => {
      const account = res ? res[currNetwork][getLocal('account')] : null
      const publicRooms = account ? account['publicRooms'] : []
      const privateRooms = account ? account['privateRooms'] : []
      let chatListInfo = res ? res : {}
      if(!account && currNetwork) {
        const list = Object.keys(chatListInfo)
        chatListInfo[currNetwork] = list.length ? chatListInfo[currNetwork] : {}
        chatListInfo[currNetwork][getLocal('account')] = {
          ['publicRooms']: [],
          ['privateRooms']: []
        }
      }
      if(type === 1) {
        chatListInfo[currNetwork][getLocal('account')]['publicRooms'] = [...groupInfos]
        localForage.setItem('chatListInfo', chatListInfo)
      } else {
        chatListInfo[currNetwork][getLocal('account')]['privateRooms'] = [...groupInfos]
        localForage.setItem('chatListInfo', chatListInfo)
      }
    }).catch(error => {
      console.log(error, '=====error')
    })
  }
  useEffect(() => {
    updateChatCount()
  }, [newGroupList, hasChatCount])
  useEffect(() => {
    console.log(currentNetwork?.name, getLocal('currentNetwork'),'00000===>>>')
    if(getLocal('isConnect') && getLocal('currentNetwork')) {
      const currNetwork = currentNetwork?.name || getLocal('currentNetwork')
      localForage.getItem('chatListInfo').then(res => {
        console.log(res, 'res===>>')
        const account = res ? res[currNetwork][getLocal('account')] : null
        const publicRooms = account ? account['publicRooms'] : []
        const privateRooms = account ? account['privateRooms'] : []
        // debugger
        if(currentTabIndex === 0) {
          if(!publicRooms?.length || hasCreateRoom || hasQuitRoom) {
            getGroupList()
          } else {
            console.log(publicRooms, newGroupList, currentAddress, 'publicRooms====1111')
            const groupList = [...publicRooms]
            setGroupList(groupList)
            setState({
              groupLists: groupList
            })
          }
        }
        if(currentTabIndex === 1) {
          if(!privateRooms?.length) {
            getPrivateGroupList()
          } else {
            const list = initPrivateMember()
            const groupList = [...privateRooms]
            if(Object.keys(list).length !== 0) {
              groupList.push(list)
            }
            res[currNetwork][getLocal('account')]['privateRooms'] = [...groupList]
            localForage.setItem('chatListInfo', res)
            setGroupList(groupList)
            setState({
              groupLists: groupList
            })
          }
        }
      }).catch(error => {
        console.log(error, 'error===')
      })
    }
    console.log(hasCreateRoom, chainId, currentTabIndex, hasAccess, newGroupList, hasChatCount, '777====')
  }, [getLocal('account'), hasCreateRoom, chainId, currentTabIndex, hasAccess, newGroupList, hasChatCount, hasQuitRoom])
  return (
    <ListGroupContainer>
      {
        (groupList?.length === 0) &&
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
              <div
                className={`chat-list ${currentRoomIndex === index ? 'active' : ''}`}
                onClick={(e) => { showCurrentChatList(e, item, index) }}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
                style={moveStyle}
                key={item.id}
              >

                <Modal title="Confirm" visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                  <div className='dialog-title'>Do you want to delete this chat room?</div>
                  <div className='btn-wrapper'>
                    <button type="button" className="btn btn-lg btn-primary w-100 mb-3" onClick={() => confirmDelete(item.id)}>
                      Confirm
                    </button>
                  </div>
                </Modal>
                <div className='user-image rounded-circle me-2'>
                  {
                    item && item.id && !item?.avatar &&
                    <Jazzicon address={item.id} className="chat-image" />
                  }
                  {
                    item?.avatar &&
                    <Image src={item.avatar} size={35}/>
                  }
                </div>
                <div className='full-address'>{item.roomName}</div>
                <div className='text-left'>
                  <div className='user-address fw-medium fs-6'>{item.name}</div>
                  <div className='user-status fs-80x'>{formatAddress(item.id)}</div>
                </div>
                {
                  !detectMobile() &&
                  <div className={`delete-btn-wrapper ${!detectMobile() ? 'delete-btn-web' : ''}`}>
                    <div className='iconfont icon-shanchu' onClick={(e) => { deleteChatRoom(e, item.id) }}></div>
                    <CopyToClipboard text={item.id}>
                      <div className='iconfont icon-fuzhiwenjian' onClick={onCopy}></div>
                    </CopyToClipboard>
                    {
                      copied && <div className='message-tips message-tips-success'>{item.id}</div>
                    }

                  </div>
                }
                {
                  detectMobile() &&
                  <div className='operate-btn'>
                    <CopyToClipboard text={item.id}>
                      <div className='copy-btn' onClick={(e) => { onCopy(e) }}>copy</div>
                    </CopyToClipboard>
                    <div onClick={(e) => { deleteChatRoom(e, item.id) }}>
                      <div className='del-btn'>delete</div>
                    </div>
                    {
                      copied && <div className='message-tips message-tips-success'>{item.id}</div>
                    }
                  </div>

                }
                {
                item.newChatCount > 0 && item.id !== currentAddress &&
                <div className={`unread-num ${!detectMobile() ? 'unread-num-web' : 'unread-num-client'}`}>{item.newChatCount}</div>
              }

              </div>
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
    .message-tips {
      left: -270px;
      bottom: 20px;
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
