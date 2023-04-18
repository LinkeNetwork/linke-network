import React, { useEffect, useState, useRef } from 'react'
import './chat.scss'
import intl from "react-intl-universal"
import 'emoji-mart/css/emoji-mart.css'
import BigNumber from 'bignumber.js'
import Loading from '../../component/Loading'
import ListGroup from './GroupList'
import { createClient } from 'urql'
import ChatInputBox from './ChatInputBox'
import Introduction from './Introduction'
import ChatTab from './ChatTab'
import { tokenListInfo } from '../../constant/tokenList'
import ShareInfo from './ShareInfo'
import RedEnvelopeCover from './RedEnvelopeCover'
import CreateNewRoom from './CreateNewRoom'
import JoinRooom from './JoinRoom'
import useGroupMember from '../../hooks/useGroupMember'
import useDataBase from '../../hooks/useDataBase'
import ShareGroupCode from './ShareGroupCode'
import AwardBonus from './AwardBonus'
import ReceiveInfo from './ReceiveInfo'
import { ethers } from "ethers"
import useReceiveInfo from '../../hooks/useReceiveInfo'
import { detectMobile, throttle, uniqueChatList,  getBalance,getBalanceNumber, setLocal, getLocal, getDaiWithSigner, getClient, getTimestamp, getCurrentNetworkInfo, getStackedAmount, setCacheGroup } from '../../utils'
import { PUBLIC_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI, REGISTER_ABI, SIGN_IN_ABI, RED_PACKET_V2} from '../../abi/index'
import localForage from "localforage"
import Modal from '../../component/Modal'
import SearchChat from './SearchChat'
import AddChatRoom from './AddChatRoom'
import RoomHeader from './RoomHeader'
import ChatContext from './ChatContext'
import GroupMember from './GroupMember'
import JoinGroupButton from './JoinGroupButton'
import { useHistory, useLocation } from 'react-router-dom'
import useGlobal from '../../hooks/useGlobal'
import SignIn from './SignIn'
import useWallet from '../../hooks/useWallet'
import useProfile from '../../hooks/useProfile'
import useGroupList from '../../hooks/useGroupList'
const urlParams = new URLSearchParams(window.location.search)
const RED_PACKET_ID = urlParams.get('id')
const RED_PACKET_VERSION = urlParams.get('version')
const IS_SHARE = urlParams.get('share')
const PAGE_PATH = window.location.pathname.split('/chat/')[1]
const GROUP_ADDRESS = PAGE_PATH?.split('/')[0]
const NETWORK = PAGE_PATH?.split('/')[1] || getLocal('network')
let globalNftAddress = null
export default function Chat() {
  const { getCachePublicGroup, getPublicGroupList, compareGroup } = useGroupList()
  const { setDataBase } = useDataBase()
  const { getProfileStatus } = useProfile()
  const { getCurrentBalance } = useWallet()
  const [collectedRedEnvelope, setCollectedRedEnvelope] = useState([])
  const history = useHistory()
  const redEnvelopId = history.location.search.split('?id=')[1]
  const location = useLocation()
  const [searchGroup, setSearchGroup] = useState([])
  const ROOM_ADDRESS = location?.state?.address
  const CURRENT_NETWORK = location?.state?.network
  const { getReceiveInfo } = useReceiveInfo()
  const { getGroupMember } = useGroupMember()
  const [showNftList, setShowNftList] = useState(false)
  const [showHandlingFee, setShowHandlingFee] = useState(false)
  const [showGroupList, setShowGroupList] = useState(true)
  const skip = 0
  const [clickNumber, setClickNumber] = useState(0)
  const timer = useRef()
  const allTimer = useRef()
  const groupTimer = useRef()
  const messagesEnd = useRef(null)
  const [showOpenSignIn, setShowOpenSignIn] = useState(false)
  const [showEnvelopesList, setShowEnvelopesList] = useState(false)
  const [showTips, setShowTips] = useState()
  const {groupLists, setState, hasClickPlace, hasQuitRoom, networks, accounts, clientInfo, currentChatInfo, hasCreateRoom, chainId, signInAddress, giveAwayAddressV3, currentNetworkInfo, getNewMsg } = useGlobal()
  const [currentAddress, setCurrentAddress] = useState()
  const [currentRedEnvelopTransaction, setCurrentRedEnvelopTransaction] = useState()
  const currentAddressRef = useRef(null)
  const [showCanReceiveTips, setCanReceiveTips] = useState(false)
  const [currentRedEnvelopId, setCurrentRedEnvelopId] = useState()
  const [currentGiveAwayVersion, setCurrentGiveAwayVersion] = useState()
  const [memberCount, setMemberCount] = useState()
  const [myAddress, setMyAddress] = useState()
  const [searchGrouName, setSearchGrouName] = useState()
  const [showReceiveInfo, setShowReceiveInfo] = useState(false)
  const [showRedEnvelope, setShowRedEnvelope] = useState(false)
  const [currentRoomName, setCurrentRoomName] = useState()
  const [hasAccess, setHasAccess] = useState()
  const [chatList, setChatList] = useState([])
  const [hasOpenedSignIn, setHasOpenedSignIn] = useState(false)
  const [showOpenAward, setShowOpenAward] = useState(false)
  const [showJoinGroupButton, setShowJoinGroupButton] = useState()
  const [handlingFeeTips, setHandlingFeeTips] = useState()
  const chatListRef = useRef()
  const [hasScroll, setHasScroll] = useState(false)
  const hasScrollRef = useRef(null)
  const [hasNotice, setHasNotice] = useState(false)
  const [showMask, setShowMask] = useState(false)
  const [tipsText, setTipsText] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)
  const [showGroupMember, setShowGroupMember] = useState(false)
  const [currNetwork, setCurrNetwork] = useState()
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showAwardBonus, setShowAwardBonus] = useState(false)
  const [showCreateNewRoom, setShowCreateNewRoom] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showPlaceWrapper, setShowPlaceWrapper] = useState(false)
  const [shareTextInfo, setShareTextInfo] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showSettingList, setShowSettingList] = useState(false)
  const [roomList, setRoomList] = useState([])
  const roomListRef = useRef()
  const [currentRedPackeVersion, setCurrentRedPackeVersion] = useState()
  const [clearChatInput, setClearChatInput] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [roomAvatar, setRoomAvatar] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [myAvatar, setMyAvatar] = useState()
  const [nftImageList, setNftImageList] = useState([])
  const [hasDecrypted, setHasDecrypted] = useState(false)
  const [currentGroupType, setCurrentGroupType] = useState()
  const [showShareGroup, setShowShareGroup] = useState(false)
  const groupListRef = useRef()
  const [canSendText, setCanSendText] = useState()
  const [groupType, setGroupType] = useState()
  const currentGroupTypeRef = useRef()
  const hasAccessRef = useRef()
  const myAvatarRef = useRef()
  const showJoinGroupButtonRef = useRef()
  const ACCOUNT = accounts || getLocal('account') 
  useEffect(() => {
    if (hasQuitRoom) {
      setShowMask(false)
      setState({
        currentAddress: ''
      })
      setCurrentAddress()
    }
  }, [hasQuitRoom])
  useEffect(() => {
    myAvatarRef.current = myAvatar
    currentAddressRef.current = currentAddress || ROOM_ADDRESS
    hasScrollRef.current = hasScroll
    roomListRef.current = roomList
    chatListRef.current = chatList
    currentGroupTypeRef.current = currentGroupType
    hasAccessRef.current = hasAccess
    showJoinGroupButtonRef.current = showJoinGroupButton
  }, [currentAddress, hasScroll, roomList, chatList, currentGroupType, hasAccess, showJoinGroupButton, myAvatar, ROOM_ADDRESS])
  useEffect(() => {
 
    if(!(+getLocal('isConnect')) && groupLists?.length) {
      setCurrentRoomName(groupLists[0].name)
    }
    if(currentTabIndex === 0) {
      if(groupLists !== undefined) {
        const list = [...groupLists]
        console.log('setRoomList====1', list)
        setRoomList(list)
      }
    }
    groupListRef.current = groupLists
  }, [groupLists])
  useEffect(() => {
    const isShare = IS_SHARE || history?.location?.state?.share
    startIntervalGroup()
    if(detectMobile()) {
      getAccount()
    }
    if(Boolean(isShare)) {
      setShowChat(true)
      setShowGroupList(false)
    } else {
      const address = location?.state?.room || GROUP_ADDRESS
      setCurrentAddress(address)
    }
    return() => {
      clearInterval(groupTimer.current)
    }
  }, [])
  const getAccount = async() => {
    const account = await window?.ethereum?.request({ method: 'eth_requestAccounts' })
    if(account && account[0]) {
      setLocal('account', account[0])
      setLocal('isConnect', 1)
    }
  }
  useEffect(() => {
    const address = GROUP_ADDRESS || ROOM_ADDRESS || currentAddress
    const network = NETWORK || CURRENT_NETWORK
    if(address && network && detectMobile()) {
      setShowChat(true)
      setState({
        showHeader: false
      })
    }
  }, [GROUP_ADDRESS,ROOM_ADDRESS, currentAddress, CURRENT_NETWORK, NETWORK])
  useEffect(() => {
    if (currentTabIndex === 1) {
      getMyAvatar()
      localForage.getItem('publicKeyList').then(res => {
        const key = res && res[ACCOUNT]
        if (!key) {
          getMyPublicKey()
        }
      })
    }
  }, [currentTabIndex])
  const getMyAvatar = async () => {
    const tokensQuery = `
    query{
      profile(id: "`+ ACCOUNT.toLowerCase() + `"){
        name,
        avatar,
      }
    }
    `
    const clientInfo = await getClient()
    const res = await clientInfo?.query(tokensQuery).toPromise()
    setMyAvatar(res.data?.profile?.avatar)
    return res.data?.profile?.avatar
  }
  const changeChatType = (index) => {
    setCurrentAddress()
    history.push('/chat')
    setCurrentTabIndex(index)
    setState({
      currentTabIndex: index,
      currentAddress: ''
    })
  }
  const getMyPublicKey = () => {
    window.ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [ACCOUNT], // you must have access to the specified account
      })
      .then((result) => {
        localForage.getItem('publicKeyList').then(res => {
          if (res) {
            res[ACCOUNT] = result
            localForage.setItem('publicKeyList', res)
          } else {
            const obj = {}
            obj[ACCOUNT] = result
            localForage.setItem('publicKeyList', obj)
          }
        })

      })
  }
  const getManager = async (id, type) => {
    if (+type === 3) return
    const tx = await getDaiWithSigner(id, PUBLIC_GROUP_ABI).profile()
    const canSendText = tx.manager?.toLowerCase() == ACCOUNT?.toLowerCase()
    setCanSendText(canSendText)
    if (!canSendText || !hasAccess) {
      setShowJoinGroupButton(true)
    } else {
      setShowJoinGroupButton(false)
    }
  }
  const getPrivateChatStatus = async (id) => {
    const res = await getDaiWithSigner(currentNetworkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(id)
    setPrivateKey(res)
  }
  const initRoomAddress = async(hash) => {
    let data = history.location?.state
    if (data) {
      const { currentIndex, address, name, avatar, privateKey, share } = data
      setCurrentTabIndex(currentIndex)
      setCurrentAddress(address)
      setState({
        currentAddress: address
      })
      setPrivateKey(privateKey)
      setCurrentRoomName(name)
      setRoomAvatar(avatar)
      if(!share) {
        return
      }
    }
    const address = GROUP_ADDRESS || ROOM_ADDRESS
    const network = NETWORK || CURRENT_NETWORK || getLocal('network')
    if (network) {
      setState({
        currNetwork: network
      })
    }
    if (address) {
      setCurrentAddress(address)
      if(!location.hash) {
        await getInitChatList(address)
      }
      setState({
        currentAddress: address
      })
      if(!hash) {
        await isRoom(address)
      }
    }
  }
  const updateGroupList = async (name, roomAddress, type) => {
    const list = groupListRef?.current.length > 0 ? groupListRef?.current : await getPublicGroupList()
    const index = list?.findIndex(item => item.id.toLowerCase() == roomAddress.toLowerCase())
    const groupList = list?.length > 0 ? [...list] : []
    if (index === -1) {
      groupList.push({
        id: roomAddress,
        name: name,
        chatCount: 0,
        newChatCount: 0,
        _type: type,
        hasDelete: false
      })
      let res = await localForage.getItem('chatListInfo')
      let chatListInfo = res ? res : {}
      const list = Object.keys(chatListInfo)
      const currentNetwork = getLocal('network')
      chatListInfo[currentNetwork] = list.length ? chatListInfo[currentNetwork] : {}
      chatListInfo[currentNetwork][ACCOUNT] = chatListInfo[currentNetwork][ACCOUNT] ? chatListInfo[currentNetwork][ACCOUNT] : {}
      // debugger
      chatListInfo[currentNetwork][ACCOUNT]['publicRooms'] = [...groupList]
      // console.log('chatListInfo====3')
      localForage.setItem('chatListInfo', chatListInfo).then(res => {
        setRoomList(groupList)
        // console.log('setRoomList====2', groupList)

        setState({
          groupLists: groupList
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
  const getGroupName = async(roomAddress, groupType, groupInfo) => {
    if(!roomAddress || !groupType || !groupInfo) return
    getJoinRoomAccess(roomAddress, groupType)
    if (groupType == 3) {
      var  { name } = await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).groupInfo()
    } else {
      var  { name } = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).profile()
    }
    setCurrentRoomName(name || groupInfo?.name)
    if (name) {
      updateGroupList(name, roomAddress, groupType)
    }
  }
  const getGroupInfo = (groupInfo) => {
    if(chainId !== 513100 && groupInfo && !(+getLocal('isConnect')) ) {
      const { chatCount, id, name, __typename, _type } = groupInfo
      const roomInfo = [
        {
          chatCount: chatCount,
          id: id,
          name: name,
          __typename: __typename,
          _type: _type
        }
      ]
      // console.log(roomInfo, 'groupLists=====8')
      setState({
        groupLists: [...roomInfo]
      })
      setCurrentRoomName(name)
      // console.log('setRoomList====3', roomInfo)

      setRoomList([...roomInfo])
    }
  }
  const setGroupInfo = async(roomAddress) => {
    const groupInfo = await getGroupMember(roomAddress, skip)
    setState({
      groupType: groupInfo?._type
    })
    const groupType = groupInfo?._type
    setGroupType(groupType)
    getGroupInfo(groupInfo)
    return groupInfo
  }
  const isRoom = async (roomAddress) => {
    try {
      const list = await getCachePublicGroup()
      initCurrentAddress(roomAddress)
      const result = roomList || list
      const index = result?.slice()?.findIndex(item => item.id === roomAddress?.toLocaleLowerCase())
      if(+index > -1) return
      const groupInfo = await setGroupInfo(roomAddress)
      await getGroupName(roomAddress, groupInfo?._type, groupInfo)
    }
    catch (e) {
      console.log(e, 'error==========')
      setShowMask(false)
      if (!hasNotice) {
        if(Boolean(+getLocal('isConnect')) && location?.state?.currentIndex === 0) {
          alert('This is not a chat room.')
        } else {
          if(!NETWORK) {
            alert('Please connect wallet first')
          }
        }
        setHasNotice(true)
        setShowMask(false)
      }
      return false
    }
    setShowMask(false)
  }
  const getHasAccessStatus = async(roomAddress, groupType) => {
    if(!ACCOUNT || !roomAddress || !groupType) return
    const res = groupType == 3 
              ? await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).managers(ACCOUNT)
              : await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).balanceOf(ACCOUNT)
    const hasAccess= ethers.BigNumber.from(res) > 0
    setHasAccess(hasAccess)
    return hasAccess
  }
  const getReceivedStatus = async(version, id) => {
    const envelopId = parseInt(id || redEnvelopId)
    setCurrentRedEnvelopId(envelopId)
    const tx = await getDaiWithSigner(version.address, version.reaPacket).giveawayInfo_exist(envelopId, ACCOUNT)
    let isReceived = (new BigNumber(Number(tx))).toNumber()
    return isReceived
  }
  const getJoinRoomAccess = async (roomAddress, groupType) => {
    if(!roomAddress || !groupType) return
    try {
      if(location?.state?.currentIndex === 0 || currentTabIndex === 0) {
        const hasAccess = await getHasAccessStatus(roomAddress, groupType)
        setShowJoinGroupButton(!Boolean(hasAccess))
        setShowMask(false)
      }
    } catch(error) {
      console.log(error, '===error==')
    }
  }
  const fetchPublicChatList = async (roomAddress) => {
    const tokensQuery = `
    query{
      chatInfos(orderBy:index,orderDirection:desc, first:20, where:{room: "`+ roomAddress?.toLowerCase() + `"}){
        id,
        transaction,
        block,
        index,
        chatText,
        room,
        _type,
        user{
          id,
          name,
          profile{
            avatar,
            name
          }
        }
      }
    }
    `
    
    
    const state = history?.location?.state
    const address = roomAddress || currentAddressRef?.current || GROUP_ADDRESS || ROOM_ADDRESS || state?.address
    const network = state?.network || NETWORK || CURRENT_NETWORK || getLocal('network')
    if(!address) return
    setLocal('network', network?.toUpperCase())
    setCurrNetwork(network)
    const clientInfo = await getClient()
    const data = await clientInfo?.query(tokensQuery).toPromise()
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: roomAddress }).project({}).sort({ block: -1 }).toArray()
    const chatList = data?.data?.chatInfos || []
    // const result = formateData(chatList, roomAddress)
    const result = await getMemberList(chatList) || []
    await insertData(result)
    if (roomAddress?.toLowerCase() === address?.toLowerCase()) {
      if (res?.length > 0) {
        // console.log('setChatList===1',res)
        setChatList(res)
      } else {
        // console.log('setChatList===2',result)
        setChatList(result)
      }
      setShowMask(false)
    }
  }

  const insertData = async (datas) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    for (let i = 0; i < datas?.length; i++) {
      datas[i].block = parseInt(datas[i].block)
      collection?.findOne({ id: datas[i].id }).then((doc) => {
        console.log(doc, 'doc======')
        if (doc) {
          collection.update({ id: datas[i].id }, { $set: datas[i] })
        } else {
          collection.insert(datas[i])
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const initCurrentAddress = (list) => {
    setCurrentAddress(list)
    setState({
      currentAddress: list
    })
  }
  const getCurrentRoomInfo = (roomAddress) => {
    setShowJoinRoom(false)
    setHasScroll(false)
    // console.log('setChatList===3')
    setChatList([])
    setShowMask(true)
    isRoom(roomAddress)
  }
  const createNewRoom = async (address, name, currentGroupType) => {
    getJoinRoomAccess(address, currentGroupType)
    setCurrentAddress(address)
    setState({
      currentAddress: address
    })
    if(detectMobile()) {
      setShowChat(true)
      setState({
        showHeader: false
      })
    }
    // console.log('setChatList===4')
    setChatList([])
    setShowMask(false)
    setCurrentRoomName(name)
    setShowCreateNewRoom(false)
    initCurrentAddress(address)
  }
  const connectWallet = () => {
    setState({
      showConnectNetwork: true
    })
  }
  const handleClick = () => {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'imageMask') {
        setShowInfo(false)
      }
    })
  }
  const onClickSelect = (e) => {
    const id = e.target.id.slice(0, -4)
    setShowCreateNewRoom(id === 'creat')
    setShowJoinRoom(id === 'new')
    setShowSettingList(false)
  }
  const showChatList = async(item) => {
    // console.log('setChatList===5')
    setChatList([])
    setHasOpenedSignIn(false)
    setState({
      canUnstake: false,
      stakedDays: 0,
      tokenAddress: '',
      showOpenSignIcon: false
    })
    setCurrentRedEnvelopId()
    setShowMask(true)
    setHasAccess()
    setHasMore(true)
    if (currentTabIndex === 0 && window.ethereum) {
      
      await getJoinRoomAccess(item.id, item._type)
      getManager(item.id, item._type)
      if(+item.newChatCount > 0) {
        await getCurrentChatList(item.id)
        await handleReadMessage(item.id)
      }
      // history.push(`/chat/${item.id}/${getLocal('network')}`)
      const state = {
        address: item.id,
        network: getLocal('network'),
        currentIndex: 0,
        name: item.name
      }
      history.push('/chat', state)
      // history.push('/chat')
    }
    setShowChat(true)
    if (detectMobile()) {
      setState({
        showHeader: false
      })
    }
    setRoomAvatar(item.avatar)
    getInitChatList(item.id, item.avatar)
    setCurrentGroupType(item._type)
    setState({
      groupType: item._type
    })
    if (currentTabIndex === 1) {
      setShowChat(true)
      setCurrentAddress(item.id)
      getPrivateChatStatus(item.id)
      history.push(`/chat/${item.id}#p`)
    }
    setMemberCount()
    setHasMore(true)
    setCurrentAddress(item.id)
    setState({
      currentAddress: item.id
    })
    setCurrentRoomName(item.name)
    setShowMask(true)
    setHasScroll(false)
  }
  const loadingGroupData = async () => {
    const firstBlock = chatList && chatList[chatList.length - 1]?.index
    if (!firstBlock) return
    const tokensQuery = `
    query{
      chatInfos(orderBy:index,orderDirection:desc, first:20, where:{room: "`+ currentAddressRef?.current?.toLowerCase() + `",index_lt: ` + firstBlock + `}){
        id,
        transaction,
        block,
        chatText,
        room,
        index,
        _type,
        user{
          id,
          name,
          profile{
            avatar,
            name
          }
        }
      }
    }
    `
    const clientInfo =  await getClient()
    const data = await clientInfo?.query(tokensQuery).toPromise()
    const loadingList = data?.data?.chatInfos || []
    if (loadingList.length < 20) {
      setHasMore(false)
    }
    const fetchData = loadingList && loadingList.map((item) => {
      return {
        ...item,
        hasDelete: false,
        isSuccess: true,
        showProfile: false,
        position: (item?.user?.id).toLowerCase() === (myAddress)?.toLowerCase(),
        showOperate: false,
      }
    })
    const newfetchData = loadingList?.length > 0 ? await getMemberList(fetchData) : []
    insertData(newfetchData)
    if(chatListRef.current.length && newfetchData?.length > 0) {
      const list = [...chatListRef.current]
      const result = list.concat(newfetchData)
      // console.log('setChatList===6')
      setChatList(result)
    }
  }
  const loadingData = async () => {
    if(currentTabIndex === 0) {
      loadingGroupData()
    }
    if(currentTabIndex === 1) {
      loadingPrivateData()
    }
  }
  const loadingPrivateData = async() => {
    const firstBlock = chatList && chatList[chatList.length-1]?.block
    if(!firstBlock) return
    const myAddress = ACCOUNT?.toLowerCase()
    const tokensSenderQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{sender: "`+ myAddress +`", to: "`+ currentAddressRef?.current?.toLowerCase() + `",block_lt: ` + firstBlock + `}){
        id,
        sender,
        block,
        chatText,
        to,
        chatTextSender,
        _type
      }
    }
    `
    const tokensReceivedrQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{to: "`+ myAddress +`", sender: "`+ currentAddressRef?.current?.toLowerCase() + `",block_lt: ` + firstBlock + `}){
        id,
        sender,
        block,
        to,
        chatText,
        chatTextSender,
        _type
      }
    }
    `
    const currentList = await formateCurrentPrivateList(tokensSenderQuery, tokensReceivedrQuery, currentAddressRef?.current?.toLowerCase())
    if(currentList.length < 40) {
      setHasMore(false)
    }
    const list = [...chatListRef.current]
    // console.log('setChatList===7', currentList.concat(list))
    setChatList(currentList.concat(list))
    // insertData(currentList)
  }
  const shareInfo = (e, v) => {
    e.stopPropagation()
    v.showOperate = false
    setState({
      showShareContent: true
    })
    setShowInfo(true)
    setShareTextInfo(v.chatText)
  }
  const onClickDialog = (e) => {
    setShowJoinRoom(true)
  }
  const formatePrivateData = (res, toAddress, avatar, type) => {
    const data = res?.data?.encryptedInfos.map(item => {
      return {
        ...item,
        encryptedText: type === 1 ? item.chatTextSender : item.chatText,
        position: type === 1 ? true : false,
        isSuccess: true,
        showOperate: false,
        showProfile: false,
        isDecrypted: false,
        room: toAddress.toLowerCase(),
        avatar: type === 1 ? (myAvatar || myAvatarRef.current) : (avatar || roomAvatar)
      }
    })
    return data
  }

  const fetchPrivateChatList = async(toAddress, avatar) => {
    const myAddress = ACCOUNT?.toLowerCase()
    const tokensSenderQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{sender: "`+ myAddress +`", to: "`+ toAddress?.toLowerCase() + `"}){
        id,
        sender,
        block,
        chatText,
        to,
        _type,
        chatTextSender
      }
    }
    `
    const tokensReceivedrQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{to: "`+ myAddress +`", sender: "`+ toAddress?.toLowerCase() + `"}){
        id,
        sender,
        block,
        to,
        chatText,
        _type,
        chatTextSender
      }
    }
    `
    try{
      const currentList = await formateCurrentPrivateList(tokensSenderQuery, tokensReceivedrQuery, toAddress, avatar)
      setState({
        privateChatList: [...currentList]
      })
      // console.log('setChatList===8', currentList)
      setChatList(currentList)
      // insertData(currentList)
      setShowMask(false)
    } catch(error) {
      console.log(error, '====')
      setShowMask(false)
    }
  }
  const formateCurrentPrivateList = async(tokensSenderQuery, tokensReceivedrQuery, toAddress, avatar) => {
    const resSender = await clientInfo.query(tokensSenderQuery).toPromise()
    const resReceived = await clientInfo.query(tokensReceivedrQuery).toPromise()
    const senderInfo = formatePrivateData(resSender, toAddress, avatar, 1)
    const receivedInfo =  formatePrivateData(resReceived, toAddress, avatar, 2)
    const privateChatList = [...senderInfo, ...receivedInfo]
    const currentList = privateChatList.sort(function (a, b) { return b.block - a.block; })
    return currentList
  }
  const getInitChatList = async(toAddress, avatar) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: toAddress })?.project({})?.sort({ block: -1 })?.toArray()
    if (!res || res?.length === 0) {
      if (currentTabIndex == 0) {
        await fetchPublicChatList(toAddress)
      }
      if(currentTabIndex == 1) {
        await fetchPrivateChatList(toAddress, avatar)
      }
    } else {
      if(toAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
        const list = uniqueChatList(res, 'block')
        // console.log('setChatList===9', list)
        setChatList(list)
      }
      setShowMask(false)
    }
  }
  const getencryptedMessage = (chatText, encryptedKey ) => {
    const ethUtil = require('ethereumjs-util')
    var Buffer = require('buffer').Buffer
    window.Buffer = Buffer;
    const sigUtil = require('@metamask/eth-sig-util')
    const encryptedMessage = ethUtil.bufferToHex(
      Buffer.from(
        JSON.stringify(
          sigUtil.encrypt({
            publicKey: encryptedKey,
            data: chatText,
            version: 'x25519-xsalsa20-poly1305',
          })
        ),
        'utf8'
      )
    )
    return encryptedMessage
  }
  // const getNewMsgIndex = async(block) => {
  //   const tokensQuery = `
  //   query{
  //     chatInfos(where:{room: "`+ currentAddress?.toLowerCase() +`", block: ` + block + `}){
  //       index
  //     }
  //   }
  // `

  // const client = await getClient()
  // const data = await client?.query(tokensQuery).toPromise()
  // console.log(data, '====>>>>getNewMsgIndex')
  // }
  const handleSend = async(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount) => {
    const haveAmount = !minAmount ? 0 : ethers.utils.parseEther(minAmount)
    const lastDate = getTimestamp(7)
    const stackedAmount = !minStackedAmount ? 0 : ethers.utils.parseEther(minStackedAmount)
    const haveTokenAddress= !mustHaveTokenAddress ? '0x0000000000000000000000000000000000000000' : mustHaveTokenAddress
    const scoreToken = Boolean(+openStatus) ? globalNftAddress : '0x0000000000000000000000000000000000000000'
    const type_ = currentBonusType === intl.get('RandomAmount') ? 2 : 1
    const total = ethers.utils.parseUnits(String(totalAmount), tokenDecimals)
    if(!wishesText) {
      wishesText = 'Best Wishes'
    }
    const params = {
      group: currentAddress,
      amount: total,
      count: quantity,
      type_: type_,
      content: wishesText,
      haveToken: haveTokenAddress,
      haveAmount: haveAmount,
      scoreToken: scoreToken,
      scoreAmount: stackedAmount,
      lastDate: ethers.BigNumber.from(lastDate)
    }
    const address = giveAwayAddressV3
    const redPacket = RED_PACKET_V2
      // var tx = selectTokenAddress == 0
      // ? await getDaiWithSigner(address, redPacket).sendETH(currentAddress, total, quantity, type_, wishesText, {value:total})
      // : await getDaiWithSigner(address, redPacket).send(currentAddress,selectTokenAddress, total, quantity, type_, wishesText)

    const tx = selectTokenAddress == 0
    ? await getDaiWithSigner(address, redPacket).sendETH(params, {value:total})
    : await getDaiWithSigner(address, redPacket).send(selectTokenAddress, params)
    setShowMask(true)
    setShowAwardBonus(false)
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    await handleGiveAway(tx, wishesText)
    let callback = await tx.wait()
    setShowAwardBonus(false)
    const id = callback?.events[4]?.args?.tokenId
    console.log(callback, 'callback?=====', id)
    const index = chatList?.findIndex((item) => item?.id?.toLowerCase() == callback?.transactionHash?.toLowerCase())
    if(chatList?.length > 0) {
      chatList[index].isSuccess = true
      chatList[index].block = callback?.blockNumber
      chatList[index].chatText = String((new BigNumber(Number(id))).toNumber())
      chatList[index].wishesText = wishesText
      setClickNumber(clickNumber+1)
      collection.insert(chatList[index])
      setClickNumber(clickNumber+1)
    } else {
      // console.log('setChatList===10')
      setChatList([])
      chatList[0].isSuccess = true
      chatList[0].block = callback?.blockNumber
      chatList[0].chatText = String((new BigNumber(Number(id))).toNumber())
      chatList[0].wishesText = wishesText
      // console.log('setChatList===11', chatList)
      setChatList(chatList)
      collection.insert(chatList)
      setClickNumber(clickNumber+1)
    }
    setShowMask(false)
  }
  const handleGiveAway = async(tx, wishesText) => {
    const myAvatar = await getMyAvatar()
    if(currentTabIndex === 0 ) {
      var newChat = {
        id: tx.hash,
        block: 0,
        chatText: '',
        transaction: tx.hash,
        sender: myAddress,
        position: true,
        room: currentAddress,
        hasDelete: false,
        isSuccess: false,
        showProfile: false,
        showOperate: false,
        avatar: myAvatar,
        _type: 'GiveawayV2',
        isOpen: false,
        wishesText: wishesText,
        user: {
          id: giveAwayAddressV3
        }
      }
      if(chatList?.length > 0) {
        chatList.unshift(newChat)
      } else {
        chatList.push(newChat)
      }
    }
  }
  const startChat = async (chatText) => {
    const myAvatar = await getMyAvatar()
    setSendSuccess(false)
    try {
      if(currentTabIndex === 1) {
        const myPublicKey = await localForage.getItem('publicKeyList').then(res => {
          return res[myAddress]
        })
        const encryptedMessage = getencryptedMessage(chatText, privateKey)
        const encryptedSenderMessage = getencryptedMessage(chatText, myPublicKey)
        var tx = await getDaiWithSigner(currentNetworkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).send(currentAddress, encryptedMessage, encryptedSenderMessage, 'msg')
      }
      if(currentTabIndex === 0 ) {
        const groupInfo = await getGroupMember(currentAddress, skip)
        const groupType = groupInfo?._type
        setGroupType(groupType)
        const abi = groupType == 3 ? PUBLIC_SUBSCRIBE_GROUP_ABI : PUBLIC_GROUP_ABI
        var tx = await getDaiWithSigner(currentAddress, abi).send(chatText, 'msg')
      }
      setClearChatInput(true)
      var newChat = {
        id: tx.hash,
        block: 0,
        transaction: tx.hash,
        chatText: chatText,
        position: true,
        hasDelete: false,
        isSuccess: false,
        showProfile: false,
        showOperate: false,
        avatar: myAvatar,
        _type: 'msg',
        user: {
          id: myAddress
        }
      }
      if(chatList?.length > 0) {
        chatList.unshift(newChat)
      } else {
        chatList.push(newChat)
      }
     
      let callback = await tx.wait()
      console.log(callback, 'handlecallback====>>>')
      const groupList = await getPublicGroupList()
      await handleReadMessage(currentAddress, groupList)
      if (callback?.status === 1) {
        const index = chatList?.findIndex((item) => item.id.toLowerCase() == tx.hash.toLowerCase())
        // await getNewMsgIndex(callback?.blockNumber)
        chatList[index].isSuccess = true
        chatList[index].block = callback?.blockNumber
        chatList[index].isDecrypted = true
        setClickNumber(clickNumber+1)
        const db = await setDataBase()
        const collection = db?.collection('chatInfos')
        newChat.isSuccess = true
        newChat.block = String(callback?.blockNumber)
        newChat.room = currentAddress
        newChat.isDecrypted = true
        collection.insert(newChat)
      }
    } catch (error) {
      console.log(error, 'error==')
    }
  }
  const handleScroll = () => {
    setHasScroll(true)
  }
  const handleReadMessage = async(roomAddress) => {
    // debugger
    const currentGroupList = await getPublicGroupList()
    const list = currentGroupList || [...groupLists] || [...roomList]
    const currentGroup = list?.filter(item => item.id === roomAddress?.toLowerCase())
    let res = await localForage.getItem('chatListInfo')
    const currNetwork = location?.state?.network || NETWORK || CURRENT_NETWORK || getLocal('network')
    const publicRooms = res && res[currNetwork]?.[ACCOUNT]?.['publicRooms']
    const index = publicRooms?.findIndex(item => item.id == roomAddress?.toLowerCase())
    if(index > -1) {
      publicRooms[index]['newChatCount'] = 0
      publicRooms[index]['chatCount'] = currentGroup[0]?.chatCount
      res[currNetwork][ACCOUNT]['publicRooms'] = [...publicRooms]
      localForage.setItem('chatListInfo', res)
      console.log('setRoomList====4', publicRooms)

      setRoomList(publicRooms)
    }
  }
  const getCurrentGroupChatList = async(roomAddress, newBlock) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: roomAddress }).project({}).sort({ block: -1 }).toArray()
debugger
    const lastBlock = newBlock || res?.length && +res[0]?.block + 1
    // if(!lastBlock || chatListRef.current[0]?.block == 0) return
    const tokensQuery = `
        query{
          chatInfos(orderBy:index,orderDirection:desc, where:{room: "`+ roomAddress?.toLowerCase() +`", block_gte: ` + lastBlock + `}){
            id,
            transaction,
            block,
            chatText,
            room,
            index,
            _type,
            user{
              id,
              name,
              profile{
                avatar,
                name
              }
            }
          }
        }
      `
    
    const client = await getClient()
    if(res === undefined) return
    // if(+currentGroup[0]?.chatCount > +res[0]?.index) {
      const data = await client?.query(tokensQuery).toPromise()
      if (!data?.data?.chatInfos.length) return
      const newList = data?.data?.chatInfos && await getMemberList(data?.data?.chatInfos)
      const list = chatListRef ? chatListRef.current : []
      
      collection.insert(newList, (error) => {
        // updateNewList(roomAddress, collection)
        if (error) { throw error; }
      })
      if (roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && newList?.length) {
        
        const index = list?.findIndex(item => item.id == newList[0]?.id)
        if(index === -1) {
          // console.log('setChatList===12', chatList)
          setChatList(newList.concat(list))
          
          // await handleReadMessage(currentAddress)
        }
      }
    // }
  }
  const getCurrentChatList = async (roomAddress) => {
    
    if(!chainId) return
    if(currentTabIndex === 0) {
      await getCurrentGroupChatList(roomAddress)
    }
    if(currentTabIndex === 1) {
      await getCurrentPrivateChatList(roomAddress)
    }
  }
  const getCurrentPrivateChatList = async(roomAddress) => {
    const lastBlock = chatListRef.current?.length && +chatListRef.current[0]?.block + 1
    if(!lastBlock || chatListRef.current[0]?.block == 0) return
    const tokensSenderQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, where:{sender: "`+ myAddress +`", to: "`+ roomAddress?.toLowerCase() + `",block_gte: ` + lastBlock + `}){
        id,
        sender,
        block,
        chatText,
        to,
        chatTextSender
      }
    }
    `
    const tokensReceivedrQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc,where:{to: "`+ myAddress +`", sender: "`+ roomAddress?.toLowerCase() + `",block_gte: ` + lastBlock + `}){
        id,
        sender,
        block,
        to,
        chatText,
        chatTextSender
      }
    }
    `
    const currentList = await formateCurrentPrivateList(tokensSenderQuery, tokensReceivedrQuery, roomAddress)
    const list = [...chatListRef.current]
    if(roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && currentList.length) {
      // console.log('setChatList===13', currentList.concat(list))
      setChatList(currentList.concat(list))
    }
    // insertData(currentList)
  }

  const verifyProfile = async() => {
    const hasCreateProfile = await getProfileStatus(accounts)
    if(!Boolean(hasCreateProfile)) {
      setCanReceiveTips(true)
      return false
    }
    return true
  }

  const verifyJoinRoom = () => {
    if(hasAccessRef.current !== undefined && !hasAccessRef.current) {
      setTipsText(intl.get('JoinRoomText'))
      setShowTips(true)
      return false
    }
    return true
  }

  const verifyRegister = async(reaPacket) => {
    if(globalNftAddress) {
      const registerNftInfos = await getDaiWithSigner(globalNftAddress, reaPacket).balanceOf(ACCOUNT)
      if(+registerNftInfos < 1) {
        setShowTips(true)
        const text = `${intl.get('YouMust')} ${intl.get('CheckIn')} ${intl.get('ReceiveRedEnvelope')}`
        setTipsText(text)
        return false
      }
      return true
    }
  }

  const verifyHaveToken = async(haveToken, mustHaveAmount) => {
    let tokenBalance = 0
    const tokenList = [...tokenListInfo]
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() == haveToken.toLocaleLowerCase())
    if(+haveToken === 0){
      tokenBalance = await getCurrentBalance(ACCOUNT)
    }else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const res = await getBalance(provider, haveToken, ACCOUNT)
      tokenBalance = getBalanceNumber(new BigNumber(Number(res)), selectedToken[0]?.decimals)
    }
    if ((tokenBalance < +mustHaveAmount)){
      setShowTips(true)
      const text = `${intl.get('YouMust')} ${mustHaveAmount} ${selectedToken[0].symbol} ${intl.get('ReceiveRedEnvelope')}`
      setTipsText(text)
      return false
    }
    return true
  }

  const verifyStackedAmount = async(scoreAmount, haveToken) => {
    const stackedAmount = await getStackedAmount(globalNftAddress)
    const tokenList = [...tokenListInfo]
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() == haveToken.toLocaleLowerCase())
    const needStackedAmount = ethers.utils.formatEther(scoreAmount)
    console.log(needStackedAmount, 'verifyStackedAmount')
    if(+needStackedAmount > +stackedAmount) {
      setShowTips(true)
      const text = `${intl.get('YouMust')} ${intl.get('Stacked')} ${needStackedAmount} ${selectedToken[0].symbol} ${intl.get('ReceiveRedEnvelope')}`
      setTipsText(text)
      return false
    }
    return true
  }

  const receiveRejectStatus = async(versionInfo, chatText) => {
    const { giveaway, reaPacket, address, version, graphUrl } = versionInfo
    setCurrentGiveAwayVersion(address)
    const giveawayInfos = await getReceiveInfo(chatText, giveaway, graphUrl, version)

    if (!await verifyProfile()) return false

    if(!verifyJoinRoom()) return false

    if(+giveawayInfos?.lastCount === 0) {
      setShowReceiveInfo(true)
      return false
    }

    if(RED_PACKET_VERSION !== 'v1' && version !== 'v1') {
     
      if(+giveawayInfos?.scoreToken !== 0) {
          const isRegister = await verifyRegister(reaPacket)
          if(!isRegister) return false
      }
      console.log(giveawayInfos?.scoreAmount, 'scoreAmount==')
      const mustHaveAmount = giveaway === 'giveawayV2S' && ethers.utils.formatEther(giveawayInfos?.haveAmount)
      if(+mustHaveAmount !== 0) {
        const isHaveToken = await verifyHaveToken(giveawayInfos?.haveToken, mustHaveAmount)
          if(!isHaveToken) return false
      }
    }

    if(version === 'v3' && +giveawayInfos?.scoreAmount !== 0) {
      const isStacked = await verifyStackedAmount(giveawayInfos?.scoreAmount, giveawayInfos?.haveToken)
      if(!isStacked) return false
    }

    return true
  }
  const getRedPacketVersion = async(v) => {
    const item = await getCurrentNetworkInfo()
    const version = item.addressList[v.user.id]
    return version
  }
  const handleReceive = async(v) => {
    const chatText = v?.chatText?.indexOf('---') ? v?.chatText.split('---')[0] : v?.chatText
    setCurrentRedEnvelopId(chatText)
    const version = await getRedPacketVersion(v)
    setCurrentRedPackeVersion(version)
    setCurrentGiveAwayVersion(v.user.id)
    const isReceived = await getReceivedStatus(version, chatText)
    if(isReceived === 1) {
      setShowReceiveInfo(true)
    } else {
      const receiveReject = await receiveRejectStatus(version, chatText)
      if(!receiveReject) return
      setShowRedEnvelope(true)
    }
    v.isOpen = true
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    collection?.findOne({ id: v.id }).then((doc) => {
      if (doc) {
        collection.update({ id: v.id }, { $set: v })
      }
    }).catch(error => {
      console.log(error)
    })
    setClickNumber(clickNumber+1)
    setCurrentRedEnvelopTransaction(v?.transaction)
  }
  const getGiveawaysInfo = async(currentRedEnvelopId, version, id) => {
    const item = await getCurrentNetworkInfo()
    const giveawayVersion = version === 'GiveawayV2' ? 'giveawayV2S' : 'giveaways'
    const tokensQuery = `
    {
      ${giveawayVersion}(where: {id: "`+  currentRedEnvelopId + `"}){
        sender,
        lastCount,
        count,
        profile {
          name,
          avatar
        }
      }
    }
    `
    if(item?.addressList[id]) {
      const client = createClient({
        url: item?.addressList[id]?.graphUrl
      })
      const res = await client.query(tokensQuery).toPromise()
      const giveaways = giveawayVersion === 'giveawayV2S' ? res?.data?.giveawayV2S[0] : res?.data?.giveaways[0]
      return giveaways
    }
  }
  const getMemberList = async(chatList) => {
    if(currentTabIndex === 1 || !chatList.length) return
    let result = [...chatList]
    let collectedRedEnvelope = []
    await Promise.all(
      result.map(async(item) => {
        if(item?._type ==='Giveaway' || item?._type === 'GiveawayV2') {
          const id = item?.chatText?.indexOf('---') ? item?.chatText.split('---')[0] : item?.chatText
          var res = await getGiveawaysInfo(id, item?._type, item.user.id)
          if(+res?.lastCount > 0) {
            collectedRedEnvelope.push({
              id: id,
              lastCount: res.lastCount,
              count: res.count
            })
            setCollectedRedEnvelope(collectedRedEnvelope)
          }
        }
        let params = {
            avatar: (item?._type ==='Giveaway' || item?._type === 'GiveawayV2') ? res?.profile?.avatar : item?.user?.profile?.avatar,
            hasDelete: false,
            isSuccess: true,
            showProfile: false,
            position: Boolean(+getLocal('isConnect')) ? (item?._type ==='Giveaway' || item?._type === 'GiveawayV2' ? res?.sender?.toLowerCase() === ACCOUNT?.toLowerCase() : item?.user?.id.toLowerCase() === ACCOUNT?.toLowerCase()) : false,
            showOperate: false,
            isOpen: false,
            index: item.index,
            wishesText: item?.chatText?.split('---')[1]
          }
          Object.assign(item, params)
          return item
      })
    )
    setShowMask(false)
    return result
  }
  const handleHiddenMask = () => {
    setShowMask(false)
  }
  const hiddenChat = () => {
    if(!showGroupList) {
      history.goBack()
    } else {
      setShowChat(false)
      setState({
        showHeader: true
      })
    }
  }
  const getDecryptedMessage = async(id, message) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    setHasDecrypted(false)
    window.ethereum
      .request({
        method: 'eth_decrypt',
        params: [message, ACCOUNT]
      })
      .then((decryptedMessage) => {
        collection.update({
          id: id
        }, {
          isDecrypted: true,
          chatText: decryptedMessage
        }, (error) => {
          if (error) { throw error; }
        })
        const index = chatList.findIndex(item => item.id == id)
        chatList[index].isDecrypted = true
        chatList[index].chatText = decryptedMessage
        setHasDecrypted(true)
        // insertData()
        // console.log('setChatList===14', chatList)
        setChatList(chatList)
      }
      )
      .catch((error) => console.log(error.message));
  }
  const changeJoinStatus = (groupType) => {
    if (groupType == 3) {
      getManager(currentAddress, groupType)
    } else {
      setHasAccess(true)
    }
  }
  const handleDecryptedMessage = (id, text) => {
    getDecryptedMessage(id, text)
  }
  const handleConfirmAutoCheckIn = async() => {
    const fee = ethers.utils.parseEther('1')
    const tx = await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).automatic({value: fee})
    setShowHandlingFee(false)
    setShowSignIn(false)
    setShowMask(true)
    await tx.wait()
    setShowMask(false)
  }
  const handlePrivateChat = (item, res) => {
    setCurrentTabIndex(1)
    setShowGroupMember(false)
    if(Boolean(res)) {
      history.push({
        pathname: `/chat/${item.id}`,
        state: {
          name: item?.name ? item?.name : item?.profile?.name,
          address: item.id,
          avatar: item?.profile?.avatar ? item?.profile?.avatar : item.id
        }
      })
    }
  }
  const getNftAddress = async() => {
    const currentAddress = ROOM_ADDRESS || GROUP_ADDRESS
    const tx = await getDaiWithSigner(signInAddress, REGISTER_ABI).registers(currentAddress)
    globalNftAddress = tx.nft
  }
  useEffect(() => {
    // console.log(history.location, 'history.location===5')
    setCurrentRedEnvelopId(RED_PACKET_ID)
    const address = GROUP_ADDRESS || ROOM_ADDRESS
    const network = NETWORK || CURRENT_NETWORK
    const hash = history.location.hash
    hash ? setCurrentTabIndex(1) : setCurrentTabIndex(0)
    if(!(+getLocal('isConnect')) && address) {
      fetchPublicChatList(address)
    }
    if(network) {
      initRoomAddress(hash)
    }
    if(address && !(+getLocal('isConnect')) && !network) {
      // alert('Please connect wallet first')
    }
  }, [])
  const handleAwardBonus = async() => {
    const res = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).users(giveAwayAddressV3)
    if(!Boolean(res?.state)) {
      setShowOpenAward(true)
    } else {
      setShowAwardBonus(true)
    }
  }
  const handleSelectNft = (id) => {
    setShowNftList(false)
  }
  const handleSearch = (event) => {
    const value = event.target.value
    setSearchGrouName(value)
    const list = [...groupLists]
    var newList = list.filter(item => item.name.includes(value) || item.id.toUpperCase().includes(value.toUpperCase()))
    setSearchGroup(newList)
  }
  const handleReceiveConfirm = async() => {
    setState({
      showOpen: false
    })
    let redPackeVersionInfo = {}
    if(!currentRedPackeVersion) {
      const item = await getCurrentNetworkInfo()
      redPackeVersionInfo = item.versionList[RED_PACKET_VERSION]
    } else {
      redPackeVersionInfo = currentRedPackeVersion
    }
    const { giveaway, graphUrl, version, reaPacket } = redPackeVersionInfo
    const giveawayInfos = await getReceiveInfo(currentRedEnvelopId, giveaway, graphUrl, version)
    if(giveawayInfos?.lastCount === 0) {
      setShowRedEnvelope(false)
      setShowReceiveInfo(true)
      return
    }
    const tx = version !== 'v3'
          ? await getDaiWithSigner(currentGiveAwayVersion, reaPacket).receive(currentRedEnvelopId)
          : await getDaiWithSigner(currentGiveAwayVersion, reaPacket).receives(currentRedEnvelopId)
    setState({
      showOpen: true
    })
    const callback = await tx.wait()
    setShowRedEnvelope(false)
    setShowReceiveInfo(true)
    const index = chatList?.findIndex(item => item.transaction == currentRedEnvelopTransaction)
    if(index > -1) {
      chatList[index].isOpen = true
    }
    setState({
      showOpen: false
    })
  }
  const handleCancelCheckin = async() => {
    const tx = await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).cancelCheckin()
    setShowSignIn(false)
    setShowMask(true)
    await tx.wait()
    setState({
      canUnstake: false,
      isCancelCheckIn: true
    })
    setShowMask(false)
  }
  const handleOpenAward = async() => {
    setShowOpenAward(false)
    const tx = await getDaiWithSigner(giveAwayAddressV3, RED_PACKET_V2).register(currentAddress)
    setShowMask(true)
    await tx.wait()
    setShowMask(false)
    setShowAwardBonus(true)
  }
  const handleCloseAward = () => {
    setShowChat(true)
    setShowAwardBonus(false)
  }
  const getNftList = async() => {
    const tokensQuery = `
    {
      registerInfos(
        where: {manager: "`+ ACCOUNT?.toLowerCase() + `", register: "`+globalNftAddress?.toLowerCase()+`"}
      ) {
        id
        lastDate
        manager
        score
        count
        tokenId
        register
      }
    }
    `
    const item = networks.filter(i=> i.symbol === getLocal('network'))[0]
    const client = createClient({
      url: item?.signInGraphUrl
    })
    const res = await client?.query(tokensQuery).toPromise()
    const registerNftInfos = res?.data?.registerInfos
    setShowNftList(Boolean(registerNftInfos?.length))
    setNftImageList(registerNftInfos)
    return registerNftInfos
  }
  const handleSignIn = async(nftAddress) => {
    const hasCreateProfile = await getProfileStatus(accounts)
    if(!Boolean(hasCreateProfile)) {
      setCanReceiveTips(true)
      return
    }
    const registerNftInfos = await getNftList(nftAddress)
    if(!registerNftInfos.length) {
      setState({
        canMint: true
      })
    } else {
      setState({
        canMint: false
      })
    }
    setShowSignIn(true)
  }
  const handleOpenSign = async(tokenAddress) => {
    try {
      setShowMask(true)
      const params = ethers.utils.defaultAbiCoder.encode(["address", "address", "string", "string"], [tokenAddress, currentAddress, "Register","register"]);
      const tx = await getDaiWithSigner(signInAddress, REGISTER_ABI).mint(currentAddress, 1, params)
      const receipt = await tx.wait()
      console.log("Transaction hash:", receipt.transactionHash)
      console.log("Gas used:", receipt.gasUsed.toString())
      console.log("Block number:", receipt.blockNumber)
      console.log("Block hash:", receipt.blockHash)
      setShowOpenSignIn(false)
      setHasOpenedSignIn(true)
      setShowMask(false)
    } catch (error) {
      history.push()
      const state = {
        address: currentAddress,
        network: getLocal('network'),
        currentIndex: 0,
        name: currentRoomName
      }
      history.push('/chat', state)
      console.error(error, 'handleOpenSign')
    }
  }
  const handleEndStake = async(isOpenAutoCheckIn) => {
    const tx = isOpenAutoCheckIn ? await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).receivesAuto() : await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).receives()
    setShowSignIn(false)
    setShowMask(true)
    await tx.wait()
    getCurrentBalance(ACCOUNT)
    setState({
      canMint: true,
      hasEndStack: true
    })
    setShowMask(false)
  }
  const handleAutoCheckIn = async() => {
    setShowHandlingFee(true)
    setHandlingFeeTips(intl.get('OpenAutoCheckInTips'))
  }
  const handleCheckIn = async(token, tokenId, quantity) => {
    setShowSignIn(false)
    setState({
      canMint: false
    })
    setShowMask(true)
    try {
      const valueE = +token === 0 ? ethers.utils.parseEther(quantity) : 0
      const tx = await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).checkin(tokenId, ethers.utils.parseEther(quantity), {value: valueE})
      await tx.wait()
      setShowMask(false)
    } catch(err) {
      console.log(err, '--->>')
      setShowMask(false)
    }
  }
  const handleCloseSignIn = () => {
    setShowSignIn(false)
    setState({
      canMint: false,
      canUnstake: false,
      allowanceTotal: ''
    })
  }
  const fetchPublicGroupList = async() => {
    const groupList = await getPublicGroupList()
    const cacheGroupList = await getCachePublicGroup()
    const compareResult = await compareGroup(groupList, cacheGroupList)
    const { hasNewMsgGroup, result } = compareResult
    debugger
    const address = ROOM_ADDRESS || currentAddress || GROUP_ADDRESS || currentAddressRef.current
    const foundGroup = result?.find(group => group.id === address?.toLowerCase() && group.newChatCount > 0)
    console.log(foundGroup, 'compareResult===', address)
    if (foundGroup) {
      await getCurrentGroupChatList(address)
    }
    if(hasNewMsgGroup?.length > 0 && !searchGrouName ) {
      // setCacheGroup(result, currentTabIndex)
      setState({
        groupLists: result?.length > 0 ? [...result] : []
      })
    }
  }
  const startIntervalGroup = () => {
    groupTimer.current = setInterval(() => {
      fetchPublicGroupList()
    }, 20000)
  }
  const handleMint = async(quantity, token) => {
    setShowNftList(false)
    if(!quantity) {
      setState({
        continueMint: false
      })
      return
    } else {
      setState({
        continueMint: true
      })
    }

    const valueE = token === 'ETHF' ? ethers.utils.parseEther(quantity) : 0
    const tx = await getDaiWithSigner(globalNftAddress, SIGN_IN_ABI).mint(ethers.utils.parseEther(quantity),{value: valueE})
    setShowSignIn(false)
    setShowMask(true)
    await tx.wait()
    setShowMask(false)
  }
  const hanldeLinkRedEnvelop = async(id) => {
    const item = await getCurrentNetworkInfo()
    const version = item.versionList[RED_PACKET_VERSION]
    const hasReceived = await getReceivedStatus(version,id)
    setCurrentGiveAwayVersion(version)
    if(hasReceived) {
      setShowTips(true)
      setTipsText(intl.get('ReceivedText'))
    } else {
      const receiveReject = await receiveRejectStatus(version, id)
      if(!receiveReject) return
      setShowRedEnvelope(true)
    }
  }
  useEffect(() => {
    // console.log(history.location, 'history.location===6')
    if(hasCreateRoom && redEnvelopId) {
      setShowRedEnvelope(true)
    }
    if(hasCreateRoom) {
      getInitChatList(currentAddress)
    }
  }, [hasCreateRoom])
  useEffect(() => {
    if(accounts) {
      setCurrentAddress('')
      setShowChat(false)
      setMyAddress(accounts)
    }
    setMyAddress(ACCOUNT)
    return () => {
      window.removeEventListener('scroll', throttle(handleScroll, 500), true)
    }
  }, [accounts])
  useEffect(() => {
    if(RED_PACKET_ID) {
      hanldeLinkRedEnvelop(RED_PACKET_ID)
    }
  }, [RED_PACKET_ID])
  useEffect(() => {
    if(currentChatInfo?.id) {
      showChatList(currentChatInfo)
    }
  }, [currentChatInfo])
  useEffect(() => {
    if(showPlaceWrapper) {
      setTimeout(() => {
        setState({
          hasClickPlace: false
        })
      }, 10)
    }
  }, [showPlaceWrapper])
  useEffect(() => {
    if(!groupLists?.length && !(+getLocal('isConnect'))) {
      setRoomList([])
      setShowChat(false)
      setState({
        showHeader: true
      })
    }
  }, [getLocal('isConnect')])
  useEffect(() => {
    const address = ROOM_ADDRESS || GROUP_ADDRESS
    if(window?.ethereum) {
      getNftAddress()
    } else {
      fetchPublicChatList(address)
    }
    if(location.hash === '#p') {
      setCurrentTabIndex(1)
    }
    if(address) {
      isRoom(ROOM_ADDRESS)
      if(detectMobile()) {
        setShowChat(true)
        setState({
          showHeader: false
        })
      }
      if(!location.hash) {
        getInitChatList(address)
      }
      setCurrentAddress(address)
    }
  }, [ROOM_ADDRESS, GROUP_ADDRESS])
  useEffect(() => {
    if(!location.state && !location?.hash) {
      setCurrentAddress('')
      setShowChat(false)
    }
  }, [location])
  return(
    <div className={`chat-ui-wrapper ${!showGroupList ? 'chat-ui-wrapper-share' : ''}`}>
      {
      <Modal title={intl.get('TipsText')} visible={showTips} onClose={() => { setShowTips(false) }}>
        <div className='tip-text'>{tipsText}</div>
      </Modal>
      }
      {
        <Modal title="Tips" visible={showHandlingFee} onClose={() => { setShowHandlingFee(false) }}>
          <div>{handlingFeeTips}</div>
          <div className='btn-operate-award' style={{marginTop: '16px'}}>
            <div className='btn btn-primary' onClick={handleConfirmAutoCheckIn}>{intl.get('Confirm')}</div>
            <div className='btn btn-light' onClick={() => { setShowHandlingFee(false) }}>{intl.get('Cancel')}</div>
          </div>
        </Modal>
      }
      {
        <Modal title="Tips" visible={showCanReceiveTips} onClose={() => { setCanReceiveTips(false) }}>
          <div>{intl.get('CreateProfileTips')}</div>
          <div className='btn-operate-award' style={{marginTop: '16px'}}>
            <div className='btn btn-primary' onClick={() => {history.push(`/profile/${accounts}`)}}>{intl.get('Confirm')}</div>
            <div className='btn btn-light' onClick={() => { setShowTips(false) }}>{intl.get('Cancel')}</div>
          </div>
        </Modal>
      }
      {
        <Modal title="List of red envelopes to be claimed" visible={showEnvelopesList} onClose={() => { setShowEnvelopesList(false) }}>
          <div>{intl.get('ReceivedText')}</div>
          {
            collectedRedEnvelope.map((item,index) => {
              return(
                <div key={index}>
                  <span>{index+1}</span>
                  <span>{item.lastCount}/{item.count}</span>
                </div>
              )
            })
          }
        </Modal>
      }
      {
        showRedEnvelope &&
        <RedEnvelopeCover handleCloseRedEnvelope={() => {setShowRedEnvelope(false)}} handleReceiveConfirm={(e, id) => {handleReceiveConfirm(e, id)}}></RedEnvelopeCover>
      }
      {
        showReceiveInfo &&
        <ReceiveInfo currentRedEnvelopId={currentRedEnvelopId} currentGiveAwayVersion={currentRedPackeVersion} handleCloseReceiveInfo={() => {setShowReceiveInfo(false)}} ></ReceiveInfo>
      }
      {
        showOpenAward &&
        <Modal title={intl.get('OpenRedEnvelope')} visible={showOpenAward} onClose={() => { setShowOpenAward(false) }}>
          <div className='btn-operate-award'>
            <div className='btn btn-primary' onClick={handleOpenAward}>{intl.get('Open')}</div>
            <div className='btn btn-light' onClick={() => { setShowOpenAward(false) }}>{intl.get('Cancel')}</div>
          </div>
        </Modal>
      }
      {
        showAwardBonus && detectMobile() &&
        showAwardBonus &&
        <AwardBonus
          handleCloseAward={() => { setShowAwardBonus(false) }}
          currentAddress={currentAddress}
          handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount)}}
          handleGiveAway={(tx) => {handleGiveAway(tx)}}
        ></AwardBonus>
      }
      {
        <Modal title={intl.get('CheckIn')} visible={showSignIn} onClose={handleCloseSignIn}>
          <div className="sign-in-wrapper">
            <SignIn
              currentAddress={currentAddress}
              showNftList={showNftList}
              handleMint={(num, token) => {handleMint(num, token)}}
              handleSelectNft={(id) => {handleSelectNft(id)}}
              nftImageList={nftImageList}
              handleCheckIn={(token,id, num) => {handleCheckIn(token, id, num)}}
              handleCancelCheckin={handleCancelCheckin}
              handleEndStake={(status, isOpenAutoCheckIn) => {handleEndStake(status, isOpenAutoCheckIn)}}
              handleAutoCheckIn={handleAutoCheckIn}
            />
          </div>
        </Modal>
      }
      {
        !detectMobile() &&
        <Modal title={ intl.get('AwardBonus') } visible={showAwardBonus} onClose={handleCloseAward}>
          <AwardBonus
            handleCloseAward={() => { setShowAwardBonus(false) }}
            currentAddress={currentAddress}
            handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount)}}
            handleGiveAway={(tx) => {handleGiveAway(tx)}}
          ></AwardBonus>
        </Modal>
      }

      {
        hasClickPlace && <Loading />
      }
      {/* {
        showPlaceWrapper &&
        <div className='place-wrapper'>
          <span className='iconfont icon-guanbi' onClick={() => { setShowPlaceWrapper(false) }}></span>
          <iframe src="https://place.linke.network/" frameBorder="0" width="100%" height="100%" scrolling="no">
          </iframe>
        </div>
      } */}
      {
        showGroupMember &&
        <div className='group-member-wrap'>
          {
            showShareGroup &&
            <ShareGroupCode
              currentAddress={currentAddress}
              currentRoomName={currentRoomName}
              roomAvatar={roomAvatar}
              closeShareGroup={() => setShowShareGroup(false)}>
            </ShareGroupCode>
          }
          <div className='mask' onClick={() => { setShowGroupMember(false) }}></div>
          <GroupMember
            shareGroup={() => setShowShareGroup(true)}
            currentAddress={currentAddress}
            closeGroupMember={() => setShowGroupMember(false)}
            groupType={groupType}
            handleShowMask={() => setShowMask(true)}
            handleHiddenMask={() => setShowMask(false)}
            handlePrivateChat={(item, res) => { handlePrivateChat(item, res) }}
            hasAccess={hasAccess}
          />
        </div>
      }
      {

        showJoinRoom &&
        <Modal title={intl.get('JoinInNewRoom')} visible={showJoinRoom} onClose={() => { setShowJoinRoom(false) }}>
          <JoinRooom getCurrentRoomInfo={(address) => getCurrentRoomInfo(address)} />
        </Modal>
      }
      {
        showCreateNewRoom &&
        <Modal title={intl.get('CreateNewRoom')} visible={showCreateNewRoom} onClose={() => { setShowCreateNewRoom(false) }}>
          <CreateNewRoom createNewRoom={(address, name, currentGroupType) => createNewRoom(address, name, currentGroupType)} hiddenCreateInfo={() => { setShowCreateNewRoom(false) }} showGroupList={showGroupList}/>
        </Modal>
      }
      {
        showMask &&
        <Loading></Loading>
      }
      {
        showInfo &&
        <ShareInfo
          id='imageMask'
          isPc={detectMobile()}
          shareTextInfo={shareTextInfo}
          currentAddress={currentAddress}
          currentGroupType={currentGroupType}
          currentNetwork={currNetwork}
          closeShareInfo={() => handleClick()}>
        </ShareInfo>
      }
      {
        <div className={`chat-content-wrap ${hasAccess ? '' : 'chat-conetent-no-access'}`}>
          <div className={`chat-ui ${detectMobile() ? 'chat-ui-client' : ''} ${!showGroupList ? 'chat-ui-share' : ''}`}>
            <div className={`chat-content-box ${showChat && detectMobile() ? 'chat-content-box-client' : ''} ${!showGroupList ? 'chat-content-share' : ''}`}>
              {
                showGroupList && Boolean(+getLocal('isConnect')) &&
                <div className={`user-search-wrapper ${showChat ? 'hidden' : ''}`}>
                <div className='chat-ui-offcanvas' id='chatOffcanvas'>
                  {
                    myAddress &&
                    <div className="chat-ui-header">
                      <div className='chat-search-wrap'>
                        <SearchChat handleSearch={handleSearch}/>
                        <AddChatRoom
                          showSettingList={showSettingList}
                          onClickSetting={() => { setShowSettingList(!showSettingList) }}
                          onClickSelect={(e) => onClickSelect(e)}
                        />
                      </div>
                    </div>
                  }
                  <ChatTab changeChatType={(index) => changeChatType(index)} currentTabIndex={currentTabIndex}/>

                  <ListGroup
                    hiddenMask={() => { handleHiddenMask() }}
                    showMask={() => setShowMask(true)}
                    showChatList={(item) => showChatList(item)}
                    newGroupList={roomList}
                    searchGroup={searchGroup}
                    currentRoomName={currentRoomName}
                    hasAccess={hasAccess}
                    searchGrouName={searchGrouName}
                    currNetwork={currNetwork}
                    currentTabIndex={currentTabIndex}
                    currentAddress={currentAddress?.toLowerCase()}
                    onClickDialog={() => { setShowJoinRoom(true) }}
                    >
                  </ListGroup>
                </div>
              </div>
              }

              <div className={`tab-content ${showChat ? 'translate-tab' : ''} ${ showAwardBonus ? 'display': ''} ${ showOpenSignIn ? 'display': ''} ${Number(getLocal('isConnect')) === 0 && detectMobile() ? 'tab-content-show' : ''}`}>
                <div className='tab-pane'>
                  {
                    ((groupLists?.length > 0 && currentAddress) || showChat || ROOM_ADDRESS) &&
                    <div className={"d-flex flex-column h-100"}>
                      <RoomHeader
                        showChat={showChat}
                        currentAddress={currentAddress}
                        currentRoomName={currentRoomName}
                        memberCount={memberCount}
                        roomAvatar={roomAvatar}
                        currentTabIndex={currentTabIndex}
                        getGroupMember={() => {setShowGroupMember(true)}}
                        hiddenChat={hiddenChat}
                        showGroupList={showGroupList}
                      />
                      <div
                        className={`chat-conetent ${detectMobile() ? 'chat-conetent-client' : ''}`}
                        id="chatConetent"
                      >
                        {/* <div className='bottom-envelope-list' onClick={() => {setShowEnvelopesList(true)}}>
                          <img src={packetImg} alt="" style={{ 'width': '40px' }} />
                        </div> */}
                        <ChatContext
                          currentGiveAwayVersion={currentRedPackeVersion}
                          getScrollParent={() => this.scrollParentRef}
                          currentAddress={currentAddress}
                          chatList={chatList}
                          hasDecrypted={hasDecrypted}
                          hasMore={hasMore}
                          myAddress={myAddress}
                          currentTabIndex={currentTabIndex}
                          sendSuccess={sendSuccess}
                          handleReceive={(e, v) => handleReceive(e, v)}
                          loadingData={() => loadingData()}
                          handleDecryptedMessage={(id, text) => handleDecryptedMessage(id, text)}
                          shareInfo={(e, v) => shareInfo(e, v)}
                          // shareToTwitter={(e, v) => shareToTwitter(e, v)}
                        />

                        <div style={{ float: "left", clear: "both" }}
                          ref={messagesEnd}>
                        </div>
                      </div>
                      {
                        ((hasAccess || +currentTabIndex === 1) || (canSendText && +currentGroupTypeRef.current === 3)) &&
                        <ChatInputBox
                          currentAddress={currentAddress}
                          startChat={(text) => startChat(text)}
                          clearChatInput={clearChatInput}
                          hasOpenedSignIn={hasOpenedSignIn}
                          currentTabIndex={currentTabIndex}
                          handleShowPlace={() => { setShowPlaceWrapper(true) }}
                          handleAwardBonus={handleAwardBonus}
                          handleOpenSign={(tokenAddress) => handleOpenSign(tokenAddress)}
                          handleSignIn={(nftAddress) => { handleSignIn(nftAddress) }}
                          resetChatInputStatus={() => { setClearChatInput(false) }}
                        ></ChatInputBox>
                      }
                      {
                        !hasAccess && +currentGroupTypeRef.current !== 3 && +currentTabIndex !== 1 &&
                        <JoinGroupButton hasAccess={hasAccess} currentAddress={currentAddress} changeJoinStatus={(groupType) => changeJoinStatus(groupType)} chainId={chainId} />
                      }
                    </div>
                  }
                  {
                    (roomList.length === 0 || !currentAddress) &&
                    <div>
                      <Introduction myAddress={myAddress} onClickDialog={onClickDialog}
                        connectWallet={() => connectWallet()}></Introduction>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
