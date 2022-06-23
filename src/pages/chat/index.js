import React, { Component, createRef, useEffect, useState, useRef } from 'react'
import './chat.scss'
import 'emoji-mart/css/emoji-mart.css'
import { createClient } from 'urql'
import { token } from '../../constant/token'
import Loading from '../../component/Loading'
import ListGroup from './GroupList'
import ChatInputBox from './ChatInputBox'
import Introduction from './Introduction'
import ConnectWallet from '../layout/ConnectWallet'
import ChatTab from './ChatTab'
import ShareInfo from './ShareInfo'
import CreateNewRoom from './CreateNewRoom'
import JoinRooom from './JoinRoom'
import useGroupMember from '../../hooks/useGroupMember'
import useDataBase from '../../hooks/useDataBase'
import { ethers } from "ethers"
import { detectMobile, throttle } from '../../utils'
import { setLocal, getLocal, getDaiWithSigner } from '../../utils/index'
import { PUBLIC_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI } from '../../abi/index'
import localForage from "localforage"
import ChangeNetwork from './ChangeNetwork'
import Modal from '../../component/Modal'
import Nav from '../nav'
import SearchChat from './SearchChat'
import AddChatRoom from './AddChatRoom'
import HeaderInfo from '../layout/HeaderInfo'
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
  const {groupLists, hasGetGroupLists, hasCreateRoom, setState, hasClickPlace} = useGlobal()
  const [balance, setBalance] = useState()
  const [memberListInfo, setMemberListInfo] = useState([])
  const [currentGraphApi, setCurrentGraphApi] = useState()
  const [currentAddress, setCurrentAddress] = useState()
  const currentAddressRef = useRef(null)
  const [memberCount, setMemberCount] = useState()
  const [currentChainId, setChainId] = useState()
  const [myAddress, setMyAddress] = useState()
  const [currentRoomName, setCurrentRoomName] = useState()
  const [hasAccess, setHasAccess] = useState()
  const [chatList, setChatList] = useState([])
  const chatListRef = useRef()
  const [hasScroll, setHasScroll] = useState(false)
  const hasScrollRef = useRef(null)
  const [hasNotice, setHasNotice] = useState(false)
  const [showMask, setShowMask] = useState(false)
  const [showGroupMember, setShowGroupMember] = useState(false)
  const [showWalletList, setShowWalletList] = useState(false)
  const [showMenulist, setShowMenulist] = useState(false)
  const [currNetwork, setCurrNetwork] = useState()
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showCreateNewRoom, setShowCreateNewRoom] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [hasToBottom, setHasToBottom] = useState(true)
  const [showPlaceWrapper, setShowPlaceWrapper] = useState(false)
  const [shareTextInfo, setShareTextInfo] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
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
  const [encryptionChatText, setEncryptionChatText] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [myPublicKey, setMyPublicKey] = useState()
  const [myAvatar, setMyAvatar] = useState()
  const [hasDecrypted, setHasDecrypted] = useState(false)
  useEffect(()=>{
    currentAddressRef.current = currentAddress
    hasScrollRef.current = hasScroll
    roomListRef.current = roomList
    chatListRef.current = chatList
    currentAddress && getMemberCount(currentAddress)
  }, [currentAddress, hasScroll, roomList, chatList])
  useEffect(() => {
    groupLists?.map(item => {
      startInterval(item.id)
    })
  }, [groupLists])
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
    history.push('/chat')
    setCurrentAddress()
  }, [currentTabIndex])
  const getCurrentNetwork = async() => {
    const networkInfo = await getChainInfo()
    setCurrentGraphApi(networkInfo?.APIURL)
    setChainId(networkInfo?.chainId)
    setCurrNetwork(networkInfo?.name)
    console.log(networkInfo, 'networkInfo=====')
  }
  const getMyAvatar = async () => {
    const networkInfo = await getChainInfo()
    const tokensQuery = `
    query{
      profile(id: "`+ getLocal('account').toLowerCase() + `"){
        name,
        avatar,
      }
    }
    `
    const client = createClient({
      url: networkInfo?.APIURL
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
      currentTabIndex: index
    })
  }
  const getBalance = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(getLocal('account'))
    const etherString = ethers.utils.formatEther(balance)
    setBalance(etherString)
    console.log(etherString, 'balance===')
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
  const getPrivateChatStatus = async (id) => {
    const networkInfo = await getChainInfo()
    const res = await getDaiWithSigner(networkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(id)
    setPrivateKey(res)
    console.log(res, 'getPrivateChatStatus=====')
  }
  const initRoomAddress = () => {
    let data = history.location?.state
    if(data) {
      const {currentIndex, address, name , avatar, privateKey} = data
      setCurrentTabIndex(currentIndex)
      setCurrentAddress(address)
      setPrivateKey(privateKey)
      setCurrentRoomName(name)
      setRoomAvatar(avatar)
      return
    } else {
      setCurrentTabIndex(0)
    }
    const address = history.location.pathname.split('/chat/')[1]
    if (address) {
      setCurrentAddress(address)
      isRoom(address)
    }
  }
  const updateGroupList = (name, roomAddress) => {
    // debugger
    if(!hasGetGroupLists) return
    const index = groupLists.findIndex(item => item.id.toLowerCase() == roomAddress)
    const groupList = [...groupLists]
    if(index === -1 && hasGetGroupLists) {
      groupList.push({
        id: roomAddress,
        name: name
      })
      setRoomList(groupList)
    }
  }
  const isRoom = async (roomAddress) => {
    try {
      console.log(groupLists, roomListRef.current, roomAddress, '999')
      const index = groupLists.findIndex(item => item.id.toLowerCase() == roomAddress)
      if(index > 0) return
      const {name} = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).profile()
      console.log(name, 'name=====')
      updateGroupList(name, roomAddress)
      getJoinRoomAccess(roomAddress)
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
  const getJoinRoomAccess = async(roomAddress) => {
    const res = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).balanceOf(getLocal('account'))
    const hasAccess= ethers.BigNumber.from(res) > 0
    setHasAccess(hasAccess)
    console.log(hasAccess, Boolean(hasAccess), 'hasAccess======')
  }
  const fetchPublicChatList = async(roomAddress) => {
    const networkInfo = await getChainInfo()
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
      url: networkInfo?.APIURL
    })

    const data = await client.query(tokensQuery).toPromise()
    const chatList = data?.data?.chatInfos || []
    const result = formateData(chatList)
    setChatList(result)
    insertData(result)
    getMemberList(roomAddress, result)
  }

  const insertData = async(datas) =>{
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    console.log(collection, '======')
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
    history.push(`/chat/${list}`)
    setCurrentAddress(list)
    setChatList([])
  }

  const handleChangeNetWork = async (network) => {
    setShowMenulist(false)
    const { name, decimals, symbol, chainId, rpcUrls, chainName, blockExplorerUrls } = token[network]
    const nativeCurrency = { name, decimals, symbol }
    let params = [{
      chainId,
      rpcUrls,
      chainName,
      nativeCurrency,
      blockExplorerUrls
    }]
    await window.ethereum?.request({ method: 'wallet_addEthereumChain', params })
    getSign(name)
    setCurrNetwork(name)
    setShowWalletList(false)
  }
  const getSign = async (network) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    getCurrentNetwork()
    getMyAccount()
  }
  const getMyAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const myAddress = await signer.getAddress()
    const currentAccount = myAddress.toLocaleLowerCase()
    console.log(myAddress, 'myAddress====')
    setLocal('account', currentAccount?.toLowerCase())
    setLocal('isConnect', true)
    setMyAddress(currentAccount)
  }
  const getCurrentRoomInfo = (roomAddress) => {
    setShowJoinRoom(false)
    setHasScroll(false)
    setChatList([])
    setShowMask(true)
    isRoom(roomAddress)
  }
  const createNewRoom = async (address, name) => {
    setCurrentAddress(address)
    setChatList([])
    setChatListStatus(new Map())
    setShowMask(false)
    setCurrentRoomName(name)
    setShowCreateNewRoom(false)
    initCurrentAddress(address)
  }
  const connectWallet = () => {
    setShowWalletList(true)
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
  const handleMenu = () => {
    setShowMenulist(true)
    setShowChat(false)
  }
  const handleDisconnect = () => {
    setMyAddress('')
    setShowMask(false)
    setShowAccount(false)
    setRoomList([])
    setLocal('isConnect', false)
    history.push(`/chat`)
  }
  const onClickSelect = (e) => {
    const id = e.target.id.slice(0, -4)
    setShowCreateNewRoom(id === 'creat')
    setShowJoinRoom(id === 'new')
    setShowSettingList(false)
  }
  const getMemberCount = async(id) => {
    if(currentTabIndex === 1) return
    const data = await getGroupMember(id)
    const memberListInfo = data?.users
    setMemberCount(memberListInfo?.length)
  }
  const showChatList = (e, item, list) => {
    clearInterval(timer.current)
    clearInterval(allTimer.current)
    setRoomAvatar(item.avatar)
    console.log(item, 'item=====')
    getInitChatList(item.id, item.avatar)
    if(currentTabIndex === 1) {
      getPrivateChatStatus(item.id)
    }
    startInterval(item.id)
    setMemberCount()
    setHasMore(true)
    history.push(`/chat/${item.id}`)
    setCurrentAddress(item.id)
    if(currentTabIndex === 0) {
      getMemberCount(item.id)
    }
    setCurrentRoomName(item.name)
    setShowChat(true)
    setShowMask(true)
    setHasScroll(false)
    getJoinRoomAccess(item.id)
  }

  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView(false)
      console.log(messagesEnd, 'messagesEnd====')
    }
  }
  const loadingGroupData = async() => {
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
    insertData(loadingList)
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
    insertData(fetchData)
    const newfetchData = addAvatarToList(fetchData)
    setTimeout(() => {
      if(chatListRef.current.length) {
        const list = [...chatListRef.current]
        console.log(newfetchData, 'newfetchData===')
        console.log(fetchData, list, memberListInfo, '====fetchData')
        const result = list.concat(newfetchData)
        setChatList(result)
      }
    }, 10)
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
        avatar: type === 1 ? myAvatar : (roomAvatar || avatar)
      }
    })
    return data
  }
  const setPrivateChatList = (list) => {
    const currentAddress =  history.location.pathname.split('/chat/')[1]
    localForage.getItem('privateChatList').then(res => {
      if(res) {
        res[currNetwork][getLocal('account')]['rooms'][currentAddress] = {
          'chatList': list
        }
        localForage.setItem('privateChatList', res)
      } else {
        let privateChatList = {}
        privateChatList[currNetwork] = {
          [getLocal('account')]: {
            ['rooms']: {
              [currentAddress]: {
                ['chatList']: list
              }
            }
          }
        }
        console.log(privateChatList,'privateChatList=====')
        localForage.setItem('privateChatList', privateChatList)
      }
    }).catch(error => {
      console.log(error, '=====error')
    })

    console.log(currNetwork, getLocal('account'), '====>>>currNetwork')
  }
  const fetchPrivateChatList = async(toAddress, avatar) => {
    setRoomAvatar(avatar)
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
      setPrivateChatList(currentList)
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
    const networkInfo = await getChainInfo()
    const client = createClient({
      url: networkInfo?.APIURL
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
      debugger
      if(currentTabIndex === 0) {
        fetchPublicChatList(toAddress)
      } else {
        fetchPrivateChatList(toAddress, avatar)
      }
    } else {
      setChatList(res)
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
        var tx = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).send(chatText, 'msg')
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

      if (!chatList) {
        setChatList({})
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
  const resetData = () => {
    setCurrentAddress()
    setRoomAvatar()
    setCurrentTabIndex(0)
    setCurrentRoomName()
    getBalance()
    getCurrentNetwork()
    initRoomAddress()
    getMyAccount()
    history.push(`/chat`)
  }
  const accountsChange = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (chainId) => {
        if (history.location.pathname.includes('/chat')) {
          resetData()
        }
      })
      window.ethereum.on('chainChanged', (chainId) => {
        resetData()
      })
    }
  }
  const startInterval = (currentAddress) => {
    let index = groupLists && groupLists.findIndex((item) => item.id.toLowerCase() == currentAddress.toLowerCase())
    const groupList = [...groupLists]
    let newRoomList = groupList.splice(index, 1)
    groupList.unshift(newRoomList[0])
    console.log(groupList, 'roomList========')
    clearInterval(allTimer.current)
    allTimer.current = setInterval(() => {
      for (let i = 0; i < groupList.length; i++) {
        getCurrentChatList(groupList && groupList[i]?.id)
      }
    }, 20000)
  }
  const getUserAvatar = async(newList) => {
    let list = []
    const ids = newList.map(item => item.sender)
    console.log(ids, '=====>>>>ids')
    const networkInfo = await getChainInfo()
    const idsList = '"' + ids.join('","')+ '"'
    if(!ids) return
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
      url: networkInfo?.APIURL
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
  const getCurrentGroupChatList = async(client, roomAddress) => {
    const db = await setDataBase()
    const collection = db.collection('chatInfos')
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    console.log(res, '=====>>>res')
    const lastBlock = res?.length && +res[0]?.block + 1
    console.log(roomAddress, lastBlock, 'getCurrentGroupChatList')
    if(!lastBlock || chatListRef.current[0]?.block == 0) return
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
      collection.insert(formatList,(error) => {
        updateNewList(roomAddress, collection)
        if (error) { throw error; }
      })
      const list = [...chatListRef.current]
      if(roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && newList?.length) {
        setChatList(formatList.concat(list))
      }
      console.log(roomAddress, newList, groupLists, 'newList====')
      console.log(chatList, 'getCurrentChatList====')
  }
  const updateNewList = async(roomAddress, collection) => {
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    const index = groupLists.findIndex(item => item.id.toLowerCase() == roomAddress)
    console.log(res,+res[0].index - Number(groupLists[index].chatCount), roomAddress, groupLists,'1====>>.')
    if(index > -1) {
      groupLists[index] = {
        ...groupLists[index],
        newChatCount: +res[0].index - Number(groupLists[index].chatCount) - 1
      }
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
      insertData(result)
      setChatList(result)
    }
    setShowMask(false)
    console.log(hasScrollRef.current, 'hasScrollRef.current====')
    startInterval(roomAddress, list)
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
  const handleDecryptedMessage = (id, text) => {
    getDecryptedMessage(id, text)
  }
  useEffect(() => {
    getBalance()
    getCurrentNetwork()
    initRoomAddress()
    setMyAddress(getLocal('account'))
    accountsChange()
    // window.addEventListener('scroll', throttle(handleScroll, 500), true)
    return () => {
      clearInterval(timer.current)
      clearInterval(allTimer.current)
      window.removeEventListener('scroll', throttle(handleScroll, 500), true)
    }
  }, [getLocal('account')])
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
          <iframe src="https://place.beeprotocol.xyz/" frameBorder="0" width="100%" height="100%" scrolling="no">
          </iframe>
        </div>
      }


        {
          showGroupMember &&
          <div className='group-member-wrap'>
            <div className='mask' onClick={() => { setShowGroupMember(false)}}></div>
            <GroupMember currentAddress={currentAddress} closeGroupMember={() => { setShowGroupMember(false)}}/>
          </div>
        }
        {
          showWalletList &&
          <Modal title="Connect Wallet" visible={showWalletList} onClose={() => { setShowWalletList(false) }}>
            <ChangeNetwork handleChangeNetWork={(network) => handleChangeNetWork(network)} closeNetworkContainer={() => { setShowWalletList(false) }}/>
          </Modal>
        }
        {

          showJoinRoom &&
          <Modal title="Start New Chat" visible={showJoinRoom} onClose={() => {setShowJoinRoom(false)}}>
            <JoinRooom getCurrentRoomInfo={(address) => getCurrentRoomInfo(address)}/>
          </Modal>
        }
        {
          showCreateNewRoom &&
          <Modal title="Create New RoomName" visible={showCreateNewRoom} onClose={() => {setShowCreateNewRoom(false)}}>
            <CreateNewRoom createNewRoom={(address, name) => createNewRoom(address, name)}  hiddenCreateInfo={() => {setShowCreateNewRoom(false)}}/>
          </Modal>
        }
        {
          !myAddress && detectMobile() &&
          <ConnectWallet connectWallet={() => connectWallet()} />
        }


        <Nav showMenulist={showMenulist} hiddenMenuList={() => { setShowMenulist(false) }} />

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
            closeShareInfo={() => handleClick()}>
          </ShareInfo>
        }
        <div className='chat-content-wrap'>
          <div className={`chat-ui ${detectMobile() ? 'chat-ui-client' : ''}`}>
            {
              (!showChat || !detectMobile()) &&
              <div className='header-top-wrap'>
                <HeaderInfo
                  connectWallet={() => connectWallet()}
                  handleMenu={() => handleMenu()}
                  handleShowAccount={() => {setShowAccount(true)}}
                  handleChangeNetWork={(network) => handleChangeNetWork(network)}
                  handleDisconnect={() => handleDisconnect()}
                  onCloseAccount={() => {setShowAccount(false)}}
                  myAddress={myAddress}
                  showHeaderInfo={getLocal('account')}
                  currNetwork={currNetwork}
                  showAccount={showAccount}
                  chainId={currentChainId}
                  balance={balance}
                />
              </div>
            }

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
                  chainId={currentChainId}
                  newGroupList ={roomList}
                  currentRoomName={currentRoomName}
                  hasAccess={hasAccess}
                  currentTabIndex={currentTabIndex}
                  currentAddress={currentAddress?.toLowerCase()}
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
                        (hasAccess || hasCreateRoom || currentTabIndex === 1) ? <ChatInputBox
                        startChat={(text) => startChat(text)}
                        clearChatInput={clearChatInput}
                        handleShowPlace={() => {setShowPlaceWrapper(true)}}
                        resetChatInputStatus={() => {setClearChatInput(false)}}
                      ></ChatInputBox> : <JoinGroupButton currentAddress={currentAddress} changeJoinStatus={() => {setHasAccess(true)}}/>
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
