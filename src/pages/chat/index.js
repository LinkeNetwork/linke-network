import React, { useEffect, useState, useRef } from 'react'
import './chat.scss'
import 'emoji-mart/css/emoji-mart.css'
import BigNumber from 'bignumber.js'
import Loading from '../../component/Loading'
import ListGroup from './GroupList'
import { createClient } from 'urql'
import ChatInputBox from './ChatInputBox'
import Introduction from './Introduction'
import ChatTab from './ChatTab'
import ShareInfo from './ShareInfo'
import RedEnvelopeCover from './RedEnvelopeCover'
import CreateNewRoom from './CreateNewRoom'
import JoinRooom from './JoinRoom'
import useGroupMember from '../../hooks/useGroupMember'
import useDataBase from '../../hooks/useDataBase'
import useUnConnect from '../../hooks/useUnConnect'
import ShareGroupCode from './ShareGroupCode'
import AwardBonus from './AwardBonus'
import ReceiveInfo from './ReceiveInfo'
import { ethers } from "ethers"
import useReceiveInfo from '../../hooks/useReceiveInfo'
import { detectMobile, throttle } from '../../utils'
import { setLocal, getLocal, getDaiWithSigner } from '../../utils/index'
import { PROFILE_ABI, PUBLIC_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI, RED_PACKET } from '../../abi/index'
import localForage from "localforage"
import Modal from '../../component/Modal'
import SearchChat from './SearchChat'
import AddChatRoom from './AddChatRoom'
import RoomHeader from './RoomHeader'
import ChatContext from './ChatContext'
import GroupMember from './GroupMember'
import JoinGroupButton from './JoinGroupButton'
import { useHistory } from 'react-router-dom'
import useGlobal from '../../hooks/useGlobal'
import useWallet from '../../hooks/useWallet'
import packetImg from '../../assets/images/packet.svg'

export default function Chat() {
  const { collection, setDataBase } = useDataBase()
  const [collectedRedEnvelope, setCollectedRedEnvelope] = useState([])
  const history = useHistory()
  const { getReceiveInfo } = useReceiveInfo()
  const { getGroupMember } = useGroupMember()
  const [showReceiveTips, setShowReceiveTips] = useState(false)
  const skip = 0
  const [clickNumber, setClickNumber] = useState(0)
  const timer = useRef()
  const allTimer = useRef()
  const messagesEnd = useRef(null)
  const { chainId } = useWallet()
  const [showEnvelopesList, setShowEnvelopesList] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const { getclientInfo } = useUnConnect()
  const {groupLists, setState, hasClickPlace, hasQuitRoom, networks, accounts, currentNetworkInfo, clientInfo, currentChain, currentChatInfo, giveAwayAddress, hasCreateRoom} = useGlobal()
  const [memberListInfo, setMemberListInfo] = useState([])
  const [currentAddress, setCurrentAddress] = useState()
  const [currentRedEnvelopTransaction, setCurrentRedEnvelopTransaction] = useState()
  const currentAddressRef = useRef(null)
  const [showCanReceiveTips, setCanReceiveTips] = useState(false)
  const [currentRedEnvelopId, setCurrentRedEnvelopId] = useState()
  const [memberCount, setMemberCount] = useState()
  const [myAddress, setMyAddress] = useState()
  const [showReceiveInfo, setShowReceiveInfo] = useState(false)
  const [showRedEnvelope, setShowRedEnvelope] = useState(false)
  const [currentRoomName, setCurrentRoomName] = useState()
  const [hasAccess, setHasAccess] = useState()
  const [chatList, setChatList] = useState([])
  const [showOpenAward, setShowOpenAward] = useState(false)
  const [showJoinGroupButton, setShowJoinGroupButton] = useState()
  const chatListRef = useRef()
  const [hasScroll, setHasScroll] = useState(false)
  const hasScrollRef = useRef(null)
  const [hasNotice, setHasNotice] = useState(false)
  const [showMask, setShowMask] = useState(false)
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
  const [clearChatInput, setClearChatInput] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [chatListStatus, setChatListStatus] = useState(new Map())
  const [sendSuccess, setSendSuccess] = useState(false)
  const [dialogType, setDialogType] = useState()
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [roomAvatar, setRoomAvatar] = useState()
  const [privateKey, setPrivateKey] = useState()
  const [myAvatar, setMyAvatar] = useState()
  const [hasDecrypted, setHasDecrypted] = useState(false)
  const [hasChatCount, setHasChatCount] = useState(false)
  const [currentGroupType, setCurrentGroupType] = useState()
  const [groupList, setGroupLists] = useState()
  const [showShareGroup, setShowShareGroup] = useState(false)
  const groupListRef = useRef()
  const [canSendText, setCanSendText] = useState()
  const [groupType, setGroupType] = useState()
  const currentGroupTypeRef = useRef()
  const hasAccessRef = useRef()
  const myAvatarRef = useRef()
  const showJoinGroupButtonRef = useRef()
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
    if (!clientInfo) {
      getclientInfo()
    }
  }, [clientInfo])
  useEffect(() => {
    myAvatarRef.current = myAvatar
    currentAddressRef.current = currentAddress
    hasScrollRef.current = hasScroll
    roomListRef.current = roomList
    chatListRef.current = chatList
    currentGroupTypeRef.current = currentGroupType
    hasAccessRef.current = hasAccess
    showJoinGroupButtonRef.current = showJoinGroupButton
  }, [currentAddress, hasScroll, roomList, chatList, currentGroupType, hasAccess, showJoinGroupButton, myAvatar])
  useEffect(() => {
    groupLists?.map(item => {
      startInterval(item.id)
    })

    if (groupLists?.length) {
      setGroupLists([...groupLists])
    }
    if(!getLocal('isConnect') && groupLists?.length) {
      setCurrentRoomName(groupLists[0].name)
    }
    groupListRef.current = groupLists
  }, [currentTabIndex, groupLists])
  useEffect(() => {
    const path = history.location.pathname.split('/chat/')[1]
    const address = path?.split('/')[0]
    const network = path?.split('/')[1] || getLocal('network')
    if(address && network) {
      setShowChat(true)
      setState({
        showHeader: false
      })
    }
  }, [groupLists])
  useEffect(() => {
    if (currentTabIndex === 1) {
      getMyAvatar()
      localForage.getItem('publicKeyList').then(res => {
        const key = res && res[getLocal('account')]
        if (!key) {
          getMyPublicKey()
        }
      })
    }
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
        params: [getLocal('account')], // you must have access to the specified account
      })
      .then((result) => {
        localForage.getItem('publicKeyList').then(res => {
          if (res) {
            res[getLocal('account')] = result
            localForage.setItem('publicKeyList', res)
          } else {
            const obj = {}
            obj[getLocal('account')] = result
            localForage.setItem('publicKeyList', obj)
          }
        })

      })
  }
  const getManager = async (id, type) => {
    if (type == 3) return
    const tx = await getDaiWithSigner(id, PUBLIC_GROUP_ABI).profile()
    const canSendText = tx.manager?.toLowerCase() == getLocal('account')?.toLowerCase()
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
      const { currentIndex, address, name, avatar, privateKey } = data
      setCurrentTabIndex(currentIndex)
      setCurrentAddress(address)
      setState({
        currentAddress: address
      })
      setPrivateKey(privateKey)
      setCurrentRoomName(name)
      setRoomAvatar(avatar)
      return
    }
    const path = history.location.pathname.split('/chat/')[1]
    const address = path?.split('/')[0]
    const network = path?.split('/')[1] || getLocal('network')
    
    if (network) {
      setState({
        currNetwork: network
      })
    }
    if (address) {
      setCurrentAddress(address)
      await getInitChatList(address)
      setState({
        currentAddress: address
      })
      if(!hash) {
        await isRoom(address)
      }
      
    }
  }
  const updateGroupList = async (name, roomAddress, type) => {

    const index = groupListRef?.current?.findIndex(item => item.id.toLowerCase() == roomAddress.toLowerCase())
    const groupList = groupListRef?.current ? [...groupListRef?.current] : []
    if (index === -1) {
      groupList.push({
        id: roomAddress,
        name: name,
        chatCount: 0,
        newChatCount: 0,
        _type: type
      })
      let res = await localForage.getItem('chatListInfo')
      let chatListInfo = res ? res : {}
      const list = Object.keys(chatListInfo)
      const currentNetwork = getLocal('network')
      chatListInfo[currentNetwork] = list.length ? chatListInfo[currentNetwork] : {}
      chatListInfo[currentNetwork][getLocal('account')] = chatListInfo[currentNetwork][getLocal('account')] ? chatListInfo[currentNetwork][getLocal('account')] : {}
      chatListInfo[currentNetwork][getLocal('account')]['publicRooms'] = [...groupList]
      localForage.setItem('chatListInfo', chatListInfo).then(res => {
        setRoomList(groupList)
        setState({
          groupLists: groupList
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
  const isRoom = async (roomAddress) => {
    try {
      initCurrentAddress(roomAddress)
      setShowMask(true)
      if (!getLocal('isConnect')) {
        const path = history.location.pathname.split('/chat/')[1]
        var currentNetwork = path?.split('/')[1]
        var networkInfo = networks.filter(i => i.name === currentNetwork)[0]
        setLocal('currentGraphqlApi', networkInfo?.APIURL)
        setLocal('network', currentNetwork)
        setCurrNetwork(currentNetwork)
      } else {
        const currentNetwork = getLocal('network') || currNetwork
        var networkInfo = networks.filter(i => i.name === currentNetwork)[0]
      }
      const groupInfo = await getGroupMember(roomAddress, skip)
      const groupType = groupInfo?._type
      getJoinRoomAccess(roomAddress, groupType)
      setGroupType(groupType)
      if (groupType == 3) {
        var { name } = await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).groupInfo()
        updateGroupList(name, roomAddress, groupType)
      } else {
        var { name } = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).profile()
      }
      setCurrentRoomName(name)

      if (name) {
        updateGroupList(name, roomAddress, groupType)
      }
      setCurrentRoomName(name)
    }
    catch (e) {
      console.log(e, 'error==========')
      setShowMask(false)
      if (!hasNotice) {
        if(getLocal('isConnect')) {
          alert('This is not a chat room.')
        } else {
          if(!currentNetwork) {
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
  const getJoinRoomAccess = async (roomAddress, groupType) => {
    try {
      if((groupType == 1 || groupType == 2) && getLocal('account')) {
        var res = await getDaiWithSigner(roomAddress, PUBLIC_GROUP_ABI).balanceOf(getLocal('account'))
      }
      if (groupType == 3) {
        var res = await getDaiWithSigner(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).managers(getLocal('account'))
      }
      if(!res) return
      const hasAccess= ethers.BigNumber.from(res) > 0
      setHasAccess(hasAccess)
      if (!Boolean(hasAccess)) {
        setShowJoinGroupButton(true)
      }
      setShowMask(false)
      const redEnvelopId = parseInt(history.location.search.split('?')[1])
      setCurrentRedEnvelopId(redEnvelopId)
      if(hasAccess && redEnvelopId) {
        const tx = await getDaiWithSigner(giveAwayAddress, RED_PACKET).giveawayInfo_exist(redEnvelopId, getLocal('account'))
        const isReceived = (new BigNumber(Number(tx))).toNumber()
        if(!isReceived) {
          setShowRedEnvelope(true)
        } else {
          if(!redEnvelopId) return
          setShowReceiveTips(true)
        }
      }
      if(!hasAccess && redEnvelopId) {
        setShowJoinModal(true)
        return
      }
    } catch(error) {
      console.log(error, '===error==')
    }
  }
  const fetchPublicChatList = async (roomAddress) => {
    const tokensQuery = `
    query{
      chatInfos(orderBy:block,orderDirection:desc, first:20, where:{room: "`+ roomAddress?.toLowerCase() + `"}){
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
    if (!clientInfo) {
      const path = history.location.pathname.split('/chat/')[1]
      const network = path?.split('/')[1] || getLocal('network') || currentChain
      const item = networks.filter(i => i.name === (getLocal('network') || network))[0]
      setCurrNetwork(network)
      // if(!item?.APIURL) return
      var clientInfo = createClient({
        url: item?.APIURL
      })
    }
    const data = await clientInfo?.query(tokensQuery).toPromise()
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: roomAddress }).project({}).sort({ block: -1 }).toArray()
    const chatList = data?.data?.chatInfos || []
    // const result = formateData(chatList, roomAddress)
    const result = await getMemberList(chatList) || []
    await insertData(result)
    if (roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
      if (res?.length > 0) {
        setChatList(res)
      } else {
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
    clearInterval(timer.current)
    clearInterval(allTimer.current)
    setCurrentAddress(list)
    setState({
      currentAddress: list
    })
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
  const showChatList = (item) => {
    setCurrentRedEnvelopId()
    setShowMask(true)
    setHasAccess()
    setChatList([])
    setHasMore(true)
    if (currentTabIndex === 0 && window.ethereum) {
      getManager(item.id, item._type)
      handleReadMessage(item.id)
      getJoinRoomAccess(item.id, item._type)
      history.push(`/chat/${item.id}/${getLocal('network')}`)
    }
    setShowChat(true)
    if (detectMobile()) {
      setState({
        showHeader: false
      })
    }
    clearInterval(timer.current)
    clearInterval(allTimer.current)
    setRoomAvatar(item.avatar)
    getInitChatList(item.id, item.avatar)
    setCurrentGroupType(item._type)
    if (currentTabIndex === 1) {
      getPrivateChatStatus(item.id)
      history.push(`/chat/${item.id}#p`)
    }
    startInterval(item.id)
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
    const firstBlock = chatList && chatList[chatList.length - 1]?.block
    if (!firstBlock) return
    const tokensQuery = `
    query{
      chatInfos(orderBy:block,orderDirection:desc, first:20, where:{room: "`+ currentAddressRef?.current?.toLowerCase() + `", block_lt: ` + firstBlock + `}){
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
    const data = await clientInfo?.query(tokensQuery).toPromise()
    const loadingList = data?.data?.chatInfos || []
    console.log(loadingList.length, 'loadingList.length====')
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
    // insertData(newfetchData)
    if(chatListRef.current.length && newfetchData?.length > 0) {
      const list = [...chatListRef.current]
      const result = list.concat(newfetchData)
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
    const myAddress = getLocal('account')?.toLowerCase()
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
    const myAddress = getLocal('account')?.toLowerCase()
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
    const res = await collection?.find({ room: toAddress }).project({}).sort({ block: -1 }).toArray()
    if (!res || res?.length === 0) {
      if (currentTabIndex == 0) {
        await fetchPublicChatList(toAddress)
      }
      if(currentTabIndex == 1) {
        await fetchPrivateChatList(toAddress, avatar)
      }
    } else {
      if(toAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase()) {
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
  const handleSend = async(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText) => {
    const type_ = currentBonusType === 'Random Amount' ? 2 : 1
    const address = giveAwayAddress
    const total = ethers.utils.parseEther(String(totalAmount))
    if(!wishesText) {
      wishesText = 'Best Wishes'
    }
    const tx = selectTokenAddress == 0
                ? await getDaiWithSigner(address, RED_PACKET).sendETH(currentAddress, total, quantity, type_, wishesText, {value:total})
                : await getDaiWithSigner(address, RED_PACKET).send(currentAddress,selectTokenAddress, total, quantity, type_, wishesText)
    setShowMask(true)
    setShowAwardBonus(false)
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    await handleGiveAway(tx, wishesText)
    let callback = await tx.wait()
    setShowAwardBonus(false)
    const id = callback?.events[3]?.args?.id
    const index = chatList?.findIndex((item) => item.id.toLowerCase() == callback?.transactionHash?.toLowerCase())
    if(chatList?.length > 0) {
      chatList[index].isSuccess = true
      chatList[index].block = callback?.blockNumber
      chatList[index].chatText = String((new BigNumber(Number(id))).toNumber())
      chatList[index].wishesText = wishesText
      setClickNumber(clickNumber+1)
      collection.insert(chatList[index])
      setClickNumber(clickNumber+1)
    } else {
      setChatList([])
      chatList[0].isSuccess = true
      chatList[0].block = callback?.blockNumber
      chatList[0].chatText = String((new BigNumber(Number(id))).toNumber())
      chatList[0].wishesText = wishesText
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
        _type: 'Giveaway',
        isOpen: false,
        wishesText: wishesText,
        user: {
          id: myAddress
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
      if (callback?.status === 1) {
        const index = chatList?.findIndex((item) => item.id.toLowerCase() == tx.hash.toLowerCase())
        const sendIndex = memberListInfo?.findIndex((item) => item.id.toLowerCase() == tx.from.toLowerCase())
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
  const handleReadMessage = async(roomAddress) => {
    let res = await localForage.getItem('chatListInfo')
    const publicRooms = res && res[currNetwork]?.[getLocal('account')]?.['publicRooms']
    const index = publicRooms?.findIndex(item => item.id == roomAddress?.toLowerCase())
    if(index > -1) {
      publicRooms[index]['newChatCount'] = 0
      res[currNetwork][getLocal('account')]['publicRooms'] = [...publicRooms]
      localForage.setItem('chatListInfo', res)
      setRoomList(publicRooms)
    }
  }
  const getUserAvatar = async(newList) => {
    let list = []
    const ids = newList?.map(item => item?.user?.id)
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
    const res = await clientInfo?.query(tokensQuery).toPromise()
    newList?.map(item => {
      res?.data?.profiles?.map(info => {
         if(item?.user?.id?.toLowerCase() == info?.id?.toLowerCase()) {
           list.push({
             ...item,
             avatar: info?.avatar
           })
         }
       })
     })
    return list
  }
  const updateUnreadNum = async(roomAddress, res) => {
    const currentList = res
    let list = await localForage.getItem('chatListInfo')
    const publicRooms = list && list[currNetwork]?.[getLocal('account')]?.['publicRooms']
    const index = publicRooms?.findIndex(item => item.id == roomAddress?.toLowerCase())
    if(index > -1) {
      publicRooms[index]['newChatCount'] = +currentList[0]?.index - publicRooms[index]?.chatCount || 0
      const roomType = currentTabIndex === 0 ? 'publicRooms' : 'privateRooms'
      list[currNetwork][getLocal('account')][roomType] = [...publicRooms]
      localForage.setItem('chatListInfo', list)
      setRoomList(publicRooms)
    }
  }
  const getCurrentGroupChatList = async(client, roomAddress) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: roomAddress }).project({}).sort({ block: -1 }).toArray()
    updateUnreadNum(roomAddress, res)
    const lastBlock = res?.length && +res[0]?.block + 1
    // if(!lastBlock || chatListRef.current[0]?.block == 0) return
    const tokensQuery = `
        query{
          chatInfos(orderBy:block,orderDirection:desc, where:{room: "`+ roomAddress?.toLowerCase() +`", block_gte: ` + lastBlock + `}){
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
    const data = await client.query(tokensQuery).toPromise()
    if (!data?.data?.chatInfos.length) return
    const newList = data?.data?.chatInfos && await getMemberList(data?.data?.chatInfos)
    console.log(newList, 'newList=======')
    const list = chatListRef ? chatListRef.current : []
    collection.insert(newList, (error) => {
      updateNewList(roomAddress, collection)
      if (error) { throw error; }
    })
    if (roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && newList?.length) {
      setChatList(newList.concat(list))
    }
  }
  const updateNewList = async(roomAddress, collection) => {
    const res = await collection?.find({room: roomAddress}).project({}).sort({ block: -1 }).toArray()
    const index = groupListRef.current?.findIndex(item => item.id.toLowerCase() == roomAddress)
    if(index > -1) {
      groupListRef.current[index] = {
        ...groupListRef.current[index],
        newChatCount: +res[0]?.index - Number(groupListRef.current[index]?.chatCount)
      }
      setHasChatCount(true)
    }

    setRoomList(groupLists)
  }
  const getCurrentChatList = async (roomAddress) => {
    if(!chainId) return
    if(currentTabIndex === 0) {
      await getCurrentGroupChatList(clientInfo, roomAddress)
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
      setChatList(currentList.concat(list))
    }
    // insertData(currentList)
  }
  const getProfileStatus = async(account) => {
    const res = await getDaiWithSigner(currentNetworkInfo?.ProfileAddress, PROFILE_ABI).defaultToken(account)
    const hasCreate = res && (new BigNumber(Number(res))).toNumber()
    return hasCreate
  }
  const handleReceive = async(v) => {
    const hasCreateProfile = await getProfileStatus(accounts)
    console.log(hasCreateProfile, Boolean,'handleReceive====2')
    if(!Boolean(hasCreateProfile)) {
      setCanReceiveTips(true)
      return
    }
    if(!hasAccess) {
      setShowJoinModal(true)
      return
    }
    const chatText = v?.chatText?.indexOf('---') ? v?.chatText.split('---')[0] : v?.chatText
    setCurrentRedEnvelopId(chatText)
    const lastCount = await getReceiveInfo(chatText)
    if(+lastCount === 0) {
      setShowReceiveInfo(true)
    }
    const tx = await getDaiWithSigner(giveAwayAddress, RED_PACKET).giveawayInfo_exist(chatText, getLocal('account'))
    const isReceived = (new BigNumber(Number(tx))).toNumber()
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
    if(isReceived === 1) {
      setShowReceiveInfo(true)
    }
    if(!hasAccess || isReceived === 1 || +lastCount === 0) return
    setCurrentRedEnvelopTransaction(v?.transaction)
    setShowRedEnvelope(true)
  }
  const getGiveawaysInfo = async(currentRedEnvelopId) => {
    const tokensQuery = `
    {
      giveaways(where: {id: "`+  currentRedEnvelopId + `"}){
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
    const res = await clientInfo?.query(tokensQuery).toPromise()
    return res?.data?.giveaways[0]
  }
  const getMemberList = async(chatList) => {
    if(currentTabIndex === 1 || !chatList.length) return
    let result = [...chatList]
    let collectedRedEnvelope = []
    await Promise.all(
      result.map(async(item) => {
        if(item?._type ==='Giveaway') {
          const id = item?.chatText?.indexOf('---') ? item?.chatText.split('---')[0] : item?.chatText
          var res = await getGiveawaysInfo(id)
          if(+res?.lastCount > 0) {
            collectedRedEnvelope.push({
              id: id,
              lastCount: res.lastCount,
              count: res.count
            })
            setCollectedRedEnvelope(collectedRedEnvelope)
          }
          console.log(id, res, collectedRedEnvelope, 'getMemberList====<<<lastCount')
        }
        let params = {
            avatar: item?._type ==='Giveaway' ? res?.profile?.avatar : item?.user?.profile?.avatar,
            hasDelete: false,
            isSuccess: true,
            showProfile: false,
            position: item?._type ==='Giveaway' ? (res?.sender)?.toLowerCase() === (getLocal('account'))?.toLowerCase() : (item?.user?.id).toLowerCase() === (getLocal('account'))?.toLowerCase(),
            showOperate: false,
            isOpen: false, 
            wishesText: item.chatText.split('---')[1]
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
    setShowChat(false)
    setState({
      showHeader: true
    })
  }
  const getDecryptedMessage = async(id, message) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
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
        // insertData()
        setChatList(chatList)
      }
      )
      .catch((error) => console.log(error.message));
  }
  const changeJoinStatus = (groupType) => {
    if (groupType == 1 || groupType == 2) {
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
    const path = history.location.pathname.split('/chat/')[1]
    const currentRedEnvelopId = history.location.search.split('?')[1]
    setCurrentRedEnvelopId(currentRedEnvelopId)
    const address = path?.split('/')[0]
    const network = path?.split('/')[1] || getLocal('network') || currentChain
    const hash = history.location.hash
    hash ? setCurrentTabIndex(1) : setCurrentTabIndex(0)
    if(!getLocal('isConnect')) {
      fetchPublicChatList(address)
    }
    if(network) {
      initRoomAddress(hash)
    }
    if(address && !getLocal('isConnect') && !network) {
      alert('Please connect wallet first')
    }
  }, [currentChain])
  const handleAwardBonus = async() => {
    const res = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).users(giveAwayAddress)
    if(!Boolean(res?.state)) {
      setShowOpenAward(true)
    } else {
      setShowAwardBonus(true)
    }
  }
  const handleReceiveConfirm = async(e, id) => {
    setState({
      showOpen: false
    })
    const lastCount = await getReceiveInfo(currentRedEnvelopId)
    if(+lastCount === 0) {
      setShowRedEnvelope(false)
      setShowReceiveInfo(true)
      return
    }
    const tx = await getDaiWithSigner(giveAwayAddress, RED_PACKET).receive(currentRedEnvelopId)
    setState({
      showOpen: true
    })
    const callback = await tx.wait()
    setShowRedEnvelope(false)
    setShowReceiveInfo(true)
    const amount = callback?.events[1]?.args?.id
    const receiveAmount = (new BigNumber(Number(amount))).toNumber()
    const index = chatList?.findIndex(item => item.transaction == currentRedEnvelopTransaction)
    chatList[index].isOpen = true
    setState({
      showOpen: false
    })
  }
  const handleOpenAward = async() => {
    setShowOpenAward(false)
    const tx = await getDaiWithSigner(giveAwayAddress, RED_PACKET).register(currentAddress)
    setShowMask(true)
    await tx.wait()
    setShowMask(false)
    setShowAwardBonus(true)
  }
  const handleCloseAward = () => {
    setShowChat(true)
    setShowAwardBonus(false)
  }
  useEffect(() => {
    const redEnvelopId = history.location.search.split('?')[1]
    if(hasCreateRoom && redEnvelopId) {
      setShowRedEnvelope(true)
    }
  }, [hasCreateRoom])
  useEffect(() => {
    if(accounts) {
      setMyAddress(accounts)
    }
    setRoomList([])
    setMyAddress(getLocal('account'))
    return () => {
      clearInterval(timer.current)
      clearInterval(allTimer.current)
      window.removeEventListener('scroll', throttle(handleScroll, 500), true)
    }
  }, [accounts])
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
    if(!getLocal('isConnect')) {
      getclientInfo()
    }
  }, [getLocal('isConnect')])
  return(
    <div className="chat-ui-wrapper">
      {
        <Modal title="Join the group" visible={showJoinModal} onClose={() => { setShowJoinModal(false) }}>
          <div>Please Join the group first</div>
        </Modal>
      }
      {
        <Modal title="Tips" visible={showCanReceiveTips} onClose={() => { setCanReceiveTips(false) }}>
          <div>You should create profile first</div>
          <div className='btn-operate-award' style={{marginTop: '16px'}}>
            <div className='btn btn-primary' onClick={() => {history.push(`/profile/${accounts}`)}}>Confirm</div>
            <div className='btn btn-light' onClick={() => { setShowReceiveTips(false) }}>Cancel</div>
          </div>
        </Modal>
      }
      {
        <Modal title="Tips" visible={showReceiveTips} onClose={() => { setShowReceiveTips(false) }}>
          <div>You've already received it</div>
        </Modal>
      }
      {
        <Modal title="List of red envelopes to be claimed" visible={showEnvelopesList} onClose={() => { setShowEnvelopesList(false) }}>
          <div>You've already received it11111</div>
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
        <ReceiveInfo currentRedEnvelopId={currentRedEnvelopId}  handleCloseReceiveInfo={() => {setShowReceiveInfo(false)}} ></ReceiveInfo>
      }
      {
        showOpenAward &&
        <Modal title="Open red envelope" visible={showOpenAward} onClose={() => { setShowOpenAward(false) }}>
          <div className='btn-operate-award'>
            <div className='btn btn-primary' onClick={handleOpenAward}>Open</div>
            <div className='btn btn-light' onClick={() => { setShowOpenAward(false) }}>Cancel</div>
          </div>
        </Modal>
      }
      {
        showAwardBonus && detectMobile() &&
        showAwardBonus &&
        <AwardBonus
          handleCloseAward={() => { setShowAwardBonus(false) }}
          currentAddress={currentAddress}
          handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText)}}
          handleGiveAway={(tx) => {handleGiveAway(tx)}}
        ></AwardBonus>
      }
      {
        !detectMobile() &&
        <Modal title="Award Bonus" visible={showAwardBonus} onClose={handleCloseAward}>
          <AwardBonus
            handleCloseAward={() => { setShowAwardBonus(false) }}
            currentAddress={currentAddress}
            handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText)}}
            handleGiveAway={(tx) => {handleGiveAway(tx)}}
          ></AwardBonus>
        </Modal>
      }

      {
        hasClickPlace && <Loading />
      }
      {
        showPlaceWrapper &&
        <div className='place-wrapper'>
          <span className='iconfont icon-guanbi' onClick={() => { setShowPlaceWrapper(false) }}></span>
          <iframe src="https://place.linke.network/" frameBorder="0" width="100%" height="100%" scrolling="no">
          </iframe>
        </div>
      }
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
        <Modal title="Start New Chat" visible={showJoinRoom} onClose={() => { setShowJoinRoom(false) }}>
          <JoinRooom getCurrentRoomInfo={(address) => getCurrentRoomInfo(address)} />
        </Modal>
      }
      {
        showCreateNewRoom &&
        <Modal title="Create New Room" visible={showCreateNewRoom} onClose={() => { setShowCreateNewRoom(false) }}>
          <CreateNewRoom createNewRoom={(address, name, currentGroupType) => createNewRoom(address, name, currentGroupType)} hiddenCreateInfo={() => { setShowCreateNewRoom(false) }} />
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
        <div className='chat-content-wrap'>
          <div className={`chat-ui ${detectMobile() ? 'chat-ui-client' : ''}`}>
            <div className={`chat-content-box ${showChat && detectMobile() ? 'chat-content-box-client' : ''}`}>
              <div className={`user-search-wrapper ${showChat ? 'hidden' : ''}`}>
                <div className='chat-ui-offcanvas' id='chatOffcanvas'>
                  {
                    myAddress &&
                    <div className="chat-ui-header">
                      <div className='chat-search-wrap'>
                        <SearchChat />
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
                    currentRoomName={currentRoomName}
                    hasAccess={hasAccess}
                    currNetwork={currNetwork}
                    currentTabIndex={currentTabIndex}
                    currentAddress={currentAddress?.toLowerCase()}
                    hasChatCount={hasChatCount}
                    onClickDialog={() => { setShowJoinRoom(true) }}
                    confirmDelete={() => { setDialogType('delete') }}>
                  </ListGroup>
                </div>
              </div>
              <div className={`tab-content ${showChat ? 'translate-tab' : ''} ${ showAwardBonus ? 'display': ''}`}>
                <div className='tab-pane'>
                  {
                    ((groupLists.length > 0 && currentAddress) || showChat) &&
                    <div className='d-flex flex-column h-100'>
                      <RoomHeader
                        showChat={showChat}
                        currentAddress={currentAddress}
                        currentRoomName={currentRoomName}
                        memberCount={memberCount}
                        roomAvatar={roomAvatar}
                        currentTabIndex={currentTabIndex}
                        getGroupMember={() => {setShowGroupMember(true)}}
                        hiddenChat={hiddenChat}
                      />
                      <div
                        className={`chat-conetent ${detectMobile() ? 'chat-conetent-client' : ''}`}
                        id="chatConetent"
                      >
                        {/* <div className='bottom-envelope-list' onClick={() => {setShowEnvelopesList(true)}}>
                          <img src={packetImg} alt="" style={{ 'width': '40px' }} />
                        </div> */}
                        <ChatContext
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
                        ((hasAccess || currentTabIndex == 1) || (canSendText && currentGroupTypeRef.current == 3)) &&
                        <ChatInputBox
                          startChat={(text) => startChat(text)}
                          clearChatInput={clearChatInput}
                          handleShowPlace={() => { setShowPlaceWrapper(true) }}
                          handleAwardBonus={handleAwardBonus}
                          resetChatInputStatus={() => { setClearChatInput(false) }}
                        ></ChatInputBox>
                      }
                      {
                        !hasAccess && currentGroupTypeRef.current != 3 && currentTabIndex != 1 &&
                        <JoinGroupButton hasAccess={hasAccess} currentAddress={currentAddress} changeJoinStatus={(groupType) => changeJoinStatus(groupType)} />
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
