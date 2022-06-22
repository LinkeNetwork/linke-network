import { useEffect, useState } from "react"
import styled from "styled-components"
import { createClient } from 'urql'
import { formatAddress } from "../../utils";
import useChain from '../../hooks/useChain'
import { useHistory } from 'react-router-dom'
import useGlobal from "../../hooks/useGlobal"
import Image from '../../component/Image'
import { Jazzicon } from '@ukstv/jazzicon-react'
export default function FollowerList(props) {
  const { urlParams, followType, hiddenFollowerList } = props
  const { setState } = useGlobal()
  const history = useHistory()
  const { getChainInfo } = useChain()
  const [followerList, setFollowerList] = useState([])
  const [followerCount, setFollowerCount] = useState()
  const getAvatar = async(ids, list) => {
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
    let profiles = res?.data?.profiles
    const noProfiles = ids.filter(ele => profiles.every(item => item.id !== ele))
    noProfiles.map(item => {
      profiles.push({
        name: '',
        id: item,
        avatar: ''
      })
    })
    setFollowerList(profiles)
    console.log(noProfiles, profiles, 'noProfiles==')
  }
  const geFollowerList = async () => {
    const networkInfo = await getChainInfo()
    let tokensQuery = ''
    if(followType === 1) {
      tokensQuery = `
      query{
        followers(where:{from: "`+ urlParams?.toLowerCase() + `"}){
          id,
          to,
          from
        }
      }
      `
    } else {
      tokensQuery = `
        query{
          followers(where:{to: "`+ urlParams?.toLowerCase() + `"}){
            id,
            to,
            from
          }
        }
        `
    }
    const client = createClient({
      url: networkInfo?.APIURL
    })
    const res = await client.query(tokensQuery).toPromise()
    const data = res?.data?.followers
    const ids = followType === 1 ? data.map(item => item.to) : data.map(item => item.from)
    setFollowerCount(res.data.followers.length)
    getAvatar(ids, res.data.followers)
  }
  const viewProfile = (item) => {
    hiddenFollowerList()
    setState({
      currentProfileAddress: item.id
    })
    history.push({
      pathname: `/profile/${item.id}`,
      state: item.id
    })
  }
  useEffect(() => {
    geFollowerList()
  }, [])
  return (
    <FollowerListContainer>
      <div className="follower-count">{followerCount}</div>
      <div className="follower-wrap">
        {
          followerList && followerList.map(item => {
            return (
              <div className="follower-list" onClick={() => viewProfile(item)} key={item.id}>
                {/* <Image src={item.avatar} size={35} /> */}
                {
                  item.avatar 
                  ? <Image size={35} src={item.avatar}/>
                  : <Jazzicon address={item.id} className="avatar-icon" />
                }
                <div className="name">{item.name}</div>
                <div className="address">({formatAddress(item.id)})</div>
              </div>
            )
          })
        }
      </div>

    </FollowerListContainer>
  )
}
const FollowerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-height: 506px;
  .follower-wrap {
    display: flex;
    padding-right: 20px;
    max-height: 400px;
    overflow-y: auto;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .follower-list{
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .follower-count {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .address {
    margin: 3px 0 0 2px;
    font-size: 12px;
    font-weight: bold
  }
  .name {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
  }
  .avatar-icon {
    width: 35px;
    height: 35px;
  }
`