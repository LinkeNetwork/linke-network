import { useEffect, useState } from "react"
import styled from "styled-components"
import useChain from '../../hooks/useChain'
import Image from '../../component/Image'
import { useHistory } from 'react-router-dom'
import { Jazzicon } from '@ukstv/jazzicon-react'
import multiavatar from '@beeprotocol/beemultiavatar/esm'
import { createClient } from 'urql'
import { PUBLIC_GROUP_ABI } from '../../abi'
import { detectMobile, formatAddress, getLocal, getDaiWithSigner} from "../../utils"
import useGroupMember from '../../hooks/useGroupMember'
import useGlobal from "../../hooks/useGlobal"
export default function GroupMember(props) {
  const {currentAddress, closeGroupMember} = props
  const { setState } = useGlobal()
  const {getGroupMember} = useGroupMember()
  const [memberList, setMemberList] = useState([])
  const [manager,setManager] = useState()
  const history = useHistory()
  const [showOperate, setShowOperate] = useState()
  const [index, setIndex] = useState(-1)
  const [groupInfo, setGroupInfo] = useState()
  const { getChainInfo } = useChain()
  const getMemberList = async() => {
    const data = await getGroupMember(currentAddress)
    const memberListInfo = data?.users.map((item) => {
      return {
        ...item,
        showProfile: false
      }
    })
    setMemberList(memberListInfo)
    setGroupInfo(data)
    console.log(memberList, memberListInfo, 'memberList====')
  }
  const handleViewProfile = (item, index) => {
    // setIndex(index)
    item.showProfile = true
    setShowOperate(true)
    setTimeout(() => {
      item.showProfile = false
      setShowOperate(false)
    }, 4000)
  }
  const viewProfile = (item) => {
    setState({
      currentProfileAddress: item.id
    })
    history.push({
      pathname: `/profile/${item.id}`,
      state: item.id
    })
  }
  const groupInfoList = () => {
    return (
      <div className="group-info-wrap">
        <div className="item">
          <span className="name">Group Name: </span>
          <span className="value">{groupInfo?.name}</span>
        </div>
        <div className="item">
          <span className="name">Group Description: </span>
          <span className="value">{groupInfo?.description}</span>
        </div>
      </div>
    )
  }
  const handleClick = (e) => {
    if(e.target.id == 'memberItem') {
      // console.log(index, 'memberItem===')
      // if(index === -1) return
      // memberList[index].showProfile = false
      // console.log(memberList, 'memberList===')
      // setMemberList(memberList)
    }
    // console.log(e.target, memberList, 'handleClick===')
  }
  const getManager = async() => {
    const tx = await getDaiWithSigner(currentAddress, PUBLIC_GROUP_ABI).profile()
    setManager(tx.manager)
    console.log(tx, 'tx===manager')
  }
  useEffect(() => {
    getManager()
    getMemberList()
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])
  return (
    <GroupMemberContainer className={detectMobile() ? 'member-wrap-client': ''}>
      <div className="title">
        <span>Group Info</span>
        <span className="iconfont icon-close" onClick={closeGroupMember}></span>
      </div>
      {
        groupInfoList()
      }
      <div className="sub-title">
        Members {
          groupInfo?.userCount &&
          <span>({groupInfo?.userCount})</span>
        }
      </div>
      <div className='search-wrap'>
        <div className="position-relative">
          <span className="icon-search-wrapper">
            <i className="iconfont icon-search"></i>
          </span>
          <input className="search-input" type="search" placeholder="Search..." aria-label="Search..." />
        </div>
      </div>
      <div className="member-list">
        {
          memberList?.map((item,index) => {
            return (
              <div className="item" key={index} id="memberItem">
                {
                  item.showProfile &&
                  <div className='user-profile-wrap'>
                      {
                        item.profile.avatar
                        ? <Image src={item.profile.avatar} size={60}/>
                        : <Jazzicon address={item.id} className="avatar-image"/>
                      }
                    <div className='name'>{formatAddress(item.id)}</div>
                    <div className="view-btn" onClick={() => viewProfile(item)}>View</div>
                    {showOperate && <span></span>}
                  </div>
                }
                <div className="avatar" onClick={() => handleViewProfile(item, index)}>
                  {
                    item.profile.avatar 
                    ? <Image src={item.profile.avatar} size={40}/>
                    : <Jazzicon address={item.id} className="avatar-icon"/>
                  }
                  
                </div>
                <div className="name">{item.name || item.profile.name}</div>
                <div className="address">
                  {formatAddress(item.id)}
                </div>
                { getLocal('account') == item.id && manager?.toLowerCase() !== item.id.toLowerCase() && <div>(You)</div>} 
                { manager?.toLowerCase() == item.id.toLowerCase() && <div>(Owner)</div>} 
              </div>
            )

          })
        }
      </div>
    </GroupMemberContainer>
  )
}
const GroupMemberContainer = styled.div`
position: absolute;
right: 0;
left: 70%;
bottom: 0;
top: 0;
background: #eee;
z-index: 31;
&.member-wrap-client {
  left: 0;
  .title {
    left: 0
  }
}
.title {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  position: fixed;
  left: 70%;
  right: 0;
  top: 0;
}
.iconfont {
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.search-wrap {
  margin: 10px;
  background: #fff;
  height: 40px;
  border-radius: 2px;
}
.icon-search-wrapper{
  left: 50px;
}
.search-input{
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 10px 20px 10px 35px;
}
.avatar-icon {
  width: 40px;
  height: 40px
}
.member-list {
  height: calc(100vh - 310px);
  overflow: auto;
  .item {
    display: flex;
    height: 60px;
    background: #fff;
    margin: 6px 10px;
    border-radius: 2px;
    align-items: center;
    padding: 0 20px;
    position: relative;
    &:nth-child(1), &:nth-child(2) {
      .user-profile-wrap {
        margin-top: 140px;
      }
    }
  }
  .avatar-image {
    width: 60px;
    height: 60px;
  }
  .name {
    font-weight: bold;
    font-size: 16px;
    margin-left: 16px;
  }
  .address{
    margin-left: 4px;
    font-size: 12px;
  }
}
.group-info-wrap {
  background: #fff;
  margin: 70px 10px 0;
  padding: 20px 20px 10px;
  .item {
    margin-bottom: 20px;
    .name {
      font-weight: bold;
      font-size: 15px;
    }
    .value {

    }
  }
}
.sub-title {
  margin: 10px;
  background: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}
`