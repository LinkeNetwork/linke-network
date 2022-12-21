import styled from "styled-components"
import { Jazzicon } from '@ukstv/jazzicon-react'
import useGlobal from "../../hooks/useGlobal"
import { useEffect, useState } from "react"
import { ethers } from "ethers";
import { detectMobile, getLocal } from '../../utils'
import { tokenListInfo } from '../../constant/tokenList'
import Image from "../../component/Image"
export default function ReceiveInfo(props) {
  const { currentRedEnvelopId, handleCloseReceiveInfo } = props
  const [receivedInfo, setReceivedInfo] = useState()
  const [profileInfo, setProfileInfo] = useState()
  const [receiveList, setReceiveList] = useState([])
  const [hasRedPacket, setHasRedPacket] = useState(true)
  const [receivedAmount, setReceivedAmount] = useState()
  const [receiveSymbol, setReceiveSymbol] = useState()
  const { clientInfo } = useGlobal()
  const getReceiveInfo = async() => {
    const tokensQuery = `
    {
      giveaways(where: {id: "`+  currentRedEnvelopId + `"}){
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
        receiveProfile{
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
    const res = await clientInfo?.query(tokensQuery).toPromise()
    console.log(res, '=====>>>.')
    const receivedInfo = res?.data?.giveaways[0]
    console.log(receivedInfo, 'receivedInfo=====')
    setReceivedInfo(receivedInfo)
    const profileInfo = receivedInfo?.profile
    setProfileInfo(profileInfo)
    const list = [...tokenListInfo]
    var newList = list.filter(item => item.address.toUpperCase().includes(receivedInfo?.token.toUpperCase()))[0]
    setReceiveSymbol(newList?.symbol)
    const receiveList = receivedInfo?.receiveProfile
    const item = receiveList.filter(i=> i?.sender?.toLowerCase() === getLocal('account')?.toLowerCase())[0]
    console.log(item, 'item-----')
    setHasRedPacket(item)
    if(item) {
      const amount = ethers.utils.formatUnits(item?.amount, 18)
      setReceivedAmount((Math.floor(amount * 10000)/10000))
    }
    console.log(receiveList, receivedInfo, receivedInfo?.sender, 'receiveList======', ethers.utils.formatUnits("9970000000000000000000000", 18), newList)
    setReceiveList(receiveList)
    
  }
  useEffect(() => {
    getReceiveInfo()
  }, [currentRedEnvelopId])
  return(
    <ReceiveInfoContanier>
      <div className="receive-wrapper">
      <div className="top-cover"></div>
      <div className="sender-info">
        {
          // <Image src={profileInfo?.avatar} size={30} style={{ margin: '0 4px'}}/>
          profileInfo?.avatar &&
          <Image src={profileInfo?.avatar} size={30} style={{ margin: '0 4px'}}/>
        }
        {
          receivedInfo?.sender && !profileInfo?.avatar &&
          <Jazzicon address={receivedInfo?.sender} className="avatar-image"/>
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
      
      <div className="receive-num">{receivedAmount}</div>
      <div className="divider"></div>
      {
        hasRedPacket &&
        <div className="receive-list-wrapper">
          {
            receiveList.map((item,index)=> {
              return(
                <div className="receive-list" key={index}>
                  <div className="receive-list-item">
                    <div className="left">
                      {
                        item?.profile?.avatar &&
                        <Image src={item?.profile?.avatar} size={30} style={{ margin: '0 4px'}}/>
                      }
                      {/* <span className="avatar">{item?.profile?.avatar}</span> */}
                      {
                        item?.sender && !item?.profile?.avatar &&
                        <Jazzicon address={item?.sender} className="avatar-image"/>
                      }
                      <span className="name">{item?.profile?.name}</span>
                    </div>
                    <div className="right">{(Math.floor(ethers.utils.formatUnits(item?.amount, 18) * 10000)/10000)}<span className="symbol">{receiveSymbol}</span></div>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
      
      {
         +receivedInfo?.lastCount === 0 && !hasRedPacket &&
         <div className="view-text" onClick={() => { setHasRedPacket(true)}}>View details<span className="iconfont icon-expand"></span></div>
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