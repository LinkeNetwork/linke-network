import styled from "styled-components"
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useEffect, useState } from "react"
import { ethers } from "ethers";
import { detectMobile, getLocal, formatAddress, getTokenInfo } from '../../utils'
import { tokenListInfo } from '../../constant/tokenList'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from "../../component/Image"
import { createClient } from 'urql'
export default function ReceiveInfo(props) {
  const { currentRedEnvelopId, handleCloseReceiveInfo, currentGiveAwayVersion } = props
  const [receivedInfo, setReceivedInfo] = useState()
  const [profileInfo, setProfileInfo] = useState()
  const [receiveList, setReceiveList] = useState([])
  const [hasRedPacket, setHasRedPacket] = useState(false)
  const [receivedAmount, setReceivedAmount] = useState()
  const [receiveSymbol, setReceiveSymbol] = useState()
  const [receiveDecimals, setReceiveDecimals] = useState('')
  const [skipNum, setSkipNum] = useState(0)

  const rowRenderer = () => {
    return (
      receiveList?.map((item, index) => {
        return (
          <div className="receive-list" key={index}>
            <div className="receive-list-item">
              <div className="left">
                {
                  item?.profile?.avatar &&
                  <Image src={item?.profile?.avatar} size={30} style={{ margin: '0 4px' }} />
                }
                {
                  item?.sender && !item?.profile?.avatar &&
                  <Jazzicon address={item?.sender} className="avatar-image" />
                }
                {
                  item?.profile?.name
                    ? <span className="name">{item?.profile?.name?.indexOf('0x') !== -1 ? formatAddress(item?.profile?.name, 6, 6) : item?.profile?.name}</span>
                    : <span className="name">{formatAddress(item?.sender, 6, 6)}</span>
                }
              </div>
              <div className="right">{(Math.floor(ethers.utils.formatUnits(item?.amount, receiveDecimals) * 1000000) / 1000000)}<span className="symbol">{receiveSymbol}</span></div>
            </div>
          </div>
        )
      })

    )

  }
  const getReceiveAmount = async() => {
    const { graphUrl, giveaway_ } = currentGiveAwayVersion
    const tokensQuery = `
    {
      ${giveaway_}(id: "`+ currentRedEnvelopId +`"){
        token,
        receiveProfile(where: {sender: "`+  getLocal('account')?.toLowerCase() +`"}){
          sender,
          amount,
        }
      }
    }
    `
    const client = createClient({
      url: graphUrl
    })
    const res = await client?.query(tokensQuery).toPromise()
    const version = giveaway_ === 'giveawayV2'
    const data = version ? res?.data?.giveawayV2 : res?.data?.giveaway
    const amount = version ? data?.receiveProfile[0]?.amount : data?.receiveProfile[0]?.amount
    if(!amount) return
    const tokenInfo = getTokenInfo(data.token)
    setReceiveSymbol(tokenInfo?.symbol)
    const result = ethers.utils.formatUnits(amount, tokenInfo?.decimals)
    setReceivedAmount(Number(result.toString()).toFixed(6))
  }
  const getReceiveInfo = async (skip = 0) => {
    const { giveaway, graphUrl } = currentGiveAwayVersion
    const tokensQuery = `
    {
      ${giveaway}(where: {id: "`+ currentRedEnvelopId + `"}){
        sender,
        token,
        lastCount,
        amount,
        content,
        count,
        profile {
          name,
          avatar
        }
        token,
        receiveProfile(first:50,skip:`+ skip + `){
          id,
          gid,
          sender,
          count,
          amount,
          profile{
            name, 
            avatar
          }
        }
      }
    }
    `
    const client = createClient({
      url: graphUrl
    })
    const res = await client?.query(tokensQuery).toPromise()
    return res
  }
  const handleReceiveInfo = async () => {
    if(!currentGiveAwayVersion) return
    const res = await getReceiveInfo(skipNum)
    setSkipNum(skipNum + 50)
    const receivedInfo = currentGiveAwayVersion.giveaway === 'giveaways' ? res?.data?.giveaways[0] : res?.data?.giveawayV2S[0]
    const currentReceiveList = receivedInfo?.receiveProfile || []
    const receiveLists = receiveList.concat([...currentReceiveList])
    setReceiveList(receiveLists)
    setReceivedInfo(receivedInfo)
    const profileInfo = receivedInfo?.profile
    setProfileInfo(profileInfo)
    const item = receiveLists.filter(i => i?.sender?.toLowerCase() === getLocal('account')?.toLowerCase())[0]
    const list = [...tokenListInfo]
    var newList = list.filter(item => item.address.toUpperCase().includes(receivedInfo?.token.toUpperCase()))[0]
    setReceiveSymbol(newList?.symbol)
    setReceiveDecimals(newList?.decimals)
    if(receivedInfo?.lastCount > 0 || item?.sender?.toLowerCase() === getLocal('account')?.toLowerCase()) {
      setHasRedPacket(true)
    } else {
      setHasRedPacket(false)
    }
  }
  const loadingDatas = () => {
    setTimeout(() => {
      handleReceiveInfo()
    }, 10)
  }
  useEffect(() => {
    getReceiveAmount()
    handleReceiveInfo()
  }, [currentRedEnvelopId])
  return (
    <ReceiveInfoContanier>
      <div className="receive-wrapper">
        <div className="top-cover"></div>
        <div className="sender-info">
          {
            profileInfo?.avatar &&
            <Image src={profileInfo?.avatar} size={30} style={{ margin: '0 4px' }} />
          }
          {
            receivedInfo?.sender && !profileInfo?.avatar &&
            <Jazzicon address={receivedInfo?.sender} className="avatar-image" />
          }
          <span>Sent by</span><span className="sender-name">{profileInfo?.name}</span>
        </div>
        {
          +receivedInfo?.lastCount === 0 && !hasRedPacket &&
          <div className="no-tips">Better luck next time!</div>
        }
        {
          hasRedPacket &&
          <div className="wishes-text">
            {
              receivedInfo?.content ? <span>{receivedInfo?.content}</span> : <span>Best wishes</span>
            }

          </div>
        }
        {
          receivedAmount &&
          <div className="receive-num">{receivedAmount}<span className="receive-token">{receiveSymbol}</span></div>
        }
        <div className="divider"></div>
        {
          hasRedPacket &&
          <div id="scrollableDiv"
            style={{
              height: 240,
              overflow: 'auto',
              display: 'flex'
            }}>

            <InfiniteScroll
              className="list-item"
              scrollableTarget="scrollableDiv"
              dataLength={receiveList?.length}
              next={loadingDatas}
              hasMore={true}
            >
              {rowRenderer()}
            </InfiniteScroll>
          </div>
        }

        {
          +receivedInfo?.lastCount === 0 && !hasRedPacket &&
          <div className="view-text" onClick={() => { setHasRedPacket(true) }}>View details<span className="iconfont icon-expand"></span></div>
        }
      </div>
      <div className={`close-btn ${detectMobile() ? 'close-btn-client' : ''}`} onClick={handleCloseReceiveInfo}>
        <span className="iconfont icon-guanbi"></span>
      </div>
    </ReceiveInfoContanier>
  )
}

const ReceiveInfoContanier = styled.div`
position: fixed;
left: 0;
right: 0;
top: 0;
bottom: 0;
display: flex;
justify-content: center;
background: rgba(0, 0, 0, 0.6);
z-index: 99999;
transition: 0.4s;
.receive-wrapper {
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  width: 360px;
  height: 500px;
  background-size: 100%;
  background-repeat: no-repeat;
  border-radius: 10px;
  top: 50%;
  margin-top: -250px;
  animation: bounceIn .3s ease;
}
.top-cover {
  background: rgb(224,96,76);
  border-radius: 0 0 185px 185px;
  width: 420px;
  height: 80px;
  margin: 0 0 30px -30px;
}
.receive-list-wrapper {
  height: 240px;
  overflow-y: auto;
}
.close-btn {
  bottom: 90px;
  cursor: pointer;
  left: 50%;
  margin-left: -20px;
  color: rgb(230,206,160);
  border: 1px solid rgb(230,206,160);
  border-radius: 50%;
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  &-client {
    bottom: 30px;
  }
  .icon-guanbi {
    right: inherit;
    top: inherit;
  }
}
.sender-info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sender-name {
  font-weight: bold;
  margin-left: 10px;
  font-size: 16px;
}
.wishes-text {
  text-align: center;
  margin: 6px 0 10px;
  font-size: 14px;
  color: #666;
}
.receive-num{
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
  font-size: 36px;
  color: rgb(230,206,160);
}
.receive-token{
  font-size: 16px;
  margin-left: 4px;
}
.receive-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin: 20px 0;
  .left {
    display: flex;
    align-items: center;
  }
}
.symbol {
  color: #666;
  font-size: 12px;
  margin-left: 2px;
}
.avatar-image {
  width: 30px;
  height: 30px;
  margin: 0 4px
}
.no-tips {
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: rgb(230,206,160)
}
.view-text {
  cursor: pointer;
  text-align: center;
  color: rgb(230,206,160);
  margin-top: 16rem;
}
.icon-expand {
  transform: rotate(-90deg);
  display: inline-block;
  margin-left: 4px;
}
`