import React, { useEffect, useState, useRef } from 'react'
import './chat.scss'
import 'emoji-mart/css/emoji-mart.css'
import { createClient } from 'urql'
import Loading from '../../component/Loading'
import ListGroup from './GroupList'
import ChatInputBox from './ChatInputBox'
import Introduction from './Introduction'
import ChatTab from './ChatTab'
import ShareInfo from './ShareInfo'
import CreateNewRoom from './CreateNewRoom'
import JoinRooom from './JoinRoom'
import useGroupMember from '../../hooks/useGroupMember'
import useDataBase from '../../hooks/useDataBase'
import { ethers } from "ethers"
import { detectMobile, throttle } from '../../utils'
import { setLocal, getLocal, getDaiWithSigner } from '../../utils/index'
import { PUBLIC_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI} from '../../abi/index'
import localForage from "localforage"
import Modal from '../../component/Modal'
import SearchChat from './SearchChat'
import AddChatRoom from './AddChatRoom'
import RoomHeader from './RoomHeader'
import ChatContext from './ChatContext'
import GroupMember from './GroupMember'
import JoinGroupButton from './JoinGroupButton'
import useChain from '../../hooks/useChain'
import { useHistory } from 'react-router-dom'
import useGlobal from '../../hooks/useGlobal'
import * as zango from "zangodb";


export default function Chat() {
  const { getChainInfo } = useChain()
  const { collection, setDataBase } = useDataBase()
  const history = useHistory()
  const { getGroupMember } = useGroupMember()
  const timer = useRef()
  const allTimer = useRef()
  const messagesEnd = useRef(null)
  const {groupLists, setState, hasClickPlace, hasQuitRoom, networks, accounts} = useGlobal()
  const [memberListInfo, setMemberListInfo] = useState([])
  const [currentGraphApi, setCurrentGraphApi] = useState()
  const [currentAddress, setCurrentAddress] = useState()
  const currentAddressRef = useRef(null)
  const [memberCount, setMemberCount] = useState()
  const [myAddress, setMyAddress] = useState()
  const [currentRoomName, setCurrentRoomName] = useState()
  const [hasAccess, setHasAccess] = useState()
  const [chatList, setChatList] = useState([])
  const [showJoinGroupButton, setShowJoinGroupButton] = useState()
  const chatListRef = useRef()
  const [hasScroll, setHasScroll] = useState(false)
  const hasScrollRef = useRef(null)
  const [hasNotice, setHasNotice] = useState(false)
  const [showMask, setShowMask] = useState(false)
  const [showGroupMember, setShowGroupMember] = useState(false)
  const [currNetwork, setCurrNetwork] = useState()
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showCreateNewRoom, setShowCreateNewRoom] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [hasToBottom, setHasToBottom] = useState(true)
  const [showPlaceWrapper, setShowPlaceWrapper] = useState(false)
  const [shareTextInfo, setShareTextInfo] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showSettingList, setShowSettingList] = useState(false)
  const [currentIndex, setCurrentIndex] = useState()
  const [roomList, setRoomList] = useState([])
  const roomListRef = useRef()
  const [clearChatInput, setClearChatInput] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [chatListStatus, setChatListStatus] = useState(new Map())
  const [showOperate, setShowOperate] = useState(false)
  const [sendSuccess,setSendSuccess] = useState(false)
  const [dialogType, setDialogType] = useState()
  const [currentTabIndex, setCurrentTabIndex] = useState()
  const [roomAvatar, setRoomAvatar] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [myPublicKey, setMyPublicKey] = useState()
  const [myAvatar, setMyAvatar] = useState()
  const [hasDecrypted, setHasDecrypted] = useState(false)
  const [hasChatCount, setHasChatCount] = useState(false)
  const [currentGroupType, setCurrentGroupType] = useState()
  const [groupList, setGroupLists] = useState()
  const groupListRef = useRef()
  const [manager, setManager] = useState()
  const [canSendText, setCanSendText] = useState()
  const [groupType, setGroupType] = useState()
  const currentGroupTypeRef = useRef()
  const hasAccessRef = useRef()
  const showJoinGroupButtonRef = useRef()
  useEffect(() => {
    if(hasQuitRoom) {
      setShowMask(false)
      setState({
        currentAddress: ''
      })
      setCurrentAddress()
    }
  }, [hasQuitRoom])
  useEffect(()=>{
    currentAddressRef.current = currentAddress
    hasScrollRef.current = hasScroll
    roomListRef.current = roomList
    chatListRef.current = chatList
    currentGroupTypeRef.current = currentGroupType
    hasAccessRef.current = hasAccess
    showJoinGroupButtonRef.current = showJoinGroupButton
  }, [currentAddress, hasScroll, roomList, chatList, currentGroupType, hasAccess, showJoinGroupButton])
  useEffect(() => {
    groupLists?.map(item => {
      startInterval(item.id)
    })
   
    if(groupLists?.length) {
      setGroupLists([...groupLists])
    }
    groupListRef.current = groupLists
  }, [currentTabIndex, groupLists])
  useEffect(() => {
    if(currentTabIndex === 1) {
      getMyAvatar()
      localForage.getItem('publicKeyList').then(res => {
        const key = res && res[getLocal('account')]
        if(!key) {
          getMyPublicKey()
        }
      })
    }
    setState({
      currentAddress: ''
    })
    setCurrentAddress()
  }, [currentTabIndex])
  const getMyAvatar = async () => {
    const tokensQuery = `
    query{
      profile(id: "`+ getLocal('account').toLowerCase() + `"){
        name,
        avatar,
      }
    }
    `
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    setMyAvatar(res.data?.profile?.avatar)
    console.log(res, res.data?.profile?.avatar,'getMyAvatar====')
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
    debugger
    window.ethereum
    .request({
      method: 'eth_getEncryptionPublicKey',
      params: [getLocal('account')], // you must have access to the specified account
    })
    .then((result) => {
      console.log(result, '===getMyPublicKey==')
      setMyPublicKey(result)
      localForage.getItem('publicKeyList').then(res => {
        if(res) {
          res[getLocal('account')] = result
          localForage.setItem('publicKeyList', res)
        } else {
          const obj = {}
          obj[getLocal('account')] = result
          localForage.setItem('publicKeyList', obj)
        }
      })
      console.log(result, 'getMyKey=====')
    })
  }
  const getManager = async(id, type) => {
    debugger
    if(type == 3) return
    const tx = await getDaiWithSigner(id, PUBLIC_GROUP_ABI).profile()
    const canSendText = tx.manager?.toLowerCase() == getLocal('account')?.toLowerCase()
    setManager(tx.manager)
    setCanSendText(canSendText)
    debugger
    if(!canSendText || !hasAccess) {
      setShowJoinGroupButton(true)
    } else {
      setShowJoinGroupButton(false)
    }
    console.log(tx, manager?.toLowerCase() == getLocal('account')?.toLowerCase(), 'tx===manager')
  }
  const getPrivateChatStatus = async (id) => {
    const networkInfo = await getChainInfo()
    const res = await getDaiWithSigner(networkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(id)
    setPrivateKey(res)
    console.log(res, 'getPrivateChatStatus=====')
  }
  const initRoomAddress = () => {
    let data = history.location?.state
    console.log(data, '===initRoomAddress')
    if(data) {
      const {currentIndex, address, name , avatar, privateKey} = data
      setCurrentTabIndex(currentIndex)
      setCurrentAddress(address)
      setState({
        currentAddress: address
      })
      setPrivateKey(privateKey)
      setCurrentRoomName(name)
      setRoomAvatar(avatar)
      return
    } else {
      setCurrentTabIndex(0)
    }
    const path = history.location.pathname.split('/chat/')[1]
    const address = path?.split('/')[0]
    const network = path?.split('/')[1]
    if(network) {
      setState({
        currNetwork: network
      })
    }
    if (address) {
      setCurrentAddress(address)
      setState({
        currentAddress: address
      })
      isRoom(address)
    }
  }
  const updateGroupList = (name, roomAddress, type) => {
    debugger
    console.log(groupLists, groupListRef.current,'==updateGroupList==')
    const index = groupListRef.current?.findIndex(item => item.id.toLowerCase() == roomAddress.toLowerCase())
    const groupList = [...groupListRef.current]
    if(index === -1) {
      groupList.push({
        id: roomAddress,
        name: name,
        chatCount: 0,
        newChatCount: 0,
        _type: type
      })
      localForage.getItem('chatListInfo').then(res => {
        debugger
        let chatListInfo = res ? res : {}
        const list = Object.keys(chatListInfo)
        const currentNetwork = getLocal('currentNetwork')
        chatListInfo[currentNetwork] = list.length ? chatListInfo[currentNetwork] : {}
        chatListInfo[currentNetwork][getLocal('account')] =  chatListInfo[currentNetwork][getLocal('account')] ? chatListInfo[currentNetwork][getLocal('account')] : {}
        chatListInfo[currentNetwork][getLocal('account')]['publicRooms'] = [...groupList]
        localForage.setItem('chatListInfo', chatListInfo)
      })
      setRoomList(groupList)
      setState({
        groupLists: groupList
      })
    }
  }
  const isRoom = async (roomAddress) => {
    try {
      debugger
      console.log(groupListRef.current, 'groupListRef.current======')
      const index = groupLists.findIndex(item => item.id.toLowerCase() == roomAddress)
      if(index > 0) return
      debugger
      if(!getLocal('isConnect')) {
        const path = history.location.pathname.split('/chat/')[1]
        var currentNetwork = path?.split('/')[1]
        var networkInfo = networks.filter(i=> i.name === currentNetwork)[0]
        setLocal('currentGraphqlApi', networkInfo?.APIURL)
        setLocal('currentNetwork', currentNetwork)
      }
      const groupInfo = await getGroupMember(roomAddress, networkInfo?.APIURL)
      const groupType = groupInfo?._type
      setGroupType(groupType)
      if(groupType == 3) {
        var { name } = await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).groupInfo()
      } else {
        var { name } = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).profile()
      }
      console.log(name, '====....')
      updateGroupList(name, roomAddress, groupType)
      getJoinRoomAccess(roomAddress, groupType)
      setCurrentRoomName(name)
      getInitChatList(roomAddress)
      initCurrentAddress(roomAddress)
    }
    catch (e) {
      console.log(e, 'err====')
      setShowMask(false)
      if (!hasNotice) {
        alert('This is not a chat room.')
        setHasNotice(true)
        setShowMask(false)
      }
      return false
    }
    setShowMask(false)
  }
  const getJoinRoomAccess = async(roomAddress, groupType) => {
    try {
      debugger
      if(groupType == 1 || groupType == 2) {
        var res = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).balanceOf(getLocal('account'))
      } 
      if(groupType == 3) {
        var res = await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).managers(getLocal('account'))
        console.log(res, '=getDaiWithSigner==')
      }
      const hasAccess= ethers.BigNumber.from(res) > 0
      setHasAccess(hasAccess)
      if(!Boolean(hasAccess)) {
        setShowJoinGroupButton(true)
      }
      console.log(hasAccess,  hasAccessRef.current, showJoinGroupButton, showJoinGroupButtonRef.current, Boolean(hasAccess), 'hasAccess======')
    } catch(error) {
      console.log(error, '===error==')
    }
  }
  const fetchPublicChatList = async(roomAddress) => {
    const tokensQuery = `
    query{
      chatInfos(orderBy:block,orderDirection:desc, first:20, where:{room: "`+ roomAddress?.toLowerCase() + `"}){
        id,
        transaction,
        sender,
        block,
        index,
        chatText,
        room
      }
    }
    `

    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    // debugger
    const data = await client.query(tokensQuery).toPromise()
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    const chatList = data?.data?.chatInfos || []
    console.log(chatList, res, 'chatList=====>>>')
    const result = formateData(chatList)
    if(roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
      debugger
      setChatList(res || result)
    }
    insertData(result)
    getMemberList(roomAddress, result)
  }

  const insertData = async(datas) =>{
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    for (let i = 0; i < datas?.length; i++) {
      datas[i].block = parseInt(datas[i].block)
      collection.findOne({id:datas[i].id}).then((doc) => {
        if (doc) {
          collection.update({id:datas[i].id}, {$set: datas[i]})
        } else {
          collection.insert(datas[i])
        }
      })
    }
  }

  const initCurrentAddress = (list) => {
    clearInterval(timer.current)
    clearInterval(allTimer.current)
    setCurrentAddress(list)
    setState({
      currentAddress: list
    })
    setChatList([])
  }
  const getCurrentRoomInfo = (roomAddress) => {
    setShowJoinRoom(false)
    setHasScroll(false)
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
    setChatList([])
    setChatListStatus(new Map())
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
      console.log(e.target.id, 'e.target.id=====e.target.id')
      if (e.target.id === 'chatItem') {
        setShowOperate(false)
      }
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
  const showChatList = (e, item, list) => {
    setChatList([])
    clearInterval(timer.current)
    clearInterval(allTimer.current)
    setRoomAvatar(item.avatar)
    console.log(item, 'item=====')
    getInitChatList(item.id, item.avatar)
    setCurrentGroupType(item._type)
    if(currentTabIndex === 1) {
      getPrivateChatStatus(item.id)
    }
    startInterval(item.id)
    setMemberCount()
    setHasMore(true)
    history.push(`/chat/${item.id}`)
    setCurrentAddress(item.id)
    setState({
      currentAddress: item.id
    })
    if(currentTabIndex === 0) {
      // getMemberCount(item.id)
      getManager(item.id, item._type)
      handleReadMessage(item.id)
      getJoinRoomAccess(item.id, item._type)
    }
    setCurrentRoomName(item.name)
    setShowChat(true)
    setShowMask(true)
    setHasScroll(false)
  }
  const loadingGroupData = async() => {
    debugger
    const firstBlock = chatList && chatList[chatList.length-1]?.block
    if(!firstBlock) return
    const client = createClient({
      url: currentGraphApi
    })
    const tokensQuery = `
    query{
      chatInfos(orderBy:block,orderDirection:desc, first:20, where:{room: "`+ currentAddressRef?.current?.toLowerCase() + `", block_lt: ` + firstBlock + `}){
        id,
        transaction,
        sender,
        block,
        chatText,
        room,
        index
      }
    }
    `
    const data = await client.query(tokensQuery).toPromise()
    console.log(data, 'loading=data=')
    const loadingList = data?.data?.chatInfos || []
    console.log(loadingList, 'loadingList====')
    if(loadingList.length < 20) {
      setHasMore(false)
    }
    const fetchData = loadingList && loadingList.map((item) => {
      return {
        ...item,
        hasDelete: false,
        isSuccess: true,
        showProfile: false,
        position: (item.sender).toLowerCase() === (myAddress)?.toLowerCase(),
        showOperate: false,
      }
    })
    
    const newfetchData = await addAvatarToList(fetchData)
    insertData(newfetchData)
    if(chatListRef.current.length) {
      const list = [...chatListRef.current]
      console.log(newfetchData, 'newfetchData===')
      console.log(fetchData, list, memberListInfo, '====fetchData')
      const result = list.concat(newfetchData)
      debugger
      setChatList(result)
    }
    console.log(fetchData, 'chatList.length')
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
    const myAddress = getLocal('account')?.toLowerCase()
    const tokensSenderQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{sender: "`+ myAddress +`", to: "`+ currentAddressRef?.current?.toLowerCase() + `",block_lt: ` + firstBlock + `}){
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
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{to: "`+ myAddress +`", sender: "`+ currentAddressRef?.current?.toLowerCase() + `",block_lt: ` + firstBlock + `}){
        id,
        sender,
        block,
        to,
        chatText,
        chatTextSender
      }
    }
    `
    const currentList = await formateCurrentPrivateList(tokensSenderQuery, tokensReceivedrQuery, currentAddressRef?.current?.toLowerCase())
    if(currentList.length < 40) {
      setHasMore(false)
    }
    const list = [...chatListRef.current]
    setChatList(currentList.concat(list))
    insertData(currentList)
  }
  const formateData = (list) => {
    const result = list && list.map((item) => {
      return {
        ...item,
        hasDelete: false,
        isSuccess: true,
        showProfile: false,
        position: (item.sender).toLowerCase() === (myAddress)?.toLowerCase(),
        showOperate: false,
      }
    })
    return result
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
        avatar: type === 1 ? myAvatar : (avatar || roomAvatar)
      }
    })
    return data
  }

  const fetchPrivateChatList = async(toAddress, avatar) => {
    // setRoomAvatar(avatar)
    const myAddress = getLocal('account')?.toLowerCase()
    const tokensSenderQuery = `
    query{
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{sender: "`+ myAddress +`", to: "`+ toAddress?.toLowerCase() + `"}){
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
      encryptedInfos(orderBy:block,orderDirection:desc, first:20, where:{to: "`+ myAddress +`", sender: "`+ toAddress?.toLowerCase() + `"}){
        id,
        sender,
        block,
        to,
        chatText,
        chatTextSender
      }
    }
    `
    try{
      const currentList = await formateCurrentPrivateList(tokensSenderQuery, tokensReceivedrQuery, toAddress, avatar)
      setChatList(currentList)
      insertData(currentList)
      setShowMask(false)
      console.log(currentList, 'currentList=====')
    } catch(error) {
      console.log(error, '====')
      setShowMask(false)
    }
  }
  const formateCurrentPrivateList = async(tokensSenderQuery, tokensReceivedrQuery, toAddress, avatar) => {
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const resSender = await client.query(tokensSenderQuery).toPromise()
    const resReceived = await client.query(tokensReceivedrQuery).toPromise()
    const senderInfo = formatePrivateData(resSender, toAddress, avatar, 1)
    const receivedInfo =  formatePrivateData(resReceived, toAddress, avatar, 2)
    const privateChatList = [...senderInfo, ...receivedInfo]
    const currentList = privateChatList.sort(function (a, b) { return b.block - a.block; })
    return currentList
  }
  const getInitChatList = async(toAddress, avatar) => {
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    const res = await collection?.find({room: toAddress}).project({}).sort({ block: -1 }).toArray()
    if(!res || res?.length === 0) {
      // debugger
      if(currentTabIndex == 0) {
        fetchPublicChatList(toAddress)
      } 
      if(currentTabIndex == 1) {
        fetchPrivateChatList(toAddress, avatar)
      }
    } else {
      // debugger
      if(toAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
        console.log(res, chatList, 'getInitChatList=====>>>')
        // debugger
        setChatList(res)
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
  const startChat = async (chatText) => {
    setSendSuccess(false)
    try {
      if(currentTabIndex === 1) {
        debugger
        const networkInfo = await getChainInfo()
        const myPublicKey = await localForage.getItem('publicKeyList').then(res => {
          return res[myAddress]
        })
        const encryptedMessage = getencryptedMessage(chatText, privateKey)
        const encryptedSenderMessage = getencryptedMessage(chatText, myPublicKey)
        console.log(encryptedSenderMessage, encryptedMessage, 'encryptedMessage====')
        console.log(privateKey, myPublicKey)
        var tx = await getDaiWithSigner(networkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).send(currentAddress, encryptedMessage, encryptedSenderMessage, 'msg')
      }
      if(currentTabIndex === 0 ) {
        const groupInfo = await getGroupMember(currentAddress)
        const groupType = groupInfo?._type
        setGroupType(groupType)
        const abi = groupType == 3 ? PUBLIC_SUBSCRIBE_GROUP_ABI : PUBLIC_GROUP_ABI
        debugger
        var tx = await getDaiWithSigner(currentAddress, abi).send(chatText, 'msg')
      }
      setClearChatInput(true)
      console.log(tx, 'tx===123')
      var newChat = {
        id: tx.hash,
        block: 0,
        transaction: tx.hash,
        chatText: chatText,
        sender: myAddress,
        position: true,
        hasDelete: false,
        isSuccess: false,
        showProfile: false,
        showOperate: false,
        avatar: myAvatar
      }

      chatList.unshift(newChat)
      getMemberList(currentAddress, chatList)
      // setChatList(chatList)
      console.log(chatList, 'chatList====123')
      let callback = await tx.wait()

      console.log('callback', callback)
      if (callback?.status === 1) {
        const index = chatList?.findIndex((item) => item.id.toLowerCase() == tx.hash.toLowerCase())
        const sendIndex = memberListInfo?.findIndex((item) => item.id.toLowerCase() == tx.from.toLowerCase())
        console.log(chatList[index], '==callback==')
        chatList[index].isSuccess = true
        chatList[index].block = callback?.blockNumber
        chatList[index].avatar = currentTabIndex === 0 ? memberListInfo[sendIndex]?.profile?.avatar : myAvatar
        chatList[index].isDecrypted = true
        setChatListState(chatList)
        console.log(chatList, '====change')
        const db = await setDataBase()
        const collection = db.collection('chatInfos')
        newChat.isSuccess = true
        newChat.block = String(callback?.blockNumber)
        newChat.avatar = currentTabIndex === 0 ? memberListInfo[sendIndex]?.profile?.avatar : myAvatar
        newChat.room = currentAddress
        newChat.isDecrypted = true
        collection.insert(newChat)
        console.log(newChat, 'newChat====>>.')
      }
    } catch (error) {
      console.log(error, 'error==')
    }

  }
  
  const setChatListState = (chatList, address) => {
    if (address === currentAddress || !address) {
      if (!chatList || chatList === {}) {
        setChatList([])
      } else {
        let list = new Map(Object.entries(chatList))
        let that = this
        list.forEach(function (v, k) {
          chatListStatus.set(k, v)
        })
        const chatLists = hasScroll ? chatList : [...chatListStatus.values()]
        debugger
        setChatList(chatLists)
      }
    }
    console.log(chatList, 'chatLists=====')
    setShowMask(false)
  }
  const handleScroll = () => {
    // debugger
    setHasScroll(true)
  }
  const startInterval = (currentAddress) => {
    let index = groupLists && groupLists.findIndex((item) => item.id.toLowerCase() == currentAddress.toLowerCase())
    const groupList = [...groupLists]
    let newRoomList = groupList.splice(index, 1)
    groupList.unshift(newRoomList[0])
    clearInterval(allTimer.current)
    allTimer.current = setInterval(() => {
      for (let i = 0; i < groupList.length; i++) {
        getCurrentChatList(groupList && groupList[i]?.id)
      }
    }, 20000)
  }
  const handleReadMessage = (roomAddress) => {
    localForage.getItem('chatListInfo').then(res => {
      console.log(res, 'res===>>updateUnreadNum')
      const publicRooms = res && res[currNetwork]?.[getLocal('account')]?.['publicRooms']
      const index = publicRooms?.findIndex(item => item.id == roomAddress?.toLowerCase())
      if(index > -1) {
        publicRooms[index]['newChatCount'] = 0
        res[currNetwork][getLocal('account')]['publicRooms'] = [...publicRooms]
        localForage.setItem('chatListInfo', res)
        setRoomList(publicRooms)
      }
    })
  }
  const getUserAvatar = async(newList) => {
    let list = []
    const ids = newList?.map(item => item.sender)
    console.log(ids, '=====>>>>ids')
    if(!ids?.length) return
    const idsList = '"' + ids.join('","')+ '"'
    const tokensQuery = `
    query{
      profiles(where:{id_in: [`+idsList+`]}){
        id,
        name,
        avatar,
        tokenId
      }
    }`
    const client = createClient({
      url: getLocal('currentGraphqlApi')
    })
    const res = await client.query(tokensQuery).toPromise()
    console.log(res, 'memberListInfo=====')
    newList?.map(item => {
      res?.data?.profiles?.map(info => {
         if(item?.sender?.toLowerCase() == info?.id?.toLowerCase()) {
           list.push({
             ...item,
             avatar: info?.avatar
           })
         }
       })
     })
    return list
  }
  const addAvatarToList = async(newList) => {
    let list = []
    console.log(memberListInfo, newList, '=====>>>.addAvatarToList')
    newList?.map(item => {
     memberListInfo?.map(info => {
        if(item?.sender?.toLowerCase() == info?.id?.toLowerCase()) {
          list.push({
            ...item,
            avatar: info.profile.avatar
          })
        }
      })
    })
    return list
  }
  const updateUnreadNum = (roomAddress, res) => {
    console.log(res, '====>>>1')
    const currentList = res
    localForage.getItem('chatListInfo').then(res => {
      console.log(res, 'res===>>updateUnreadNum')
      const publicRooms = res && res[currNetwork]?.[getLocal('account')]?.['publicRooms']
      const index = publicRooms?.findIndex(item => item.id == roomAddress?.toLowerCase())
      if(index > -1) {
        publicRooms[index]['newChatCount'] = +currentList[0]?.index - publicRooms[index]?.chatCount || 0
        const roomType = currentTabIndex === 0 ? 'publicRooms' : 'privateRooms'
        res[currNetwork][getLocal('account')][roomType] = [...publicRooms]
        localForage.setItem('chatListInfo', res)
        setRoomList(publicRooms)
        console.log(publicRooms, res, 'publicRooms====')
      }
    })
  }
  const getCurrentGroupChatList = async(client, roomAddress) => {
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    updateUnreadNum(roomAddress, res)
    console.log(res, '=====>>>res')
    const lastBlock = res?.length && +res[0]?.block + 1
    console.log(roomAddress, lastBlock, res[0]?.index, 'getCurrentGroupChatList')
    // if(!lastBlock || chatListRef.current[0]?.block == 0) return
    console.log(lastBlock, 'lastBlock=====1')
    const tokensQuery = `
        query{
          chatInfos(orderBy:block,orderDirection:desc, where:{room: "`+ roomAddress?.toLowerCase() +`", block_gte: ` + lastBlock + `}){
            id,
            transaction,
            sender,
            block,
            chatText,
            room,
            index
          }
        }
      `
      const data = await client.query(tokensQuery).toPromise()
      const newList = data?.data?.chatInfos && formateData(data?.data?.chatInfos)
      const formatList = await getUserAvatar(newList)
      console.log(newList, formatList, 'formatList---')
      const list = [...chatListRef.current]
      collection.insert(formatList,(error) => {
        updateNewList(roomAddress, collection)
        if (error) { throw error; }
      })
      if(roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && newList?.length) {
        debugger
        setChatList(formatList.concat(list))
      }
      console.log(roomAddress, newList, groupLists, 'newList====')
      console.log(chatList, 'getCurrentChatList====')
  }
  const updateNewList = async(roomAddress, collection) => {
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    const index = groupListRef.current?.findIndex(item => item.id.toLowerCase() == roomAddress)
    console.log(res,+res[0]?.index - Number(groupLists[index]?.chatCount), roomAddress, groupLists,'1====>>.')
    if(index > -1) {
      groupListRef.current[index] = {
        ...groupListRef.current[index],
        newChatCount: +res[0]?.index - Number(groupListRef.current[index]?.chatCount)
      }
      setHasChatCount(true)
    }
    
    console.log(groupLists, index, roomAddress, 'index====>>>')
    setRoomList(groupLists)
  }
  const getCurrentChatList = async (roomAddress) => {
    // debugger
    const networkInfo = await getChainInfo()
    console.log(chatList,chatListRef.current, roomAddress, currentTabIndex,'chatList===1>>>>')
    // const lastBlock = chatListRef.current.length && +chatListRef.current[0]?.block + 1
    // if(!lastBlock || chatListRef.current[0]?.block == 0) return
    // console.log(lastBlock, 'lastBlock=====1')
    // let db = new zango.Db('mydb', 1,{chatInfos:['id']});
    // let collection = db.collection('chatInfos');
    
    const client = createClient({
      url: networkInfo?.APIURL
    })
    if(currentTabIndex === 0) {
      getCurrentGroupChatList(client, roomAddress)
    }
    if(currentTabIndex === 1) {
      getCurrentPrivateChatList(roomAddress)
    }
  }
  const getCurrentPrivateChatList = async(roomAddress) => {
    const lastBlock = chatListRef.current.length && +chatListRef.current[0]?.block + 1
    if(!lastBlock || chatListRef.current[0]?.block == 0) return
    console.log(lastBlock, roomAddress, 'lastBlock=====1')
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
      setChatList(currentList.concat(list))
    }
    insertData(currentList)
    console.log(currentList, 'formateCurrentPrivateList====')
  }
  const getMemberList = async(roomAddress, chatList) => {
    if(currentTabIndex === 1) return
    const data = await getGroupMember(currentAddressRef?.current)
    const memberListInfo = data?.users
    setMemberListInfo(memberListInfo)
    const list = [...chatList]
    let result = []
    chatList.map(item => {
     memberListInfo?.map(info => {
        if(item?.sender?.toLowerCase() == info?.id?.toLowerCase()) {
          result.push({
            ...item,
            avatar: info.profile.avatar
          })
        }
      })
    })
    if(roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
      debugger
      insertData(result)
      setChatList(result)
    }
    setShowMask(false)
    console.log(hasScrollRef.current, 'hasScrollRef.current====')
    // startInterval(roomAddress, list)
    console.log(data, chatList, result,'initChatList====')
    console.log(result, 'result===')
  }
  const handleHiddenMask = () => {
    setShowMask(false)
  }
  const getDecryptedMessage = async(id, message) => {
    debugger
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    setHasDecrypted(false)
    window.ethereum
    .request({
      method: 'eth_decrypt',
      params: [message, getLocal('account')]
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
      insertData()
      setChatList(chatList)
      console.log('The decrypted message i====:', chatList, decryptedMessage)
      }
    )
    .catch((error) => console.log(error.message));
  }
  const changeJoinStatus = (groupType) => {
    debugger
    if(groupType == 1 || groupType == 2) {
      setHasAccess(true)
    } else {
      getManager(currentAddress, groupType)
    }
  }
  const handleDecryptedMessage = (id, text) => {
    getDecryptedMessage(id, text)
  }
  const handlePrivateChat = (item, res) => {
    setCurrentTabIndex(1)
    setShowGroupMember(false)
    debugger
    console.log(item)
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
  useEffect(() => {
    console.log(accounts, 'accounts====')
    if(accounts) {
      setMyAddress(accounts)
    }
    initRoomAddress()
    setMyAddress(getLocal('account'))
    return () => {
      clearInterval(timer.current)
      clearInterval(allTimer.current)
      window.removeEventListener('scroll', throttle(handleScroll, 500), true)
    }
  }, [getLocal('account'), accounts])
  useEffect(() => {
    if(showPlaceWrapper) {
      setTimeout(() => {
        setState({
          hasClickPlace: false
        })
      }, 10)
    }
  }, [showPlaceWrapper])

  return(
    <div className="chat-ui-wrapper">
      {
        hasClickPlace && <Loading />
      }
      {
        showPlaceWrapper &&
        <div className='place-wrapper'>
          <span className='iconfont icon-guanbi' onClick={() => {setShowPlaceWrapper(false)}}></span>
          <iframe src="https://place.linke.network/" frameBorder="0" width="100%" height="100%" scrolling="no">
          </iframe>
        </div>
      }


        {
          showGroupMember &&
          <div className='group-member-wrap'>
            <div className='mask' onClick={() => { setShowGroupMember(false)}}></div>
            <GroupMember currentAddress={currentAddress} closeGroupMember={() =>  setShowGroupMember(false)} groupType={groupType} handleShowMask={() => setShowMask(true)} handleHiddenMask={() => setShowMask(false)} handlePrivateChat={(item, res) => {handlePrivateChat(item, res)}}/>
          </div>
        }
        {

          showJoinRoom &&
          <Modal title="Start New Chat" visible={showJoinRoom} onClose={() => {setShowJoinRoom(false)}}>
            <JoinRooom getCurrentRoomInfo={(address) => getCurrentRoomInfo(address)}/>
          </Modal>
        }
        {
          showCreateNewRoom &&
          <Modal title="Create New Room" visible={showCreateNewRoom} onClose={() => {setShowCreateNewRoom(false)}}>
            <CreateNewRoom createNewRoom={(address, name, currentGroupType) => createNewRoom(address, name, currentGroupType)}  hiddenCreateInfo={() => {setShowCreateNewRoom(false)}}/>
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
        <div className='chat-content-wrap'>
          <div className={`chat-ui ${detectMobile() ? 'chat-ui-client' : ''}`}>
            <div className={`chat-content-box ${showChat && detectMobile() ? 'chat-content-box-client' : ''}`}>
              <div className={`user-search-wrapper ${showChat ? 'hidden' : ''}`}>
                <div className='chat-ui-offcanvas' id='chatOffcanvas'>
                  <div className="chat-ui-header">
                    {
                      myAddress &&
                      <div className='chat-search-wrap'>
                        <SearchChat />
                        <AddChatRoom
                          showSettingList={showSettingList}
                          onClickSetting={() => {setShowSettingList(!showSettingList)}}
                          onClickSelect={(e) => onClickSelect(e)}
                        />
                      </div>
                    }
                  </div>
                  <ChatTab changeChatType={(index) => changeChatType(index)} currentTabIndex={currentTabIndex}/>

                  <ListGroup
                  hiddenMask={() => {handleHiddenMask()}}
                  showMask={() => setShowMask(true)}
                  showChatList={(e, item, list) => showChatList(e, item, list)}
                  currentIndex={currentIndex}
                  newGroupList ={roomList}
                  currentRoomName={currentRoomName}
                  hasAccess={hasAccess}
                  currNetwork={currNetwork}
                  currentTabIndex={currentTabIndex}
                  currentAddress={currentAddress?.toLowerCase()}
                  hasChatCount={hasChatCount}
                  onClickDialog={() => {setShowJoinRoom(true)}}
                  confirmDelete={() => {setDialogType('delete')}}>
                </ListGroup>
                </div>
              </div>
              <div className={`tab-content ${showChat ? 'translate-tab' : ''}`}>
                <div className='tab-pane'>
                  {
                    ((groupLists.length > 0 && currentAddress)) &&
                    <div className='d-flex flex-column h-100'>
                      <RoomHeader
                        showChat={showChat}
                        currentAddress={currentAddress}
                        currentRoomName={currentRoomName}
                        memberCount={memberCount}
                        roomAvatar={roomAvatar}
                        getGroupMember={() => {setShowGroupMember(true)}}
                        hiddenChat={() => {setShowChat(false)}}
                      />
                      <div
                        className={`chat-conetent ${detectMobile() ? 'chat-conetent-client' : ''}`}
                        id="chatConetent"
                        >
                            <ChatContext
                              getScrollParent={() => this.scrollParentRef}
                              currentAddress={currentAddress}
                              chatList={chatList}
                              hasDecrypted={hasDecrypted}
                              hasMore={hasMore}
                              myAddress={myAddress}
                              currentTabIndex={currentTabIndex}
                              sendSuccess={sendSuccess}
                              hasToBottom={hasToBottom}
                              loadingData={() => loadingData()}
                              handleDecryptedMessage={(id,text) => handleDecryptedMessage(id,text)}
                              shareInfo={(e,v) => shareInfo(e,v)}
                            />

                          <div style={{ float: "left", clear: "both" }}
                            ref={messagesEnd}>
                          </div>
                      </div>
                      {
                        (( hasAccess || currentTabIndex == 1) || (canSendText && currentGroupTypeRef.current == 3)) &&
                        <ChatInputBox
                        startChat={(text) => startChat(text)}
                        clearChatInput={clearChatInput}
                        handleShowPlace={() => {setShowPlaceWrapper(true)}}
                        resetChatInputStatus={() => {setClearChatInput(false)}}
                      ></ChatInputBox> 
                      }
                      {
                        (!hasAccess) && currentGroupTypeRef.current != 3 && currentTabIndex != 1 &&
                        <JoinGroupButton currentAddress={currentAddress} changeJoinStatus={(groupType) => changeJoinStatus(groupType)} />
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
      </div>
  )
}
