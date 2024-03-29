import { detectMobile, formatAddress, getContractConnect, getLocal, getCurrentNetworkInfo } from "../../utils"
import { Jazzicon } from '@ukstv/jazzicon-react'
import BigNumber from 'bignumber.js'
import networks from '../../context/networks'
import { PROFILE_ABI } from '../../abi/index'
import { useEffect, useState } from "react"
import { createClient } from 'urql'
import intl from "react-intl-universal"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useHistory } from 'react-router-dom'
import Image from "../../component/Image"
import InfiniteScroll from 'react-infinite-scroll-component'
import useGlobal from "../../hooks/useGlobal"
import useCheckIn from "../../hooks/useCheckIn"
import packetImg from '../../assets/images/packet.svg'
import { TwitterShareButton } from 'react-twitter-embed'
import LazyLoad from 'react-lazy-load'
import { tokenListInfo } from '../../constant/tokenList'
import { ethers } from "ethers"
export default function ChatContext(props) {
  var numeral = require('numeral')
  const { hasMore, chatList, currentAddress, shareInfo, loadingData, currentTabIndex, handleDecryptedMessage, handleReceive } = props
  const { setState } = useGlobal()
  const { getCheckInToken } = useCheckIn()
  const [showOperate, setShowOperate] = useState(false)
  const [tokenDecimals, setTokenDecimals] = useState()
  const [selectText, setSelectText] = useState('')
  const [timeOutEvent, setTimeOutEvent] = useState()
  const [tokenAddress, setTokenAddress] = useState()
  const [longClick, setLongClick] = useState(0)
  const [copyText, setCopyText] = useState('copy')
  const [optionsList, setOptionsList] = useState({})
  const [clickNumber, setClickNumber] = useState(0)
  const [twitterUrl, setTwitterUrl] = useState('')
  const history = useHistory()
  const handleShowProfile = async (e, v) => {
    const hasCreate = await getProfileStatus(v?.user?.id)
    if (+hasCreate <= 0) return
    e.preventDefault()
    v.showProfile = true
    setShowOperate(true)
    setTimeout(() => {
      v.showProfile = false
      setShowOperate(false)
    }, 4000)
  }
  const getSelectedToken = async (currentAddress) => {
    if (currentTabIndex === 1) return
    const info = await getCheckInToken(currentAddress)
    const { symbol = '', decimals = 18 } = info || {}
    setTokenAddress(symbol)
    setTokenDecimals(decimals)
  }
  const handleLeaveProfile = (e, v) => {
    if (!detectMobile()) return
    e.preventDefault()
    setShowOperate(false)
    v.showProfile = false
  }
  const shareToTwitter = async (e, v) => {
    const item = await getCurrentNetworkInfo()
    const info = item?.addressList[v.user.id]
    if (!info) return
    const { version, graphUrl, giveaway } = info
    e.stopPropagation()
    const chatText = v?.chatText?.indexOf('---') ? v?.chatText?.split('---')[0] : v?.chatText
    const res = await getGiveawaysInfo(chatText, graphUrl, giveaway)
    const list = [...tokenListInfo]
    var newList = list.filter(item => item.address.toUpperCase().includes(res?.token?.toUpperCase()))[0]
    const amount = ethers.utils.formatUnits(res?.amount, newList?.decimals)
    const totalAmount = +amount > 1000 ? numeral(amount).format() : amount
    const tokenList = `#Airdrop #ETHF #linke #${newList?.symbol}`
    const wishes = v?.wishesText ? v?.wishesText : 'Best wishes 🎁 🎁 🎁'
    const envelopeUrl = `https://linke.network/chat/${currentAddress}/${getLocal('network')}/?id=${chatText}&version=${version}`
    const url = `${envelopeUrl} to join & get money \n ${tokenList}`
    const text = `${wishes}\n💰 ${newList?.symbol} ${totalAmount} 💰 \n#Giveaway \n📍Click \n`
    const st = encodeURIComponent(text + url)
    window.open(`https://twitter.com/intent/tweet?text=${st}`)
  }
  const getProfileStatus = async (account) => {
    const currentNetwork = getLocal('network')
    const networkList = networks.filter(item => item.name === currentNetwork)
    const res = await getContractConnect(networkList[0].ProfileAddress, PROFILE_ABI).defaultToken(account)
    const hasCreate = res && res.toNumber()
    return hasCreate
  }
  const getGiveawaysInfo = async (currentRedEnvelopId, graphUrl, giveaway) => {
    const tokensQuery = `
    {
      ${giveaway}(where: {id: "` + currentRedEnvelopId + `"}){
        token,
        amount
      }
    }
    `
    const client = createClient({
      url: graphUrl
    })
    const res = await client?.query(tokensQuery).toPromise()
    const giveaways = giveaway === 'giveawayV2S' ? res?.data?.giveawayV2S[0] : res?.data?.giveaways[0]
    return giveaways
  }
  const setTwitterInfo = async (v) => {
    const item = await getCurrentNetworkInfo()
    const info = item?.addressList[v.user.id]
    if (!info) return
    const { version, graphUrl, giveaway } = info
    const chatText = v?.chatText?.indexOf('---') ? v?.chatText?.split('---')[0] : v?.chatText
    const res = await getGiveawaysInfo(chatText, graphUrl, giveaway)
    const list = [...tokenListInfo]
    var newList = list.filter(item => item.address.toUpperCase().includes(res?.token?.toUpperCase()))[0]
    const amount = ethers.utils.formatUnits(res?.amount, newList?.decimals)
    const totalAmount = +amount > 1000 ? numeral(amount).format() : amount
    const tokenList = `${'#Airdrop #ETHF #linke'} #${newList?.symbol}`
    const wishesText = v?.wishesText ? v?.wishesText : 'Best wishes 🎁 🎁 🎁'
    const envelopeUrl = `https://linke.network/chat/${currentAddress}/${getLocal('network')}/?id=${chatText}&version=${version}`
    const url = `${envelopeUrl} to join & get money${'\n'}${tokenList}`
    setTwitterUrl(url)
    const text = `${wishesText}${'\n'}💰 ${newList?.symbol} ${totalAmount} 💰${'\n'}#Giveaway${'\n'}📍Click`
    const options = {
      buttonHashtag: undefined,
      screenName: undefined,
      text: text,
      via: '',
    }
    setOptionsList(options)
    setClickNumber(clickNumber + 1)
  }
  const onOperateMenu = (e, v) => {
    setOptionsList({})
    setTwitterInfo(v)
    e.preventDefault()
    if (!v.isSuccess) return
    v.showOperate = true
    setShowOperate(true)
    setTimeout(() => {
      v.showOperate = false
      setShowOperate(false)
    }, 5000)
  }
  const onContextMenu = (e, v) => {
    if (detectMobile()) return
    setSelectText(window.getSelection().toString() || v.chatText)
    // e.preventDefault()
    onOperateMenu(e, v)
  }
  const gtouchstart = (e, v) => {
    e.stopPropagation()
    setTimeOutEvent(setTimeout(() => {
      setLongClick(1)
      setOptionsList({})
      setTwitterInfo(v)
      v.showOperate = true
      onOperateMenu(e, v)
    }, 500))
  }
  const gtouchend = (e, v) => {
    setTimeout(() => {
      v.showOperate = false
      setShowOperate(false)
    }, 2000)
    clearTimeout(timeOutEvent)
    setLongClick(0)
    if (timeOutEvent !== 0 && longClick === 0) {
      console.log('Click on the event')
    }
    return false
  }

  const gtouchmove = (e, v) => {
    // v.showOperate = false
    // console.log("----move----", timeOutEvent, longClick)
    clearTimeout(timeOutEvent)
    setLongClick(0)
    // e.preventDefault()
  }
  const onCopy = (e, v) => {
    setCopyText('copied')
    setTimeout(() => {
      v.showOperate = false
      setCopyText('copy')
      // setCopied(true)
    }, 200)
  }

  const loadingDatas = (e, v) => {
    setTimeout(() => {
      loadingData()
    }, 10)
  }

  const viewProfile = (v) => {
    setState({
      currentProfileAddress: v?.user?.id
    })
    history.push({
      pathname: `/profile/${v?.user?.id}`,
      state: v?.user?.id
    })
  }
  useEffect(() => {
    getSelectedToken(currentAddress)
  }, [currentAddress])
  return (
    <div
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)'
      }}
    >
      <InfiniteScroll
        dataLength={chatList?.length}
        next={loadingDatas}
        style={{ display: 'flex', flexDirection: 'column-reverse', transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }} //To put endMessage and loader to the top.
        inverse={true}
        hasMore={hasMore}
        scrollThreshold={0.7}
        loader={
          <div style={{ textAlign: "center", fontSize: '12px' }}>Loading...</div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
      >
        {
          chatList?.length === 0 &&
          <div style={{ textAlign: 'center' }}>... Your new conversation starts here ...</div>
        }

        {
          currentAddress && chatList?.length > 0 && chatList?.map((v, i) => {
            return (
              <LazyLoad key={i}>
                <div key={i} className="chat-item-wrap">
                  {
                    // !v.hasDelete &&
                    <div className={`chat-item ${v.position ? 'chat-end' : 'chat-start'} ${v._type === 'Register' ? 'chat-register' : ''}`}>
                      {
                        <div
                          className="chat-avatar-wrap"
                          onMouseLeave={(e) => { handleLeaveProfile(e, v) }}
                          onClick={(e) => { handleShowProfile(e, v) }}
                        >
                          {
                            v.avatar && v._type !== "Register" && v._type !== "GPT" &&
                            <Image size={25} src={v.avatar} className="address-icon" />
                          }
                          {
                            !v.avatar && v?.user?.id && v._type !== "Register" && v._type !== "GPT" &&
                            <Jazzicon address={v?.user?.id} className="address-icon" />
                          }
                          {
                            v._type === "GPT" &&
                            <Image size={25} src="https://cdn-icons-png.flaticon.com/128/6540/6540769.png" className="address-icon" />
                          }
                          {
                            v.showProfile &&
                            <div className='user-profile-wrap'>
                              {
                                v.avatar &&
                                <Image size={60} src={v.avatar} className="icon" />
                              }
                              {
                                !v.avatar && v?.user?.id &&
                                <Jazzicon address={v?.user?.id} className="icon" />
                              }
                              <div className='name'>{formatAddress(v?.user?.id, 6, 6)}</div>
                              <div className="view-btn" onClick={() => viewProfile(v)}>{intl.get('View')}</div>
                              {showOperate && <span></span>}
                            </div>
                          }

                        </div>
                      }
                      {
                        v._type === 'Register' &&
                        <div className="check-in-text">
                          <span className="check-in-address">{formatAddress(v.chatText.split("---")[1], 5, 4)}</span>
                          <span className="text">{intl.get('CheckIn')}</span>
                          <span className="check-in-amount">{ethers.utils.formatUnits((v.chatText.split("---")[2]).toString(), tokenDecimals)}</span>
                          <span>{tokenAddress}</span>

                        </div>
                      }
                      {
                        (v.showOperate && (v._type === 'Giveaway' || v._type === 'GiveawayV2')) &&
                        <div className='operate-btn operate-btn-share'>
                          {
                            optionsList?.text && !detectMobile() &&
                            <TwitterShareButton
                              onLoad={function noRefCheck() { }}
                              options={optionsList}
                              url={twitterUrl}
                            />
                          }
                          {
                            detectMobile() &&
                            <div onClick={(e) => { shareToTwitter(e, v) }}>
                              <span className='iconfont icon-share'></span>
                              <span>share</span>
                            </div>
                          }
                        </div>
                      }
                      {
                        (v._type === 'Giveaway' || v._type === 'GiveawayV2') &&
                        <div
                          className={`red-packet-wrap ${v.isOpen ? 'red-packet-wrap-opened' : ''}`}
                          onClick={() => handleReceive(v)}
                          onTouchStart={(e) => { gtouchstart(e, v) }}
                          onTouchMove={(e) => { gtouchmove(e, v) }}
                          onTouchEnd={(e) => { gtouchend(e, v) }}
                          onContextMenu={(e) => { onContextMenu(e, v) }}
                        >
                          <div className="red-packet-content">
                            <img src={packetImg} alt="" style={{ 'width': '40px' }} />
                            <div>
                              {
                                v.wishesText ? <span>{v.wishesText}</span> : <span>Best wishes</span>
                              }

                              {
                                v.isOpen &&
                                <div className="open-tags">Opened</div>
                              }
                            </div>
                            {
                              !v.isSuccess &&
                              <span className='iconfont icon-loading'></span>
                            }
                            {showOperate && <span></span>}
                          </div>
                        </div>
                      }
                      {
                        (v._type === 'msg' || v._type === 'GPT') &&
                        <div className='chat-ui-bubble chat-ui-bubble-reverse' key={i}
                          // onClick={(e) => { this.onOperateMenu(e, v) }}
                          onTouchStart={(e) => { gtouchstart(e, v) }}
                          onTouchMove={(e) => { gtouchmove(e, v) }}
                          onTouchEnd={(e) => { gtouchend(e, v) }}
                          onContextMenu={(e) => { onContextMenu(e, v) }}
                          id="chatBubble">
                          <div className='d-flex align-items-center'>
                            <div className="small text-muted me-2 d-flex chat-icon">
                              {
                                v.position &&
                                <span>You on&nbsp;</span>
                              }
                              {
                                v?.user?.id?.toLowerCase() !== getLocal('account')?.toLowerCase() && !v?.user?.profile?.name &&
                                <span><span>{formatAddress(v?.user?.id, 6, 6)}</span>&nbsp;</span>
                              }
                              {
                                // v?.userName &&
                                <span>{v?.user?.profile?.name}</span>
                              }
                              {
                                v.block &&
                                <span>({v.block})</span>
                              }
                            </div>

                          </div>
                          <div className='text-left'>
                            {
                              currentTabIndex === 0 && v?._type !== 'GPT' && <span>{v.chatText}</span>
                            }
                            {
                              v?._type === 'GPT' &&
                              <span><span>{v.chatText.split("---")[1]}</span>---{formatAddress(v.chatText.split("---")[0], 6, 6)}---5dogewow</span>
                            }
                            {
                              currentTabIndex === 1 && v.position &&
                              <div>
                                {
                                  v.isDecrypted ? <span>{v.chatText}</span> : <span onClick={() => { handleDecryptedMessage(v.id, v.chatTextSender) }}>Click to view</span>
                                }
                              </div>
                            }
                            {
                              currentTabIndex === 1 && !v.position &&
                              <div>
                                {
                                  v.isDecrypted ? <span>{v.chatText}</span> : <span onClick={() => { handleDecryptedMessage(v.id, v.chatText) }}>Click to view</span>
                                }
                              </div>
                            }
                            {
                              !v.isDecrypted && currentTabIndex === 1 &&
                              <span className={`iconfont icon-suoding ${v.position ? 'icon-suoding-left' : 'icon-suoding-right'}`}></span>
                            }
                            {
                              !v.isSuccess &&
                              <span className='iconfont icon-loading'></span>
                            }
                          </div>

                          {
                            (v.showOperate) &&
                            <div className='operate-btn' id='deleteBtn'>
                              {/* <div onClick={(e) => { this.deleteChat(e, v) }}>
                        <span className='iconfont icon-shanchu' id='iconDelete'></span>
                        <span>delete</span>
                      </div> */}
                              <div onClick={(e) => { shareInfo(e, v) }}>
                                <span className='iconfont icon-share' id='iconShare'></span>
                                <span>share</span>
                              </div>
                              {
                                !detectMobile() &&
                                <CopyToClipboard text={selectText}
                                  onCopy={(e) => { onCopy(e, v) }}>
                                  <div>
                                    <span className='iconfont icon-fuzhiwenjian'></span>
                                    <span>
                                      {copyText}
                                    </span>
                                  </div>
                                </CopyToClipboard>
                              }
                              {
                                detectMobile() &&
                                <CopyToClipboard text={v.chatText}
                                  onCopy={(e) => { onCopy(e, v) }}>
                                  <div>
                                    <span className='iconfont icon-fuzhiwenjian'></span>
                                    <span>{copyText}</span>
                                  </div>
                                </CopyToClipboard>
                              }

                            </div>
                          }
                        </div>
                      }

                    </div>
                  }
                </div>
              </LazyLoad>
            )
          })
        }
      </InfiniteScroll>
    </div>
  )
}
