import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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
import { detectMobile, uniqueChatList,  getBalance,getBalanceNumber, setLocal, getLocal, getContractConnect, getClient, getTimestamp, getCurrentNetworkInfo, getStackedAmount, getTokenInfo } from '../../utils'
import { PUBLIC_GROUP_ABI, ENCRYPTED_COMMUNICATION_ABI, PUBLIC_SUBSCRIBE_GROUP_ABI, REGISTER_ABI, SIGN_IN_ABI, RED_PACKET_V2, GPT_ABI} from '../../abi/index'
import localForage from "localforage"
import Modal from '../../component/Modal'
import SearchChat from './SearchChat'
import AddChatRoom from './AddChatRoom'
import RoomHeader from './RoomHeader'
import ChatContext from './ChatContext'
import GroupMember from './GroupMember'
import JoinGroupButton from './JoinGroupButton'
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
  const groupTimer = useRef()
  const messagesEnd = useRef(null)
  const [showOpenSignIn, setShowOpenSignIn] = useState(false)
  const [showEnvelopesList, setShowEnvelopesList] = useState(false)
  const [showTips, setShowTips] = useState()
  const {groupLists, setState, hasClickPlace, hasQuitRoom, networks, accounts, clientInfo, currentChatInfo, hasCreateRoom, chainId, signInAddress, giveAwayAddressV3, currentNetworkInfo, chatGptAddress } = useGlobal()
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
    chatListRef.current = chatList
    currentGroupTypeRef.current = currentGroupType
    hasAccessRef.current = hasAccess
  }, [currentAddress, chatList, currentGroupType, hasAccess, myAvatar, ROOM_ADDRESS])
  useEffect(() => {
    if(!(+getLocal('isConnect')) && groupLists?.length) {
      setCurrentRoomName(groupLists[0].name)
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
      const address = location?.state?.room || GROUP_ADDRESS || location?.state?.address
      if(!address) {
        setShowChat(false)
      }
      setCurrentAddress(address)
    }
    return() => {
      clearInterval(groupTimer.current)
    }
  }, [history?.location?.state])
  const getAccount = async() => {
    const account = await window?.ethereum?.request({ method: 'eth_requestAccounts' })
    if(account && account[0]) {
      setLocal('account', account[0])
      setLocal('isConnect', 1)
    }
  }
  useEffect(() => {
    const address = GROUP_ADDRESS
    const network = NETWORK || CURRENT_NETWORK
    if(address && network) {
      setCurrentAddress(address)
      setShowChat(true)
      if(detectMobile()) {
        setState({
          showHeader: false
        })
      }
    }
  }, [GROUP_ADDRESS, CURRENT_NETWORK, NETWORK])
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
  }, [currentTabIndex, ACCOUNT])
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
    const tx = await getContractConnect(id, PUBLIC_GROUP_ABI).profile()
    const canSendText = tx.manager?.toLowerCase() === ACCOUNT?.toLowerCase()
    setCanSendText(canSendText)
  }
  const getPrivateChatStatus = async (id) => {
    const res = await getContractConnect(currentNetworkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).users(id)
    setPrivateKey(res)
  }
  const initRoomAddress = async(hash) => {
    let data = history.location?.state
    if (data) {
      const { currentIndex, address, name, avatar, privateKey, share, userCount } = data
      setCurrentTabIndex(currentIndex)
      setCurrentAddress(address)
      setMemberCount(userCount)
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
      if(!hash) {
        await isRoom(address)
      }
    }
  }
  const getGroupName = async(roomAddress, groupType, groupInfo) => {
    if(!roomAddress || !groupType || !groupInfo || !window?.ethereum) return
    getJoinRoomAccess(roomAddress, groupType)
    const { name } = +groupType === 3 ? await getContractConnect(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).groupInfo() : await getContractConnect(roomAddress, PUBLIC_GROUP_ABI).profile()
    setCurrentRoomName(name || groupInfo?.name)
  }
  const getGroupInfo = (groupInfo) => {
    if(chainId !== 513100 && groupInfo && !(+getLocal('isConnect')) ) {
      const { chatCount, id, name, __typename, _type, userCount } = groupInfo
      const roomInfo = [
        {
          chatCount: chatCount,
          id: id,
          name: name,
          __typename: __typename,
          _type: _type
        }
      ]
      setMemberCount(userCount)
      setState({
        groupLists: [...roomInfo]
      })
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
      getInitChatList(roomAddress)
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
      }
      return false
    }
  }
  const getHasAccessStatus = async(roomAddress, groupType) => {
    if(!ACCOUNT || !roomAddress || !groupType) return
    const res = +groupType === 3 
              ? await getContractConnect(roomAddress, PUBLIC_SUBSCRIBE_GROUP_ABI).managers(ACCOUNT)
              : await getContractConnect(roomAddress, PUBLIC_GROUP_ABI).balanceOf(ACCOUNT)
    const hasAccess= ethers.BigNumber.from(res) > 0
    setHasAccess(hasAccess)
    return hasAccess
  }
  const getReceivedStatus = async(version, id) => {
    const envelopId = parseInt(id || redEnvelopId)
    setCurrentRedEnvelopId(envelopId)
    const tx = await getContractConnect(version.address, version.reaPacket).giveawayInfo_exist(envelopId, ACCOUNT)
    let isReceived = tx.toNumber()
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
    setShowMask(true)
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
    const res = await collection?.find({ room: roomAddress })?.project({})?.sort({ index: -1 })?.toArray()
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
    setChatList([])
    setClickNumber(clickNumber+1)
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
    setCurrentAddress(item.id)
    setState({
      currentAddress: item.id
    })
    setMemberCount(item.userCount)
    setCurrentRoomName(item.name)
    if (currentTabIndex === 0 && window.ethereum) {
      const state = {
        address: item.id,
        network: getLocal('network'),
        currentIndex: 0,
        name: item.name, 
        userCount: item.userCount
      }
      history.push('/chat', state)
      await getJoinRoomAccess(item.id, item._type)
      getManager(item.id, item._type)
    }
    if(+item.newChatCount > 0) {
      await getCurrentChatList(item.id, item.newChatCount)
      await handleReadMessage(item.id)
    } else {
      getInitChatList(item.id, item.avatar)
    }
    setShowChat(true)
    if (detectMobile()) {
      setState({
        showHeader: false
      })
    }
    setRoomAvatar(item.avatar)
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
    currentTabIndex === 0 ? loadingGroupData() : loadingPrivateData()
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
    const res = await collection?.find({ room: toAddress })?.project({})?.toArray()
    res?.sort((a, b) => {
      return b.index - a.index;
    })
    if (!res || res?.length === 0) {
      +currentTabIndex === 0 ? await fetchPublicChatList(toAddress) : await fetchPrivateChatList(toAddress, avatar)
    } else {
      const address = currentAddressRef?.current || GROUP_ADDRESS || ROOM_ADDRESS
      if(toAddress?.toLowerCase() === address?.toLowerCase()) {
        const list = uniqueChatList(res, 'block')
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
  const handleSend = async(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount, mustHaveTokenDecimals) => {
    const haveAmount = !minAmount ? 0 : ethers.utils.parseUnits(minAmount, mustHaveTokenDecimals)
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
      // ? await getContractConnect(address, redPacket).sendETH(currentAddress, total, quantity, type_, wishesText, {value:total})
      // : await getContractConnect(address, redPacket).send(currentAddress,selectTokenAddress, total, quantity, type_, wishesText)

    const tx = +selectTokenAddress === 0
    ? await getContractConnect(address, redPacket).sendETH(params, {value:total})
    : await getContractConnect(address, redPacket).send(selectTokenAddress, params)
    setShowMask(true)
    setShowAwardBonus(false)
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    await handleGiveAway(tx, wishesText)
    let callback = await tx.wait()
    setShowAwardBonus(false)
    const id = callback?.events[4]?.args?.tokenId
    console.log(callback, 'callback?=====', id)
    const index = chatList?.findIndex((item) => item?.id?.toLowerCase() === callback?.transactionHash?.toLowerCase())
    if(chatList?.length > 0) {
      chatList[index].isSuccess = true
      chatList[index].block = callback?.blockNumber
      chatList[index].chatText = id.toNumber()
      chatList[index].wishesText = wishesText
      setClickNumber(clickNumber+1)
      collection.insert(chatList[index])
      setClickNumber(clickNumber+1)
    } else {
      // console.log('setChatList===10')
      setChatList([])
      chatList[0].isSuccess = true
      chatList[0].block = callback?.blockNumber
      chatList[0].chatText = id.toNumber()
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
        var tx = await getContractConnect(currentNetworkInfo?.PrivateChatAddress, ENCRYPTED_COMMUNICATION_ABI).send(currentAddress, encryptedMessage, encryptedSenderMessage, 'msg')
      }
      if(currentTabIndex === 0 ) {
        const groupInfo = await getGroupMember(currentAddress, skip)
        const groupType = groupInfo?._type
        setGroupType(groupType)
        const abi = +groupType === 3 ? PUBLIC_SUBSCRIBE_GROUP_ABI : PUBLIC_GROUP_ABI
        tx = await getContractConnect(currentAddress, abi).send(chatText, 'msg')
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
      // const groupList = await getPublicGroupList()
      // await handleReadMessage(currentAddress, groupList)
      if (callback?.status === 1) {
        const index = chatList?.findIndex((item) => item.id.toLowerCase() === tx.hash.toLowerCase())
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
  const handleReadMessage = async(roomAddress) => {
    const list = groupLists?.length > 0 || roomList?.length > 0 ? [...groupLists] || [...roomList] : await getPublicGroupList()
    const currentGroup = list?.filter(item => item.id === roomAddress?.toLowerCase())
    let res = await localForage.getItem('chatListInfo')
    const currNetwork = location?.state?.network || NETWORK || CURRENT_NETWORK || getLocal('network')
    const publicRooms = res && res[currNetwork]?.[ACCOUNT]?.['publicRooms']
    const index = publicRooms?.findIndex(item => item.id === roomAddress?.toLowerCase())
    if(index > -1) {
      publicRooms[index]['newChatCount'] = 0
      publicRooms[index]['chatCount'] = currentGroup[0]?.chatCount
      res[currNetwork][ACCOUNT]['publicRooms'] = [...publicRooms]
      localForage.setItem('chatListInfo', res)
      // console.log('setRoomList====4', publicRooms)
      setRoomList(publicRooms)
    }
  }
  const getCurrentGroupChatList = async(roomAddress, newChatCount) => {
    const db = await setDataBase()
    const collection = db?.collection('chatInfos')
    const res = await collection?.find({ room: roomAddress })?.project({})?.toArray()
    res?.sort((a, b) => {
      return b.index - a.index;
    })
    const lastBlock = res?.length && +res[0]?.index + 1
    // if(!lastBlock || chatListRef.current[0]?.block == 0) return
    const tokensQuery = `
        query{
          chatInfos(orderBy:index,orderDirection:desc, first:20, where:{room: "`+ roomAddress?.toLowerCase() +`", block_gte: ` + lastBlock + `}){
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
      const list = (chatListRef || res?.length > 0) ? ([...res] || chatListRef?.current) : []
      collection.insert(newList)
      if (roomAddress?.toLowerCase() === currentAddressRef?.current?.toLowerCase() && newList?.length) {
        const index = list?.findIndex(item => item.id === newList[0]?.id)
        if(index === -1) {
          // console.log('setChatList===12', chatList)
          if(newChatCount && newChatCount > 20) {
            setChatList([...newList])
          } else {
            setChatList(newList.concat(list))
          }
          // await handleReadMessage(currentAddress)
        } 
        // else {
        //   const chatList = list.slice(0, 20)
        //   setChatList([...chatList])
        // }
      }
    // }
  }
  const getCurrentChatList = async (roomAddress, newChatCount) => {
    if(!chainId) return
    if(currentTabIndex === 0) {
      await getCurrentGroupChatList(roomAddress, newChatCount)
    }
    if(currentTabIndex === 1) {
      await getCurrentPrivateChatList(roomAddress)
    }
  }
  const getCurrentPrivateChatList = async(roomAddress) => {
    const lastBlock = chatListRef.current?.length && +chatListRef.current[0]?.block + 1
    if(!lastBlock || +chatListRef.current[0]?.block === 0) return
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
      const registerNftInfos = await getContractConnect(globalNftAddress, reaPacket).balanceOf(ACCOUNT)
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
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() === haveToken.toLocaleLowerCase())
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
    const selectedToken = tokenList.filter(i => i.address.toLocaleLowerCase() === haveToken.toLocaleLowerCase())
    const needStackedAmount = ethers.utils.formatUnits(scoreAmount, selectedToken[0].decimals)
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
      const tokenInfo = getTokenInfo(giveawayInfos?.haveToken)
      const mustHaveAmount = giveaway === 'giveawayV2S' && ethers.utils.formatUnits(giveawayInfos?.haveAmount, tokenInfo?.decimals)
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
    const item = window?.ethereum ? await getCurrentNetworkInfo() : networks.filter(i=> i.symbol === NETWORK)[0]
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
  const handleOpenChatgptService = async(purchasesTimes) => {
    try {
      const fee = ethers.utils.parseEther(String(purchasesTimes))
      setShowMask(true)
      const tx = await getContractConnect(chatGptAddress, GPT_ABI).openGPT(currentAddress, {value: fee})
      tx.wait()
    } catch {
      setShowMask(false)
    }
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
        const index = chatList.findIndex(item => item.id === id)
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
    if (+groupType === 3) {
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
    const tx = await getContractConnect(globalNftAddress, SIGN_IN_ABI).automatic({value: fee})
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
    const tx = await getContractConnect(signInAddress, REGISTER_ABI).registers(currentAddress)
    globalNftAddress = tx.nft
  }
  useEffect(() => {
    setCurrentRedEnvelopId(RED_PACKET_ID)
    const address = GROUP_ADDRESS
    const network = NETWORK || CURRENT_NETWORK
    const hash = history.location.hash
    hash ? setCurrentTabIndex(1) : setCurrentTabIndex(0)
    if(!(+getLocal('isConnect')) && address) {
      getInitChatList(address)
    }
    if(network) {
      initRoomAddress(hash)
    }
  }, [])
  const handleAwardBonus = async() => {
    const res = await getContractConnect(currentAddress, PUBLIC_GROUP_ABI).users(giveAwayAddressV3)
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
          ? await getContractConnect(currentGiveAwayVersion, reaPacket).receive(currentRedEnvelopId)
          : await getContractConnect(currentGiveAwayVersion, reaPacket).receives(currentRedEnvelopId)
    setState({
      showOpen: true
    })
    await tx.wait()
    setShowRedEnvelope(false)
    setShowReceiveInfo(true)
    const index = chatList?.findIndex(item => item.transaction === currentRedEnvelopTransaction)
    if(index > -1) {
      chatList[index].isOpen = true
    }
    setState({
      showOpen: false
    })
  }
  const handleCancelCheckin = async(canSend) => {
    if(!canSend) return
    const tx = await getContractConnect(globalNftAddress, SIGN_IN_ABI).cancelCheckin()
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
    const tx = await getContractConnect(giveAwayAddressV3, RED_PACKET_V2).register(currentAddress)
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
  const handleOpenChatgpt = async() => {
    try {
      setShowMask(true)
      const tx = await getContractConnect(chatGptAddress, GPT_ABI).register(currentAddress)
      tx.wait()
      setShowMask(false)
    } catch {
      setShowMask(false)
    }
  }
  const handleOpenSign = async(tokenAddress) => {
    try {
      setShowMask(true)
      const params = ethers.utils.defaultAbiCoder.encode(["address", "address", "string", "string"], [tokenAddress, currentAddress, "Register","register"]);
      const tx = await getContractConnect(signInAddress, REGISTER_ABI).mint(currentAddress, 1, params)
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
    const tx = isOpenAutoCheckIn ? await getContractConnect(globalNftAddress, SIGN_IN_ABI).receivesAuto() : await getContractConnect(globalNftAddress, SIGN_IN_ABI).receives()
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
  const handleCheckIn = async(token, tokenId, quantity, decimals) => {
    setShowSignIn(false)
    setState({
      canMint: false
    })
    setShowMask(true)
    try {
      const valueE = +token === 0 ? ethers.utils.parseEther(quantity) : 0
      const formatQuantity = ethers.utils.parseUnits(quantity, decimals)
      const value = +token === 0 ? formatQuantity : formatQuantity.toString()
      const tx = await getContractConnect(globalNftAddress, SIGN_IN_ABI).checkin(tokenId, value, {value: valueE})
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
    console.log(groupList, 'groupList===');
    
    const cacheGroupList = await getCachePublicGroup()
    console.log(cacheGroupList, 'cacheGroupList===');

    const compareResult = await compareGroup(groupList, cacheGroupList)
    const { hasNewMsgGroup, result } = compareResult
    const address =  currentAddressRef.current || ROOM_ADDRESS || currentAddress || GROUP_ADDRESS
    const foundGroup = result?.find(group => group.id === address?.toLowerCase() && group.newChatCount > 0)
    console.log(foundGroup, 'foundGroup====', compareResult)
    if (foundGroup) {
      await getCurrentGroupChatList(address, foundGroup.newChatCount)
    }
    if(hasNewMsgGroup?.length > 0 && !searchGrouName ) {
      // setCacheGroup(result, currentTabIndex)
      const list = result?.length > 0 ? [...result] : []
      setRoomList(list)
      setState({
        groupLists: list
      })
    }
  }
  const startIntervalGroup = () => {
    groupTimer.current = setInterval(() => {
      fetchPublicGroupList()
    }, 20000)
  }
  const handleMint = async(quantity, token, decimals) => {
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
    const isEthf = token === 'ETHF'
    const valueE = isEthf ? ethers.utils.parseEther(quantity) : 0
    const formatQuantity = ethers.utils.parseUnits(quantity, decimals)
    const value = isEthf ? formatQuantity : formatQuantity.toString()
    const tx = await getContractConnect(globalNftAddress, SIGN_IN_ABI).mint(value,{value: valueE})
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
    if(hasCreateRoom && redEnvelopId) {
      setShowRedEnvelope(true)
    }
    if(hasCreateRoom) {
      getInitChatList(currentAddress)
    }
  }, [hasCreateRoom, currentAddress])
  useEffect(() => {
    setMyAddress(ACCOUNT)
  }, [ACCOUNT])
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
    if(!groupLists?.length && !(+getLocal('isConnect')) && !GROUP_ADDRESS) {
      setRoomList([])
      setShowChat(false)
      setState({
        showHeader: true
      })
    }
  }, [getLocal('isConnect')])
  useEffect(() => {
    const address = ROOM_ADDRESS
    if(window?.ethereum) {
      getNftAddress()
    }
    if(location.hash === '#p') {
      setCurrentTabIndex(1)
    }
    if(address) {
      isRoom(address)
      if(detectMobile()) {
        setShowChat(true)
        setState({
          showHeader: false
        })
      }
      if(+clickNumber === 0) {
        getInitChatList(address)
      }
      setCurrentAddress(address)
    }
  }, [ROOM_ADDRESS])
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
          handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount, mustHaveTokenDecimals) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount, mustHaveTokenDecimals)}}
          handleGiveAway={(tx) => {handleGiveAway(tx)}}
        ></AwardBonus>
      }
      {
        <Modal title={intl.get('CheckIn')} visible={showSignIn} onClose={handleCloseSignIn}>
          <div className="sign-in-wrapper">
            <SignIn
              currentAddress={currentAddress}
              showNftList={showNftList}
              handleMint={(num, token, decimals) => {handleMint(num, token, decimals)}}
              handleSelectNft={(id) => {handleSelectNft(id)}}
              nftImageList={nftImageList}
              handleCheckIn={(token,id, num, decimals) => {handleCheckIn(token, id, num, decimals)}}
              handleCancelCheckin={(canSend) => {handleCancelCheckin(canSend)}}
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
            handleSend={(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount, mustHaveTokenDecimals) => {handleSend(currentBonusType, totalAmount,selectTokenAddress, quantity, wishesText, tokenDecimals, openStatus, minAmount, mustHaveTokenAddress, minStackedAmount, mustHaveTokenDecimals)}}
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
                        roomAvatar={roomAvatar}
                        memberCount={memberCount}
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
                          handleOpenChatgpt={handleOpenChatgpt}
                          handleOpenChatgptService={(purchasesTimes) => handleOpenChatgptService(purchasesTimes)}
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
